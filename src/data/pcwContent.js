// Content for Patients Can't Wait: the two question sets, the three stories,
// and the care packages. Keep everything factual and sourced. If you change a
// question, change its matching question in the other set too.

// ---------- The two matching question sets ----------
// Each question in set B tests the SAME idea as the question in set A at the same
// position, with different wording, so the after-score can't go up just from
// remembering answers. Half of visitors get A first, half get B first.
export const QUESTION_SETS = {
  A: [
    {
      q: "About how many Americans live with an autoimmune disease?",
      options: ["About 1 million", "About 5 million", "About 24 million", "About 100 million"],
      answer: 2,
      why: "The NIH estimates about 24 million Americans live with an autoimmune disease.",
    },
    {
      q: "Which of these is an autoimmune disease?",
      options: ["Type 2 diabetes", "Type 1 diabetes", "Strep throat", "A sprained ankle"],
      answer: 1,
      why: "In type 1 diabetes, the immune system attacks the cells that make insulin.",
    },
    {
      q: "In a large UK survey of people with autoimmune diseases, about how long did women say it took to get diagnosed?",
      options: ["A few weeks", "About 6 months", "About 4 years", "Usually at the first visit"],
      answer: 2,
      why: "Women in that survey reported waiting about 4 years; men reported a much shorter wait.",
    },
    {
      q: "True or false: if someone with an autoimmune disease looks healthy, they're probably doing fine.",
      options: ["True", "False"],
      answer: 1,
      why: "Fatigue, pain and nausea usually can't be seen. Looking fine and feeling fine are different things.",
    },
    {
      q: "Someone with Crohn's disease has felt great for months. What's most likely true?",
      options: [
        "They're cured",
        "They may be in remission, but the disease is still there",
        "They were misdiagnosed",
        "They can stop their medication",
      ],
      answer: 1,
      why: "Remission means symptoms are quiet, not that the disease is gone. Medication changes should go through a doctor.",
    },
  ],
  B: [
    {
      q: "Roughly how many different autoimmune diseases are there?",
      options: ["About 5", "About 20", "More than 80", "Over 1,000"],
      answer: 2,
      why: "The NIH counts more than 80 autoimmune diseases.",
    },
    {
      q: "Which of these is an autoimmune disease?",
      options: ["Lactose intolerance", "Lupus", "The flu", "Food poisoning"],
      answer: 1,
      why: "In lupus, the immune system attacks the body's own tissues, such as joints, skin and organs.",
    },
    {
      q: "In that same UK research, what were many women's symptoms often dismissed as before diagnosis?",
      options: ["A food allergy", "Psychological, like stress or anxiety", "A sports injury", "A cold"],
      answer: 1,
      why: "Many women said they were told their symptoms were psychological before they were diagnosed.",
    },
    {
      q: "A coworker with lupus looks completely fine but says she's exhausted. What's most likely?",
      options: [
        "She's exaggerating",
        "Fatigue is a common symptom you can't see",
        "She just needs more coffee",
        "Lupus doesn't cause tiredness",
      ],
      answer: 1,
      why: "Fatigue is one of the most common lupus symptoms, and it's invisible.",
    },
    {
      q: "A friend says their autoimmune disease is “quiet right now.” What should you understand?",
      options: [
        "It's gone for good",
        "It can flare again, so ongoing treatment still matters",
        "They were never really sick",
        "They no longer need a doctor",
      ],
      answer: 1,
      why: "Autoimmune diseases are long-term. Quiet periods (remission) can end in a flare.",
    },
  ],
};

export const QUIZ_SOURCES = [
  { label: "NIH (NIEHS): Autoimmune diseases", url: "https://www.niehs.nih.gov/health/topics/conditions/autoimmune" },
  {
    label: "NBC News on the eClinicalMedicine study of diagnosis delays",
    url: "https://www.nbcnewyork.com/news/health/women-autoimmune-diseases-often-misdiagnosed/6572585/",
  },
];

