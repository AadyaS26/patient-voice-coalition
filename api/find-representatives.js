// api/find-representatives.js
//
// Takes a street address, geocodes it using the free U.S. Census Bureau
// geocoder (no API key needed), then looks up the legislators for those
// exact coordinates via the OpenStates API — which returns BOTH state
// legislators and federal members of Congress for a given point.
//
// Legislators without a public email are filtered out entirely, since
// there's nothing to actually send a message to. Federal members of
// Congress (U.S. Senate/House) rarely publish a direct email — Congress
// intentionally routes constituents through contact forms instead — so
// results skew toward state legislators, who publish email more often.
// That's an inherent limit of what's publicly available, not a bug.
//
// Required environment variable:
//   OPENSTATES_API_KEY
const CENSUS_GEOCODER_URL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";
const OPENSTATES_PEOPLE_GEO_URL = "https://v3.openstates.org/people.geo";

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

async function geocodeAddress(address) {
  const url = `${CENSUS_GEOCODER_URL}?address=${encodeURIComponent(address)}&benchmark=Public_AR_Current&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Census geocoder returned ${res.status}`);
  const data = await res.json();
  const match = data?.result?.addressMatches?.[0];
  if (!match) return null;
  return {
    lat: match.coordinates.y,
    lng: match.coordinates.x,
    matchedAddress: match.matchedAddress,
  };
}

async function findLegislators(lat, lng) {
  const url = `${OPENSTATES_PEOPLE_GEO_URL}?lat=${lat}&lng=${lng}&apikey=${process.env.OPENSTATES_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenStates returned ${res.status}`);
  const data = await res.json();

  const all = (data?.results || []).map((person) => {
    const emailDetail = (person.contact_details || []).find(
      (d) => d.type === "email" || d.note?.toLowerCase().includes("email")
    );
    const email = person.email || emailDetail?.value || null;

    // jurisdiction.classification is "country" for federal members of
    // Congress and "state" for state legislators — this is the correct
    // signal to use for the label, not just upper/lower chamber, which
    // was previously mislabeling U.S. Senators as "State Senate."
    const isFederal = person.jurisdiction?.classification === "country";
    const isUpper = person.current_role?.org_classification === "upper";

    let chamber;
    if (isFederal) {
      chamber = isUpper ? "U.S. Senate" : "U.S. House of Representatives";
    } else {
      chamber = isUpper ? "State Senate" : "State House/Assembly";
    }

    return {
      id: person.id,
      name: person.name,
      party: person.party,
      image: person.image || null,
      chamber,
      isFederal,
      district: person.current_role?.district || null,
      title: person.current_role?.title || null,
      email,
      openstatesUrl: person.openstates_url || null,
    };
  });

  // Only keep legislators we can actually message.
  return all.filter((person) => isNonEmptyString(person.email));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  if (!process.env.OPENSTATES_API_KEY) {
    console.error("Missing OPENSTATES_API_KEY");
    return res.status(500).json({ ok: false, error: "Server is not configured yet." });
  }
  const { address } = req.body || {};
  if (!isNonEmptyString(address)) {
    return res.status(400).json({ ok: false, error: "Please enter your address." });
  }
  try {
    const location = await geocodeAddress(address.trim());
    if (!location) {
      return res.status(404).json({
        ok: false,
        error: "We couldn't find that address. Try including your street number, city, and state.",
      });
    }
    const representatives = await findLegislators(location.lat, location.lng);
    return res.status(200).json({
      ok: true,
      matchedAddress: location.matchedAddress,
      representatives,
    });
  } catch (err) {
    console.error("find-representatives error", err);
    return res.status(502).json({ ok: false, error: "Could not look up representatives right now. Please try again." });
  }
}
