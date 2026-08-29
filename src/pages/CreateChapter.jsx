import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import "./CreateChapter.css";

// ---- Chapter directory data ----
// Real bios/photos only for chapters that have actually sent them, with
// consent to be shown publicly. Everyone else shows as an open "New
// chapter" card until their info comes in.
//
// This is the ONLY place chapter data lives. src/pages/CurrentChapters.jsx
// imports the ChapterDirectory component from this file rather than
// keeping its own copy — two copies drifting out of sync is exactly what
// caused Shari/Melanie/Dyllan's updates to not show up on the
// /current-chapters page after they were added here.
const CHAPTERS = [
  {
    first: "Katherine", lastInitial: "H", city: "Virginia Beach", region: "Virginia", country: "US",
    photo: "/chapter-photos/katie.jpg", handle: null,
    bio: "Hi, I'm Katie, a college student and autoimmune disease advocate who has navigated years of chronic illness, multiple autoimmune diagnoses, and the ongoing search for answers. I'm passionate about using my voice to raise awareness, connect with others, and remind people that even when the journey to a diagnosis is long and uncertain, no one has to navigate it alone.",
  },
  {
    first: "Jehan", lastInitial: "Z", city: "Orland Park", region: "Illinois", country: "US",
    photo: "/chapter-photos/jehan.jpg", handle: null,
    bio: "Hey everyone — I'm JZ from Chicago. I am 39 years old and have been fighting Crohn's disease since I was 12. I now have a permanent ileostomy bag. I joined a chapter because I want to help people cope with this disease. I love giving advice and being an ear to cry/vent to.",
  },
  {
    first: "Farnaz", lastInitial: "V", city: "Shiraz", region: null, country: "Iran",
    photo: "/chapter-photos/farnaz.jpg", handle: null,
    bio: "I'm a CIDP patient and I started CIDP Iran to raise awareness about CIDP and create a supportive space for people living with the condition in Iran. I wanted to connect patients, share reliable information and real-life experiences, and most importantly, help people feel less alone in their journey.",
  },
  {
    first: "Veronika", lastInitial: "M", city: "Prague", region: null, country: "Czech Republic",
    photo: "/chapter-photos/veronika.jpg", handle: "@autoimmunevoicesCzechia",
    bio: "Hi, my name is Veronika, I am from a little country in Central Europe named Czech Republic, or Czechia. I decided to join because I like helping people, so why not try it! My city is Prague, but since we are a small country, I'll be representing Czechia as a whole.",
  },
  {
    first: "Aadya", lastInitial: "S", city: "Sammamish", region: "Washington", country: "US",
    photo: null, handle: null, role: "founder",
    bio: "I founded AutoimmuneVoices after seeing how difficult it can be for people with autoimmune and chronic conditions to understand the policies that affect them. I wanted to create a space that makes advocacy easier and gives people a way to use their voices, connect with others, and create change in their own communities.",
  },
  {
    first: "Desiree", lastInitial: "B", city: "Wilmington", region: "North Carolina", country: "US",
    photo: "/chapter-photos/desiree.jpg", handle: null,
    bio: "I'm Desiree, a Wilmington, NC-based community builder and founder of Gluten-Free Wilmy, created from my own experience navigating celiac disease. I'm passionate about connecting people, sharing resources, and creating a supportive community where those living with autoimmune disease feel seen, understood, and less alone.",
  },
  { first: "Cecilia", lastInitial: "G", city: "Modesto", region: "California", country: "US", photo: null, handle: null, bio: null },
  {
    first: "Hana", lastInitial: "S", city: "Jefferson", region: "Massachusetts", country: "US",
    photo: "/chapter-photos/hana.jpg", handle: null,
    bio: "I'm Hana, a young advocate for the celiac community and the founder of The Celiac Table. I'm passionate about raising awareness of celiac disease, supporting families navigating a gluten-free lifestyle, and creating greater access to safe gluten-free foods in my community.",
  },
  {
    first: "Krystal", lastInitial: "P", city: "Detroit", region: "Michigan", country: "US",
    photo: "/chapter-photos/krystal.jpg", handle: null,
    bio: "My name is Krystal Parker, but most people call me Krys. I'm 40 years old and I live in Detroit, Michigan. I have Rheumatoid Arthritis, Lupus, and Sjogren's Syndrome. I have a B.A. in Business and I'm currently studying psychology to become a therapist. I became a Chapter Leader because I would love to bring more awareness to autoimmune diseases and the needs of the community within them — from education on autoimmune diseases, to providing information for our allies, to advocating for ourselves with doctors, insurance companies, and lawmakers.",
  },
  {
    first: "Liesel", lastInitial: "R", city: "Gold Coast", region: "Queensland", country: "Australia",
    photo: "/chapter-photos/liesel.jpg", handle: null,
    bio: "Hi! I'm Liesel, a doctor who lives with Crohn's Disease and an ileostomy. I'm passionate about supporting fellow ostomates, and advocating for the IBD community. I'm excited to be connected with a worldwide community of people living with autoimmune disease - together we can make a difference!!",
  },
  {
    first: "Astha", lastInitial: "", city: "Delhi", region: null, country: "India",
    photo: null, handle: null,
    bio: "Astha is an undergraduate student and the Delhi Chapter Lead for AutoimmuneVoices. Through her advocacy, she hopes to help people with autoimmune conditions feel more comfortable with themselves and recognize that no one has to be perfect. She is especially interested in addressing the self-criticism and social judgment that can continue even when someone's condition is in remission.",
  },
  {
    first: "Cece and Craven", lastInitial: "", city: "Brighton", region: null, country: "United Kingdom",
    photo: "/chapter-photos/cece.jpg", handle: null,
    bio: "We're Cece and Craven, and Craven is diabetic. We're passionate about changing the way type 1 diabetes is understood and treated. Too many people still don't know what T1D actually is, how serious it can be, or how quickly someone can become dangerously ill with DKA, and we want to change that. We're campaigning for greater awareness, earlier screening and diagnosis, equal access to diabetes technology and treatments, an end to stigma, better mental-health support, and more investment in research and life-changing therapies.",
  },
  {
    first: "Alex", lastInitial: "B", city: "Sydney", region: "New South Wales", country: "Australia",
    photo: "/chapter-photos/alex.jpg", handle: null,
    bio: "I'm AB, the founder of @chronically_ill_af and part of the Sydney Chapter of AutoimmuneVoices. I joined because living with autoimmune disease can feel incredibly isolating, and I wanted to help create a community where people feel seen, heard and supported, while still being able to laugh at the absolute chaos of chronic illness. I'm passionate about advocacy, accessibility and making sure people with invisible illnesses know they're not alone.",
  },
  {
    first: "Lexi", lastInitial: "P", city: "Waltham", region: "Massachusetts", country: "US",
    photo: "/chapter-photos/lexi.jpg", handle: null,
    bio: "Hi, I'm Lexi! I'm an environmental studies and biology double major at Brandeis University. In addition, I have a huge passion for women's health care and advocacy. I will continue to advocate for reproductive health awareness, research, and rights as well as digestive disorders which are near to my heart.",
  },
  { first: "Jenna", lastInitial: "B", city: "Ellensburg", region: "Washington", country: "US", photo: null, handle: null, bio: null },
  {
    first: "Kayleigh", lastInitial: "J", city: "Trinidad", region: null, country: "Trinidad and Tobago",
    photo: "/chapter-photos/kayleigh.jpg", handle: null,
    bio: "Hi! I'm Kayleigh, 18, and I was diagnosed with endometriosis last year. After a failed laparoscopy, I still deal with chronic pain, fevers, and other symptoms. However, my country Trinidad and Tobago has a lot of doctors that are dismissive of my condition, and we have limited resources for it. I hope I can help advocate for my illness!",
  },
  {
    first: "Ry", lastInitial: "L", city: "Weatherford", region: "Texas", country: "US",
    photo: "/chapter-photos/ry.jpg", handle: null,
    bio: "I am 21 years old living with multiple chronic illnesses and I believe in uplifting the voices of people in my community whose voices are often suppressed by legislation. I want to help spread awareness and call for action among the general local community in hopes of empowering those of us who are fighting for health and recognition!",
  },
  {
    first: "Nidhi", lastInitial: "N", city: "Charlotte", region: "North Carolina", country: "US",
    photo: "/chapter-photos/nidhi.jpg", handle: null,
    bio: "I'm Nidhi, a Senior Finance Consultant at Cargill, communication coach, artist, and entrepreneur who is passionate about leadership, community building, and empowering people to use their voices. I believe meaningful change begins with awareness, open conversations, and the willingness to listen to one another. As a Charlotte Chapter leader for AutoimmuneVoices, I'm excited to connect people, amplify stories, and help build a stronger, more supportive community around autoimmune awareness.",
  },
  {
    first: "Laura", lastInitial: "H", city: "Adelaide", region: "South Australia", country: "Australia",
    photo: "/chapter-photos/laura.jpg", handle: null,
    bio: "Hey everyone! My name is Laura Hutchins, I'm 26 years old from Adelaide, South Australia. I was 12 years old when I was diagnosed with rheumatoid arthritis, and have multiple permanent joint deformities. Before the diagnosis I was extremely active, and my favourite hobbies were gymnastics, dance, ballet, and piano. Today at 26 I'm extremely passionate about animals, making YouTube videos, yoga, and advocacy. I know how devastating it is to have your life completely impacted by an autoimmune disease, and I'm proud to be an advocate and raise awareness for these hidden disabilities.",
  },
  {
    first: "Carlos", lastInitial: "P", city: "New Orleans", region: "Louisiana", country: "US",
    photo: "/chapter-photos/carlos.jpg", handle: null,
    bio: "I want to lead a chapter because, as a longtime community advocate and someone who lives with an autoimmune condition, I never wanted anyone to feel as alone as I did. As the former Minister of Information for the Young Lords, I feel it's still my mission and responsibility to be there for my community and make sure they're taken care of.",
  },
  {
    first: "Cinta", lastInitial: "", city: "Bandung", region: null, country: "Indonesia",
    photo: "/chapter-photos/cinta.jpg", handle: null,
    bio: "Hi! My name is Cinta. I was diagnosed with lupus when I was 17 and being diagnosed with an autoimmune condition has been a significant struggle for me, mostly due to the difficulty of finding information about the disease and the fact that so many people are unfamiliar with or do not understand it. That is why I have joined this chapter — to make it easier for fellow survivors, friends, family members, and caregivers to access adequate information about autoimmune lupus.",
  },
  {
    first: "Alicia", lastInitial: "T", city: "Victorville", region: "California", country: "US",
    photo: "/chapter-photos/alicia.jpg", handle: "@theinflamednurse",
    bio: "It's essential for us to find one another to strengthen policies that support autoimmune and chronic conditions at the local level. By sharing our stories, we create a collective of lived experience that can be shared with those who create policy. Our collective action strengthens knowledge of autoimmune disorders and is an essential part of democracy.",
  },
  {
    first: "Melitta", lastInitial: "T", city: "Chester", region: "Virginia", country: "US",
    photo: "/chapter-photos/melitta.jpg", handle: "@flarebutfavored",
    bio: "Hi, I'm Melitta Tweh, and I'm honored to lead the AutoimmuneVoices Chester, Virginia Chapter. I was diagnosed with lupus, rheumatoid arthritis, interstitial lung disease, MCTD (mixed connective tissue disease), and a nerve disorder. Living with chronic illness has shown me how important it is to have a community where people feel seen, supported, and understood, which inspired me to create a space for others navigating autoimmune disease. My hope is to bring people together through encouragement, advocacy, education, and genuine connection while reminding others that their diagnosis does not define who they are.",
  },
  {
    first: "Shayla", lastInitial: "C", city: "Rogers", region: "Arkansas", country: "US",
    photo: "/chapter-photos/shayla.jpg", handle: "@crafton_shayla",
    bio: "Hi there! My name is Shayla, and I'm a recent Bachelor of Science in Nursing graduate and a Registered Nurse. I'm also embarking on my Doctoral journey. I have 2 confirmed autoimmune diseases: Hashimoto's thyroiditis (since age 3), and UCTD. Throughout my experiences as a patient, student, coach, and nurse, I've gained a deep understanding of the healthcare system. I've noticed that symptoms in children and young adults are often dismissed or overlooked altogether. My goal is to raise awareness, build confidence, share reliable information, and help others feel less alone. This area is my home, and it's filled with small towns where access to healthcare can be limited. I'm passionate about making a difference in this community and ensuring that everyone has the support they deserve.",
  },
  {
    first: "Mimi", lastInitial: "", city: "Miami", region: "Florida", country: "US",
    photo: "/chapter-photos/mimi.jpg", handle: null,
    bio: "The main reason why I want to open a chapter is because about 4 years ago I was diagnosed with lupus and I had a really hard time with it. No one understood what I was going through and I had no one in a similar position to talk to. It took a big effect on my mental health as well and I think with starting a chapter I can help raise awareness of the importance of understanding other people's health and mental issues.",
  },
  {
    first: "Madison", lastInitial: "", city: "Pittsburgh", region: "Pennsylvania", country: "US",
    photo: "/chapter-photos/madison.jpg", handle: "@celiacsafepgh",
    bio: "I was diagnosed with celiac disease in 2023, and since then I've become really passionate about education and advocacy. I started @celiacsafepgh to help people in Pittsburgh navigate celiac disease and feel less alone, and through that community I've seen how much need there is for better autoimmune education, resources, and awareness locally. I'd love to bring that same energy to a Pittsburgh chapter, connect people in the autoimmune community, and help amplify patient voices through education and advocacy.",
  },
  {
    first: "Tina", lastInitial: "D", city: "Saint Petersburg", region: "Florida", country: "US",
    photo: "/chapter-photos/tina.jpg", handle: null,
    bio: "My name is Tina and I am a social worker/therapist in St. Pete, FL. I live with my spouse and two dogs. I have a huge passion for disability justice and lived experience with RA and fibromyalgia, and now my doctors feel lupus is in the mix. I have struggled with weight stigma my entire life, leading to going undiagnosed for probably 10 years that I am aware of. I am currently struggling to obtain proper treatment due to insurance. I believe folks with chronic illness/disabilities deserve better, and that we need our voices to be heard.",
  },
  {
    first: "Baibhav", lastInitial: "S", city: "Hetauda", region: null, country: "Nepal",
    photo: "/chapter-photos/baibhav.jpg", handle: null,
    bio: "Hi, I'm Baibhav, a youth social entrepreneur and technology advocate from Hetauda, Nepal. I'm passionate about using technology, community building, and policy to address issues that affect people's everyday lives. I joined AutoimmuneVoices because I believe people should have a stronger voice in the policies that affect their health, and I'm excited to help build that voice in Nepal.",
  },
  {
    first: "Breauna", lastInitial: "A", city: "Ford City", region: "Pennsylvania", country: "US",
    photo: "/chapter-photos/breauna.jpg", handle: null,
    bio: "Hello! I'm Breauna. At 17, I was diagnosed with Multiple Sclerosis. Now at 21, I've had my ups and downs with this disease, however, I never let it stop me or define me in any way. I've wanted to start this chapter to give individuals with autoimmune diseases an outlet for support and encourage them to grow no matter how hard it gets.",
  },
  {
    first: "Celina", lastInitial: "C", city: "San Antonio", region: "Texas", country: "US",
    photo: "/chapter-photos/celina.jpg", handle: null,
    bio: "Hi, I'm Celina! I'm 22 years old and originally from San Antonio, Texas, but I currently reside in the Rio Grande Valley. I'm honored to lead the South Texas chapter of AutoimmuneVoices! My autoimmune journey began at 15, when I first started experiencing symptoms, and I was diagnosed with psoriatic spondylitis at 18. My experiences have shaped my passion for advocacy and shown me how important it is to feel heard, understood, and supported. I'm currently in a Doctor of Physical Therapy program, and I hope to carry advocacy into my future profession. I've also recently joined the Arthritis Foundation as an advocate, and I'm passionate about raising awareness of autoimmune conditions and creating a space where everyone feels comfortable, welcomed, and never alone.",
  },
  {
    first: "Priyanshi", lastInitial: "M", city: "Phagwara", region: null, country: "India",
    photo: "/chapter-photos/priyanshi.jpg", handle: null,
    bio: "Hey everyone! I'm Priyanshi from India. I'm a PhD student researching psoriasis and its progression. I've experienced health issues since childhood, including skin rashes, eczema, and digestive problems. In my early twenties, following a medication reaction, I developed severe palmoplantar psoriasis. After multiple treatments and steroids, the condition is more manageable today, though I still live with it and manage it with medication. My personal journey led me to research the disease more deeply, and I joined AutoimmuneVoices to connect with others who understand this journey, raise awareness, advocate for our community, and share and learn from each other's experiences.",
  },
  {
    first: "Aiza", lastInitial: "A", city: "Multan", region: null, country: "Pakistan",
    photo: "/chapter-photos/aiza.jpg", handle: null,
    bio: "Hey, Aiza Abbas here, a student and the founder of Autoimmune Atlas, a Pakistan-based initiative focused on autoimmune diseases. I started Autoimmune Atlas after realizing how many gaps still exist in the way autoimmune diseases are understood, researched, diagnosed, and supported, particularly in Pakistan. I want to hear from patients, learn from doctors and researchers, and understand these gaps better — not just talk about them, but see what we can actually do about them.",
  },
  {
    first: "Emma", lastInitial: "J", city: "Chesapeake", region: "Virginia", country: "US",
    photo: "/chapter-photos/emma.jpg", handle: null,
    bio: "Hi, I'm Emma! I am from Chesapeake, Virginia! I was diagnosed with a rare disease/chronic illness called VACTERL association. With many surgeries and doctors' appointments, I want to be able to raise awareness more than ever in my community!! I am currently in college studying Biology and hoping to get my master's! I hope to be able to work with other chapters, our community, and local hospitals to better the systems. And to also be a shoulder people can lean on!",
  },
  {
    first: "Vaishali", lastInitial: "", city: "India", region: null, country: "India",
    photo: "/chapter-photos/vaishali.jpg", handle: null,
    bio: "I'm Vaishali Batra — a finance professional, a lifelong learner, and someone who has lived with celiac disease since childhood. I lead with that not because celiac defines me, but because it shaped me. Long before I understood balance sheets, I was learning to read every label, ask questions others never had to, and advocate for myself when no one understood what I needed. That builds a discipline and a quiet strength you carry into everything — the kind that comes from managing something invisible, every day, without waiting for permission. Living with an autoimmune condition has never made my life smaller. It's made me more aware, more empathetic, and more willing to speak openly about what so many of us carry alone. That's why I'm proud to lead this chapter. I want to build a space where no one has to explain themselves twice — where the fatigue, the constant adjustments, and the small daily wins are understood without translation. Where we don't just cope with our conditions; we live fully alongside them. I'll bring my story. I'll learn from yours. And together, we become more than a group defined by what we manage — a community made stronger by it. Because sometimes, what makes life different is exactly what makes us strong.",
  },
  { first: "Morgan", lastInitial: "A", city: "San Diego", region: "California", country: "US", photo: null, handle: null, bio: null },
  {
    first: "Sofia", lastInitial: "C", city: "Corona", region: "California", country: "US",
    photo: "/chapter-photos/sofia.jpg", handle: null,
    bio: "My name is Sofia Carpio, I'm 16, and currently a junior in high school. I'm striving to become a neurosurgeon and my dream school is University of California, Irvine. I wanted to become a chapter leader because although I don't personally struggle with an autoimmune disease myself, I want to not only educate and advocate for this community, but show them that their efforts, strength, and struggles do not go unnoticed. You all are seen, understood, and not alone.",
  },
  {
    first: "Iza", lastInitial: "M", city: "Sialkot", region: null, country: "Pakistan",
    photo: "/chapter-photos/iza.jpg", handle: null,
    bio: "As a 32-year-old medical researcher based in Pakistan specializing in autoimmune diseases, my dedication to this field is deeply personal. Having navigated the daily realities of IBD, ankylosing spondylitis, and alopecia areata since the tender age of four, I understand the profound challenges of living with chronic conditions firsthand. Today, my mission extends far beyond the laboratory: I am devoted to lifting the spirits of others on this same journey, offering motivation, empathy, and comfort through the healing power of food—ultimately striving to bring smiles back to the faces of those who need it most.",
  },
  {
    first: "Niamh", lastInitial: "A", city: "Mooloolaba", region: "Queensland", country: "Australia",
    photo: "/chapter-photos/niamh.jpg", handle: null,
    bio: "I'm Niamh, a menstrual and hormonal coach, chronic illness advocate, and now a Chapter Leader dedicated to helping women feel more informed, empowered, and connected to their bodies. For years, I've had to learn how to medically advocate for myself after being diagnosed with adenomyosis, endometriosis and fibromyalgia, alongside living with chronic pain and the realities of chronic illness. My own journey has taught me just how difficult it can be to navigate your health when you don't have the information, support or confidence to understand what is happening within your own body. That experience is a huge part of why I'm building Worn Souls — a space centred around menstrual and hormonal education, helping women better understand their cycles, reconnect with their bodies and feel more confident advocating for themselves. I share much of my own story publicly because I believe there is power in women seeing that they aren't alone. But I don't want to only share my story. I want to turn what I've lived through into action, education and meaningful support for other women. Becoming a Chapter Leader is also an opportunity for me to continue learning, expand my own education and surround myself with people who are passionate about changing the way women understand and navigate their health. I'm here because I know what it feels like to fight to be heard — and I want more women to feel equipped to speak up for themselves, ask questions and understand their bodies along the way.",
  },
  {
    first: "Kelly", lastInitial: "E", city: "Tralee", region: null, country: "Ireland",
    photo: "/chapter-photos/kelly.jpg", handle: null,
    bio: "Kelly England is an Oncology Nurse and mum of three boys living in Ireland, with over 17 years of nursing experience and extensive experience supporting people living with cancer and chronic health challenges. Having spent much of her career caring for patients, Kelly is now also experiencing healthcare from the patient perspective following her own health journey and diagnosis with PCOS. This has given her a deeper understanding of the challenges patients can face when navigating symptoms, diagnosis, treatment and healthcare services. Through her platform, From Scrubs to Sidelines, Kelly shares honest conversations around health, wellbeing, family life and the realities of navigating healthcare. As the Ireland Chapter Leader for AutoimmuneVoices, Kelly is passionate about raising awareness, making healthcare information easier to understand, amplifying patient experiences and helping people in Ireland feel more informed and empowered to have a voice in decisions affecting their care. She hopes to create a welcoming Irish community where lived experience, healthcare knowledge and advocacy come together to make a meaningful difference.",
  },
  {
    first: "Melanie", lastInitial: "S", city: "Odessa", region: "Missouri", country: "US",
    photo: "/chapter-photos/melanie.jpg", handle: "@automatically.auto.immune",
    bio: "My four children and I have autoimmune diseases/chronic illnesses. I am advocating for our children and others who need a voice. Invisible illnesses make day-to-day living challenging. I truly believe education = empathy.",
  },
  {
    first: "Dyllan", lastInitial: "G", city: "Philadelphia", region: "Pennsylvania", country: "US",
    photo: "/chapter-photos/dyllan.jpg", handle: "@greaterthanmydiagnosis",
    bio: "Hi! I'm Dyllan and I was diagnosed with Crohn's Disease at age 15. This chronic autoimmune condition primarily affects the GI tract but can impact other areas of the body as well. Besides stomach aches one of the most challenging symptoms I struggle with is chronic fatigue. I felt lonely and misunderstood when I was first diagnosed and that's why I am passionate about raising awareness and helping others.",
  },
  {
    first: "Shari", lastInitial: "G", city: "Phoenix", region: "Arizona", country: "US",
    photo: "/chapter-photos/shari.jpg", handle: "@pretty.disabled",
    bio: "I'm Shari G. Living with multiple chronic illnesses, including Lupus drives my passion for advocacy. For years, I have worked within the Arizona community to help my neighbors by bridging the gap on how local legislation impacts their daily lives and the people they love. I am dedicated to raising awareness and creating meaningful connections that make life better for all of us.",
  },
  {
    first: "Rebekah", lastInitial: "P", city: "Liverpool", region: null, country: "United Kingdom",
    photo: "/chapter-photos/rebekah.jpg", handle: "@myendojourneyb",
    bio: "Hi, I'm Rebekah, the face behind @myendojourneyb. I'm a chronic illness and endometriosis advocate from the UK, sharing the reality of living with invisible illnesses, chronic pain and the challenges that come with them. As a mum and patient, I'm passionate about raising awareness, helping others feel less alone and using my voice to support this amazing community. I'm so honoured to be a Chapter Lead for Autoimmune Voices.",
  },
  {
    first: "Angelina", lastInitial: "A", city: "Boston", region: "Massachusetts", country: "US",
    photo: "/chapter-photos/angelina.jpg", handle: "@thechronicallyiconic1",
    bio: "Hi! My name is Angelina and I'm from the Boston area. Ever since childhood, I had some strange happenings with my body. After COVID, in my late 20s, things exploded. Now I live with multiple chronic illnesses, syndromes, and autoimmune diseases. The ones that impact me the most are Lupus, Sjogrens, Dysautonomia, and MCAS and all of the comorbidities that come with them. Autoimmune advocacy is important to me because having one or more of these diseases is a full-time job. It's important to build a community where you can ask questions, get advice, find products that can help, help prep for appointments, gather tools to advocate, educate yourself and others, and even discover doctors that may be able to help you. My story is far from over as I'm still searching for the perfect treatment and more answers, but I like to use what I've already learned to help others.",
  },
  {
    first: "Savannah", lastInitial: "L", city: "Los Angeles", region: "California", country: "US",
    photo: "/chapter-photos/savannah.jpg", handle: "@blossomingvannah",
    bio: "My name is Vannah & my main diagnosis is coccidiomycosis a.k.a valley fever. It's a rare fungal illness & I just so happen to be the 1% of said illness. Through the last 11 years of my diagnosis I've experienced medical gaslighting, misdiagnosis & a bunch of trauma I didn't have had to go through. Because this I've had to learn how to advocate for myself, which is why I'm so passionate about this project.",
  },
  { first: "SarahBeth", lastInitial: "T", city: "Los Angeles", region: "California", country: "US", photo: null, handle: "@sarahbethsbt", bio: null },
];