// ---------- The three stories ----------
// Excerpts from AutoimmuneVoices Collective submissions, lightly trimmed for length
// and typos. "…" marks a cut. Confirm each writer agreed to have their story shared
// online before launch.
export const STORIES = [
  {
    theme: "Being believed",
    condition: "Addison's disease",
    where: "Shared with the AutoimmuneVoices Collective",
    paragraphs: [
      "I spent four years being called a liar, yelled at for faking sick, and ignored. Over those four years, I slowly got worse and worse. I couldn't do sports anymore, and even walking up the stairs winded me. I was told I was lazy.",
      "In my freshman year of high school, I couldn't eat without throwing up. I was constantly nauseous and always tired. My dad took me to the ER. They said it was anxiety stomach aches and dehydration, like they always said. The next day I was even worse. My dad fought and pushed for them to investigate more, and I was admitted.",
      "…A week later, a young intern rushed into my room and asked a really random question: “Do you get, like, REALLY tan in the summer and it stays all year?” An hour later, they told me I had Addison's disease. A nurse gave me IV hydrocortisone, and for the first time in years I felt almost normal again. I broke down in tears. I wasn't crazy. I wasn't a liar. I was about three weeks away from organ failure.",
      "Keep fighting for yourself, and take the considerations needed for YOUR needs.",
    ],
    myth: "“It's probably just anxiety.”",
    choice: {
      prompt: "A friend keeps getting sick and says doctors told them it's stress. What would you do?",
      options: [
        {
          label: "Tell them it's probably stress and to relax",
          feedback:
            "That's what she heard for four years. Stress can make people feel sick, but repeated, worsening symptoms deserve a real look.",
        },
        {
          label: "Believe them, and encourage them to keep asking for answers",
          feedback:
            "Exactly what her dad finally did. One person who believes you can change everything.",
        },
      ],
    },
    fact: "In a large UK survey of people with autoimmune diseases, women reported waiting about 4 years for a diagnosis, and many were told their symptoms were psychological.",
    takeaway: "If someone says their symptoms are real, believe them and help them keep asking.",
  },
  {
    theme: "The invisible part",
    condition: "Lupus",
    where: "Shared with the AutoimmuneVoices Collective",
    paragraphs: [
      "I was diagnosed with lupus in 2017. Learning the name of my condition was the beginning of learning how to live with it.",
      "One thing I wish people understood about lupus is how much can happen beneath the surface. Someone can see me at work, at church, or taking care of my family and see only the part of the day I was able to show up for. They might miss the joint and body pain, the mouth sores, the nausea, or the kind of fatigue that makes ordinary tasks feel like they take everything I have.",
      "On a good day, I want to enjoy the energy I have. On a flare day, I want to be able to say I need to slow down without feeling like I have to prove how sick I am.",
      "I named my lupus walk team Flared but Favored, because those words hold two parts of my life that exist together.",
    ],
    myth: "“But you don't look sick.”",
    choice: {
      prompt: "A coworker with lupus asks to work from home during a flare. How do you respond?",
      options: [
        {
          label: "“You seemed fine yesterday, though.”",
          feedback:
            "Flares can come quickly, and the hardest symptoms are the ones nobody sees. Questions like this make people feel they have to prove they're sick.",
        },
        {
          label: "“Of course. What would help most today?”",
          feedback: "That's it. Believe them, and ask how you can help.",
        },
      ],
    },
    fact: "There are more than 80 autoimmune diseases, affecting about 24 million Americans. Fatigue and pain, two of the most common symptoms, are invisible.",
    takeaway: "Looking fine and feeling fine are different. Ask, don't assume.",
  },
  {
    theme: "Waiting for care",
    condition: "Crohn's disease",
    where: "Shared with the AutoimmuneVoices Collective · India",
    paragraphs: [
      "Before my diagnosis, I had already suffered from two perianal abscesses. They were extremely painful and traumatic. When I consulted a doctor, I was told the abscesses had happened because of poor hygiene. Hearing that was hurtful when I was already going through so much pain.",
      "I was finally diagnosed with Crohn's disease after my Class 10 board exams. After Class 12, I moved to Dhaka to pursue my dream of becoming a doctor. But during my third year, my Crohn's flared, and I needed biologic treatment and a less stressful environment. Returning home and leaving my MBBS journey behind was one of the hardest decisions of my life.",
      "If I could give one piece of advice to someone newly diagnosed: when you are in remission and start feeling normal again, don't assume the disease has disappeared. Remission does not mean you are cured. Never stop your medication just because you feel better without discussing it with your doctor.",
      "Crohn's disease has changed many things in my life, but I don't want it to take away my ambitions.",
    ],
    myth: "“You feel better now, so you must be cured.”",
    choice: {
      prompt: "A friend with Crohn's has felt great for months and wants to stop their medicine. What do you say?",
      options: [
        {
          label: "“Go for it, you're clearly better.”",
          feedback:
            "Feeling better often means the medicine is working. Stopping without a doctor can bring a flare back.",
        },
        {
          label: "“That's great! Talk to your doctor before changing anything.”",
          feedback: "Exactly the advice she wishes every newly diagnosed person heard.",
        },
      ],
    },
    fact: "Autoimmune and immune-mediated diseases like Crohn's are long-term. Remission means symptoms are quiet, not that the disease is gone.",
    takeaway: "Feeling better is worth celebrating. It isn't the same as being cured.",
  },
];

