// api/find-representatives.js
//
// Takes a street address, geocodes it using the free U.S. Census Bureau
// geocoder (no API key needed), then looks up the state legislators for
// those exact coordinates via the OpenStates API.
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
  return (data?.results || []).map((person) => {
    const emailDetail = (person.contact_details || []).find(
      (d) => d.type === "email" || d.note?.toLowerCase().includes("email")
    );
    const capitolOffice = (person.offices || []).find((o) => o.classification === "capitol") || person.offices?.[0];

    return {
      id: person.id,
      name: person.name,
      party: person.party,
      image: person.image || null,
      chamber: person.current_role?.org_classification === "upper" ? "State Senate" : "State House/Assembly",
      district: person.current_role?.district || null,
      title: person.current_role?.title || null,
      email: person.email || emailDetail?.value || null,
      openstatesUrl: person.openstates_url || null,
      contactUrl: capitolOffice?.voice ? null : person.openstates_url,
    };
  });
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