function chapterLocation(c) {
  if (c.country === "US") return `${c.city}, ${c.region}`;
  return c.region ? `${c.city}, ${c.region}, ${c.country}` : `${c.city}, ${c.country}`;
}

const PERSON_ICON_COLORS = ["#206060", "#123838", "#8A5C3B"];

// Exported so src/pages/CurrentChapters.jsx can render the exact same,
// always-current directory instead of keeping its own separate copy.
export function ChapterDirectory() {
  const [selected, setSelected] = useState(new Set());

  // React Router doesn't auto-scroll to a #hash the way a plain <a> would.
  // Kept in case anything still links here with #chapter-directory, even
  // though the nav now points straight at /current-chapters.
  useEffect(() => {
    if (window.location.hash === "#chapter-directory") {
      document.getElementById("chapter-directory")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const usRegions = [...new Set(CHAPTERS.filter((c) => c.country === "US").map((c) => c.region))].sort();
  const intlCountries = [...new Set(CHAPTERS.filter((c) => c.country !== "US").map((c) => c.country))].sort();
  const filterOptions = [...usRegions, ...intlCountries];

  function toggleFilter(value) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  const filtered =
    selected.size === 0
      ? CHAPTERS
      : CHAPTERS.filter((c) => selected.has(c.country === "US" ? c.region : c.country));

  // Completed profiles (with a bio) show first; "New chapter" pending
  // cards sink to the bottom. Within the has-bio group, sorting by bio
  // length means the 2-column grid naturally pairs short bios with short
  // and long with long — each row ends up close in height instead of a
  // short card next to a much taller one, which is what was making the
  // page look uneven.
  const visible = [...filtered].sort((a, b) => {
    const aHasBio = a.bio ? 0 : 1;
    const bHasBio = b.bio ? 0 : 1;
    if (aHasBio !== bHasBio) return aHasBio - bHasBio;
    return (a.bio?.length || 0) - (b.bio?.length || 0);
  });

  return (
    <section className="chapter-directory" id="chapter-directory">
      <div className="chapter-directory-head">
        <span className="chapter-eyebrow">Already registered</span>
        <h2>{CHAPTERS.length} chapters, 513 members, and counting</h2>
        <p>
          See who's already building a chapter near you — or reach out if you'd rather join one than
          start your own.
        </p>
      </div>

      <div className="chapter-directory-filter-label">Filter by location</div>
      <p className="chapter-directory-filter-hint">
        Click as many as you want — showing chapters that match any selected location.
      </p>
      <div className="chapter-directory-pills">
        <button
          className={`chapter-directory-pill all-pill ${selected.size === 0 ? "active" : ""}`}
          onClick={() => setSelected(new Set())}
        >
          All
        </button>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            className={`chapter-directory-pill ${selected.has(opt) ? "active" : ""}`}
            onClick={() => toggleFilter(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="chapter-directory-result-row">
        <span>
          {visible.length} of {CHAPTERS.length} chapters shown
        </span>
        {selected.size > 0 && (
          <button className="chapter-directory-clear" onClick={() => setSelected(new Set())}>
            Clear filters
          </button>
        )}
      </div>

      <div className="chapter-directory-grid">
        {visible.map((c, i) => (
          <div className="chapter-directory-card" key={`${c.first}-${c.city}`}>
            <div className="chapter-directory-card-header">
              {c.photo ? (
                <img className="chapter-directory-avatar-img" src={c.photo} alt={`${c.first} ${c.lastInitial}.`} />
              ) : (
                <div
                  className="chapter-directory-avatar"
                  style={{ background: PERSON_ICON_COLORS[i % PERSON_ICON_COLORS.length] }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" fill="white" fillOpacity="0.9" />
                    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="white" fillOpacity="0.9" />
                  </svg>
                </div>
              )}
              <div className="chapter-directory-text">
                <div className="chapter-directory-name">
                  {c.first}
                  {c.lastInitial ? ` ${c.lastInitial}.` : ""}
                </div>
                <div className="chapter-directory-loc">{chapterLocation(c)}</div>
                {c.role === "founder" ? (
                  <span className="chapter-directory-badge founder">Founder</span>
                ) : c.bio ? (
                  <span className="chapter-directory-badge real">Chapter lead</span>
                ) : (
                  <span className="chapter-directory-badge pending">New chapter</span>
                )}
              </div>
            </div>
            {c.bio && <div className="chapter-directory-bio">{c.bio}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  "Washington, D.C.", "Outside the U.S.",
];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  city: "",
  state: "",
  chapterName: "",
  connection: "",
  interestedCount: "",
  social: "",
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function CreateChapter() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const errors = {
    fullName: form.fullName.trim() ? "" : "Enter your name.",
    email: isValidEmail(form.email) ? "" : "Enter a valid email.",
    city: form.city.trim() ? "" : "Enter your city.",
    state: form.state ? "" : "Choose a state.",
    chapterName: form.chapterName.trim() ? "" : "Give your chapter a name.",
    social: form.social.trim() ? "" : "Enter your Instagram or contact handle.",
  };
  const isValid = Object.values(errors).every((e) => !e);

  function update(field) {
    return (e) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (field === "city" || field === "state") {
        setForm((f) => {
          const nextCity = field === "city" ? value : f.city;
          const nextState = field === "state" ? value : f.state;
          const suggested = nextCity && nextState ? `${nextCity} Chapter` : f.chapterName;
          const wasAuto = !f.chapterName || f.chapterName.endsWith(" Chapter");
          return {
            ...f,
            [field]: value,
            chapterName: wasAuto ? suggested : f.chapterName,
          };
        });
      }
    };
  }

  function blur(field) {
    return () => setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      city: true,
      state: true,
      chapterName: true,
      social: true,
    });
    if (!isValid) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/register-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      setForm(EMPTY_FORM);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <>
        <Nav />
        <section className="chapter-page">
          <div className="chapter-shell chapter-shell--confirm">
            <span className="chapter-eyebrow">Chapter request received</span>
            <h1 className="chapter-confirm-title">You just planted a pin.</h1>
            <p className="chapter-confirm-body">
              Your chapter request is in. We'll reach out at the email you gave us
              with next steps for getting your chapter listed and connected to the
              advocate network.
            </p>
            <button
              type="button"
              className="chapter-link-button"
              onClick={() => setStatus("idle")}
            >
              Register another chapter
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Nav />
      <section className="chapter-page">
        <div className="chapter-shell">
          <div className="chapter-intro">
            <span className="chapter-eyebrow">Chapters</span>
            <h1 className="chapter-title">
              Every state needs
              <br />a voice. Start yours.
            </h1>
            <p className="chapter-body">
              AutoimmuneVoices chapters are local advocacy hubs — a handful of
              people in one place who track the bills that affect their
              community and speak up when it matters. Starting one takes five
              minutes. Growing it takes whoever you bring with you.
            </p>
            <ul className="chapter-facts">
              <li>
                <span className="chapter-facts-num">01</span>
                We list your chapter and connect you with nearby advocates
                already tracking legislation in your state.
              </li>
              <li>
                <span className="chapter-facts-num">02</span>
                You get early notice on bills in your state before hearings and
                votes, so your chapter can act while it counts.
              </li>
              <li>
                <span className="chapter-facts-num">03</span>
                No minimum size. Some chapters are one person with a mailing
                list. That's a chapter.
              </li>
            </ul>
          </div>

          <form className="chapter-form" onSubmit={handleSubmit} noValidate>
            <div className="chapter-field-row">
              <div className="chapter-field">
                <label htmlFor="fullName">Your name</label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={update("fullName")}
                  onBlur={blur("fullName")}
                  autoComplete="name"
                />
                {touched.fullName && errors.fullName && (
                  <span className="chapter-error">{errors.fullName}</span>
                )}
              </div>
              <div className="chapter-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  onBlur={blur("email")}
                  autoComplete="email"
                />
                {touched.email && errors.email && (
                  <span className="chapter-error">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="chapter-field-row">
              <div className="chapter-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={update("city")}
                  onBlur={blur("city")}
                />
                {touched.city && errors.city && (
                  <span className="chapter-error">{errors.city}</span>
                )}
              </div>
              <div className="chapter-field">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  value={form.state}
                  onChange={update("state")}
                  onBlur={blur("state")}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {touched.state && errors.state && (
                  <span className="chapter-error">{errors.state}</span>
                )}
              </div>
            </div>

            <div className="chapter-field">
              <label htmlFor="chapterName">Chapter name</label>
              <input
                id="chapterName"
                type="text"
                value={form.chapterName}
                onChange={update("chapterName")}
                onBlur={blur("chapterName")}
                placeholder="e.g. Bellevue Chapter"
              />
              {touched.chapterName && errors.chapterName && (
                <span className="chapter-error">{errors.chapterName}</span>
              )}
            </div>

            <div className="chapter-field">
              <label htmlFor="connection">
                What made you want to start a chapter?{" "}
                <span className="chapter-optional">Optional</span>
              </label>
              <textarea
                id="connection"
                rows={3}
                value={form.connection}
                onChange={update("connection")}
                placeholder="Your connection to autoimmune disease, what you're hoping to change locally, anything we should know."
              />
            </div>

            <div className="chapter-field-row">
              <div className="chapter-field">
                <label htmlFor="interestedCount">
                  People you'd bring with you{" "}
                  <span className="chapter-optional">Optional</span>
                </label>
                <input
                  id="interestedCount"
                  type="text"
                  inputMode="numeric"
                  value={form.interestedCount}
                  onChange={update("interestedCount")}
                  placeholder="Rough guess is fine"
                />
              </div>
              <div className="chapter-field">
                <label htmlFor="social">Instagram or contact handle</label>
                <input
                  id="social"
                  type="text"
                  value={form.social}
                  onChange={update("social")}
                  onBlur={blur("social")}
                  placeholder="@handle"
                />
                {touched.social && errors.social && (
                  <span className="chapter-error">{errors.social}</span>
                )}
              </div>
            </div>

            {status === "error" && (
              <p className="chapter-error chapter-error--submit">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="chapter-submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Registering…" : "Register as an advocate"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