// ---------- Care packages ----------
// Trusted organizations for each condition. Only well-known national groups.
export const CONDITIONS = [
  {
    id: "celiac",
    name: "Celiac disease",
    org: { name: "Celiac Disease Foundation", url: "https://celiac.org" },
    basics: [
      "Celiac disease is an autoimmune condition where eating gluten (in wheat, barley and rye) damages the small intestine.",
      "The treatment is a strict, lifelong gluten-free diet. Even small amounts, like crumbs from a shared toaster, can cause damage.",
      "A dietitian who knows celiac disease can help you learn labels, eating out, and hidden sources of gluten.",
    ],
  },
  {
    id: "lupus",
    name: "Lupus",
    org: { name: "Lupus Foundation of America", url: "https://www.lupus.org" },
    basics: [
      "Lupus is an autoimmune disease that can affect joints, skin, kidneys and other organs.",
      "It often comes in flares (times when symptoms get worse) and quieter periods.",
      "Many people with lupus are sensitive to sunlight. Ask your doctor about sun protection and regular check-ups.",
    ],
  },
  {
    id: "ibd",
    name: "Crohn's disease or ulcerative colitis",
    org: { name: "Crohn's & Colitis Foundation", url: "https://www.crohnscolitisfoundation.org" },
    basics: [
      "Crohn's disease and ulcerative colitis are long-term, immune-mediated conditions that cause inflammation in the digestive tract.",
      "Remission means symptoms are quiet, not that the disease is gone. Talk to your doctor before changing medication.",
      "Knowing where bathrooms are, and having a plan for urgent moments, can make outings much less stressful.",
    ],
  },
  {
    id: "t1d",
    name: "Type 1 diabetes",
    org: { name: "Breakthrough T1D", url: "https://www.breakthrought1d.org" },
    basics: [
      "In type 1 diabetes, the immune system destroys the cells that make insulin, so the body needs insulin every day.",
      "Food, activity, stress, sleep and illness all affect blood sugar. Your care team will help you build a plan.",
      "Learn the signs of low blood sugar, and make sure the people around you know what to do.",
    ],
  },
  {
    id: "thyroid",
    name: "Hashimoto's or Graves' disease",
    org: { name: "American Thyroid Association", url: "https://www.thyroid.org" },
    basics: [
      "Hashimoto's and Graves' disease are autoimmune conditions of the thyroid, which controls energy and metabolism.",
      "Medication doses often need adjusting over time, so regular blood tests are normal.",
      "Keep track of how you feel (energy, mood, temperature, heart rate) to share at appointments.",
    ],
  },
  {
    id: "arthritis",
    name: "Rheumatoid or psoriatic arthritis",
    org: { name: "Arthritis Foundation", url: "https://www.arthritis.org" },
    basics: [
      "Rheumatoid and psoriatic arthritis are autoimmune conditions where the immune system attacks the joints.",
      "Finding the right medication can take time, and that's normal, even though it's frustrating.",
      "A rheumatologist is the specialist for these conditions.",
    ],
  },
  {
    id: "other",
    name: "Another autoimmune condition",
    org: { name: "Autoimmune Association", url: "https://autoimmune.org" },
    basics: [
      "There are more than 80 autoimmune diseases, and many share symptoms like fatigue, pain and flares.",
      "A specialist who knows your condition is worth seeking out, even if it takes a few tries.",
      "Patient organizations for your specific condition are often the best source of practical tips.",
    ],
  },
];

// Advice from Collective writers, in their own words.
export const ADVICE_QUOTES = [
  {
    text: "Write down your questions and bring them to your appointments. Tell someone you trust what a hard day actually feels like and give them a specific way to help.",
    who: "Lives with lupus",
  },
  {
    text: "It is okay to be scared, overwhelmed, or uncertain. A diagnosis can change some of your plans, but it does not mean you have to give up on the future you imagined for yourself.",
    who: "Lives with psoriatic arthritis",
  },
  {
    text: "A diagnosis journey is hard, but unfortunately it doesn't stop once you have a label. Stay strong and keep persisting until you find what's right and what works for you.",
    who: "Lives with psoriatic arthritis",
  },
  {
    text: "Your experience is valid and you deserve to be heard. Most importantly, remember to give yourself grace and patience.",
    who: "Shared with the Collective",
  },
  {
    text: "I'm taking it one day, one decision, and one blood sugar check at a time.",
    who: "Lives with Hashimoto's, celiac disease and type 1 diabetes",
  },
];

export const DOCTOR_QUESTIONS = [
  "What does this diagnosis mean for my daily life right now?",
  "What are the goals of my treatment, and how will we know it's working?",
  "What side effects should I watch for, and which ones mean I should call you?",
  "What does a flare look like for me, and what should I do when one starts?",
  "Are there other conditions I should be screened for?",
  "Should I see a dietitian, therapist, or any other specialist?",
  "Who do I contact with questions between appointments?",
];

export const COMMUNITIES = [
  { name: "Autoimmune Association", url: "https://autoimmune.org" },
  { name: "AutoimmuneVoices chapters near you", url: "/current-chapters" },
  { name: "AutoimmuneVoices Resource Library", url: "/resource-library" },
];
