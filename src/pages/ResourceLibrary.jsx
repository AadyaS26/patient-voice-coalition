import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import "./ResourceLibrary.css";

const conditions = {
    lupus: { name: "Lupus (SLE)", sub: "Systemic autoimmune disease that can affect skin, joints, kidneys, and other organs.",
      overview: "Lupus happens when the immune system attacks healthy tissue instead of protecting it. It can look different from person to person — joint pain, fatigue, skin rashes, or kidney involvement — and symptoms often come in flares rather than staying constant. It's roughly nine times more common in women, and often first appears between ages 15 and 44. There's no cure, but most people manage it with medication and lifestyle adjustments.",
      symptoms: ["Joint pain and swelling", "Butterfly-shaped facial rash", "Extreme fatigue", "Sensitivity to sunlight"],
      diagnosis: ["ANA blood test, often followed by more specific antibody panels (anti-dsDNA, anti-Smith)", "Diagnosis combines symptoms, bloodwork, and sometimes a kidney or skin biopsy"],
      checklist: ["Track flares in a symptom log", "Ask about baseline kidney and bloodwork monitoring", "Get a sun-protection plan if skin is affected", "Build a flare plan before you need one"],
      questions: ["Which organs are being monitored, and how often?", "What does a flare look like for me specifically?", "What's the plan if I miss a dose?"],
      email: { to: "your rheumatologist's office", subject: "Requesting a symptom review before my next visit", body: "Hi [Doctor's name],\n\nI've been tracking some symptoms since my last appointment: [list symptoms and dates]. Could we go over these at my next visit, or should I come in sooner?\n\nThank you,\n[Your name]" },
      links: ["Lupus Foundation of America — lupus.org", "Lupus Research Alliance — lupusresearch.org"] },

    celiac: { name: "Celiac Disease", sub: "An autoimmune reaction to gluten that damages the small intestine.",
      overview: "Celiac disease means the immune system reacts to gluten by attacking the lining of the small intestine, which can affect nutrient absorption over time. The only current treatment is a strict, lifelong gluten-free diet — there's no medication that allows gluten to be eaten safely. Diagnosis usually involves bloodwork followed by an endoscopy, and it affects an estimated 1 in 100 people worldwide, many undiagnosed.",
      symptoms: ["Digestive pain, bloating, or diarrhea", "Fatigue and nutrient deficiencies", "Skin rash (dermatitis herpetiformis)", "In children, slowed growth"],
      diagnosis: ["Blood test for tTG-IgA antibodies, followed by an endoscopy with small intestine biopsy", "Should be done while still eating gluten — going gluten-free first can hide the results"],
      checklist: ["Confirm diagnosis with an endoscopy before going gluten-free, if possible", "Learn to read labels for hidden gluten and cross-contact", "Ask about a follow-up antibody panel at 6–12 months", "Tell your school or workplace cafeteria in writing"],
      questions: ["Should family members be screened too?", "What nutrient levels should I get checked?", "What's the plan if symptoms don't improve on the diet?"],
      email: { to: "your school or workplace food service", subject: "Gluten-free accommodation request", body: "Hello,\n\nI have celiac disease, an autoimmune condition requiring a strict gluten-free diet with no cross-contact. Could we set up a time to talk through what's available and what adjustments might be needed?\n\nThank you,\n[Your name]" },
      links: ["Celiac Disease Foundation — celiac.org", "Beyond Celiac — beyondceliac.org"] },

    ra: { name: "Rheumatoid Arthritis", sub: "Autoimmune joint inflammation that can cause lasting joint damage if untreated.",
      overview: "Rheumatoid arthritis happens when the immune system attacks the lining of the joints, causing swelling, stiffness, and pain — most often symmetrically in hands, wrists, and feet. Unlike osteoarthritis, it's driven by immune activity, not wear and tear, and can affect people of any age, including children. Early treatment with disease-modifying medication significantly reduces long-term joint damage.",
      symptoms: ["Symmetrical joint pain and swelling", "Morning stiffness lasting over 30 minutes", "Fatigue", "Low-grade fever during flares"],
      diagnosis: ["Blood tests for rheumatoid factor and anti-CCP antibodies", "X-rays or ultrasound to check for early joint changes"],
      checklist: ["Ask about starting a DMARD early if newly diagnosed", "Track morning stiffness duration for your doctor", "Ask about a physical or occupational therapy referral", "Set up a plan for flare days at school or work"],
      questions: ["What's my current disease activity score, and what does it mean?", "Am I a candidate for a biologic?", "What joint protection habits should I build now?"],
      email: { to: "your workplace or school", subject: "Flexibility request for a chronic joint condition", body: "Hi [Name],\n\nI have rheumatoid arthritis, which causes joint pain and stiffness that can vary day to day. I'd like to talk through some flexibility for flare days. Could we find time this week?\n\nThank you,\n[Your name]" },
      links: ["Arthritis Foundation — arthritis.org", "CreakyJoints — creakyjoints.org"] },

    t1d: { name: "Type 1 Diabetes", sub: "Autoimmune destruction of insulin-producing cells in the pancreas.",
      overview: "Type 1 diabetes means the body no longer produces insulin, so blood sugar has to be managed externally through insulin and monitoring. It's not caused by diet or lifestyle, and it's usually diagnosed in childhood or young adulthood, though it can appear at any age. With modern tools — continuous glucose monitors and insulin pumps — day-to-day management has become more precise, but it's still constant work.",
      symptoms: ["Excessive thirst and urination", "Unexplained weight loss", "Fatigue", "Blurred vision"],
      diagnosis: ["Blood glucose and A1C testing, plus autoantibody tests to distinguish from type 2", "C-peptide test to measure how much insulin the body still produces"],
      checklist: ["Set up a school or workplace diabetes plan in writing", "Know your low and high blood sugar action plans", "Ask about CGM and pump coverage under insurance", "Schedule A1C checks every 3 months"],
      questions: ["Am I a candidate for a CGM or pump if not using one yet?", "What should my target range be?", "What's the plan for sick days?"],
      email: { to: "your child's school nurse", subject: "Diabetes Medical Management Plan for [student name]", body: "Hello,\n\n[Student] has type 1 diabetes and needs a Diabetes Medical Management Plan on file. I've attached details from their endocrinologist. Could we schedule time to review it before the school year starts?\n\nThank you,\n[Your name]" },
      links: ["JDRF — jdrf.org", "American Diabetes Association — diabetes.org"] },

    ms: { name: "Multiple Sclerosis", sub: "Immune attack on the protective covering of nerve fibers in the brain and spinal cord.",
      overview: "MS occurs when the immune system damages myelin, the insulation around nerve fibers, disrupting how signals travel through the body. Symptoms vary widely — vision changes, numbness, fatigue, mobility issues — and can come as relapses or progress gradually depending on the type. It's typically diagnosed between ages 20 and 40 and is more common in women.",
      symptoms: ["Vision changes or eye pain", "Numbness or tingling", "Balance and coordination trouble", "Severe fatigue"],
      diagnosis: ["MRI of the brain and spinal cord looking for characteristic lesions", "Sometimes a spinal tap to check for specific markers in spinal fluid"],
      checklist: ["Ask which type of MS you have and what it means for treatment", "Get a baseline MRI and a plan for future scans", "Ask about disease-modifying therapy early", "Build a fatigue-management plan for work or school"],
      questions: ["What does my MRI show compared to last time?", "What disease-modifying therapies fit my situation?", "What symptoms need an urgent call?"],
      email: { to: "your neurologist's office", subject: "New symptoms since last visit", body: "Hi [Doctor's name],\n\nI've noticed some new or worsening symptoms since my last appointment: [describe]. Should I come in sooner, or discuss at my next scheduled visit?\n\nThank you,\n[Your name]" },
      links: ["National MS Society — nationalmssociety.org", "MS Association of America — mymsaa.org"] },

    crohns: { name: "Crohn's Disease", sub: "Inflammatory bowel disease that can affect any part of the digestive tract.",
      overview: "Crohn's disease causes the immune system to attack the digestive tract, most often the end of the small intestine and the start of the colon, though it can appear anywhere from mouth to anus. Inflammation can go deep into the bowel wall, which is part of why complications like strictures or fistulas can develop. It's usually managed with medication, diet adjustments, and sometimes surgery.",
      symptoms: ["Abdominal pain and cramping", "Chronic diarrhea", "Fatigue and weight loss", "Mouth sores"],
      diagnosis: ["Colonoscopy with biopsy, plus imaging (CT or MRI enterography) to see the full digestive tract", "Blood and stool tests to check inflammation markers"],
      checklist: ["Track flare symptoms and possible food triggers", "Ask about a colonoscopy and imaging schedule", "Build a bathroom-access plan for school or work in writing", "Ask about nutrient deficiencies common with Crohn's"],
      questions: ["Which part of my digestive tract is affected?", "Am I a candidate for a biologic?", "What's my plan for flare-related absences?"],
      email: { to: "your school or workplace", subject: "Accommodation request for a chronic digestive condition", body: "Hello,\n\nI have Crohn's disease, which can cause unpredictable flares. I'd like to request reliable bathroom access and some flexibility around flare days. Could we set up a time to talk?\n\nThank you,\n[Your name]" },
      links: ["Crohn's & Colitis Foundation — crohnscolitisfoundation.org"] },

    uc: { name: "Ulcerative Colitis", sub: "Inflammatory bowel disease limited to the colon and rectum.",
      overview: "Ulcerative colitis causes the immune system to attack the lining of the colon and rectum, creating ulcers and continuous inflammation, unlike the patchy pattern seen in Crohn's. Severity ranges from mild, infrequent flares to disease requiring hospitalization, and the extent of colon involved affects treatment choice. Many people reach long periods of remission with the right medication plan.",
      symptoms: ["Bloody or urgent diarrhea", "Abdominal cramping", "Rectal pain or bleeding", "Fatigue"],
      diagnosis: ["Colonoscopy with biopsy to confirm continuous colon inflammation", "Stool calprotectin test to track inflammation over time"],
      checklist: ["Track flare frequency and severity", "Ask about a colonoscopy surveillance schedule", "Discuss a bathroom-access plan for school or work", "Ask about iron levels if bleeding is frequent"],
      questions: ["How much of my colon is affected?", "What's my current remission status?", "When would surgery be considered?"],
      email: { to: "your school or workplace", subject: "Accommodation request for ulcerative colitis", body: "Hello,\n\nI have ulcerative colitis, which can cause urgent, unpredictable symptoms. I'd like to request reliable bathroom access and flexibility during flares. Could we set up a time to talk?\n\nThank you,\n[Your name]" },
      links: ["Crohn's & Colitis Foundation — crohnscolitisfoundation.org"] },

    psoriasis: { name: "Psoriasis", sub: "Immune-driven skin condition causing rapid skin cell turnover.",
      overview: "Psoriasis speeds up the skin's normal cell cycle, causing cells to build up into thick, scaly patches, most commonly on elbows, knees, and scalp. It's a systemic immune condition, not just a skin issue, and is linked to higher risk of psoriatic arthritis, cardiovascular disease, and depression. Treatment ranges from topical creams to systemic biologics depending on severity.",
      symptoms: ["Raised, scaly red patches", "Itching or burning", "Cracked, dry skin that may bleed", "Nail pitting or thickening"],
      diagnosis: ["Usually diagnosed by visual exam of the skin and nails", "A skin biopsy is sometimes used if the diagnosis is unclear"],
      checklist: ["Track which triggers worsen flares (stress, weather, skin injury)", "Ask about screening for psoriatic arthritis", "Ask about cardiovascular risk screening", "Discuss treatment escalation if topicals aren't enough"],
      questions: ["What percentage of my body is affected, and does that change treatment?", "Am I a candidate for a biologic?", "Should I be screened for joint symptoms?"],
      email: { to: "your dermatologist's office", subject: "Flare not responding to current treatment", body: "Hi [Doctor's name],\n\nMy psoriasis hasn't improved with my current treatment over the last few weeks. Could we discuss next steps, including whether a different treatment might help?\n\nThank you,\n[Your name]" },
      links: ["National Psoriasis Foundation — psoriasis.org"] },

    psa: { name: "Psoriatic Arthritis", sub: "Joint inflammation that develops in some people with psoriasis.",
      overview: "Psoriatic arthritis combines the skin symptoms of psoriasis with joint inflammation that can affect fingers, toes, spine, and entheses (where tendons attach to bone). It can develop before, after, or without visible skin psoriasis, which sometimes delays diagnosis. Left untreated, it can cause permanent joint damage, so early treatment matters.",
      symptoms: ["Swollen, sausage-like fingers or toes", "Joint pain and stiffness", "Nail changes", "Lower back pain"],
      diagnosis: ["Combination of psoriasis history, joint exam, and imaging (X-ray or MRI)", "Blood tests mainly rule out rheumatoid arthritis, since there's no single PsA test"],
      checklist: ["Ask for a referral to rheumatology if joint symptoms appear with psoriasis", "Track which joints are affected over time", "Ask about entheses (tendon attachment) pain specifically", "Discuss DMARD or biologic options early"],
      questions: ["Is my joint damage progressing on imaging?", "Should my psoriasis and joint treatment be coordinated?", "What activity modifications help protect my joints?"],
      email: { to: "your primary care provider", subject: "Requesting a rheumatology referral", body: "Hi [Doctor's name],\n\nI have psoriasis and I'm now noticing joint pain and swelling, which can be a sign of psoriatic arthritis. Could I get a referral to rheumatology?\n\nThank you,\n[Your name]" },
      links: ["National Psoriasis Foundation — psoriasis.org", "Arthritis Foundation — arthritis.org"] },

    hashimotos: { name: "Hashimoto's Thyroiditis", sub: "Autoimmune attack on the thyroid gland, usually causing underactive thyroid.",
      overview: "Hashimoto's causes the immune system to gradually attack the thyroid gland, most often leading to hypothyroidism (an underactive thyroid) as the gland's ability to produce hormone declines. It's the most common cause of hypothyroidism in the U.S. and is far more common in women. It's usually well managed with daily thyroid hormone replacement once diagnosed.",
      symptoms: ["Fatigue and weight gain", "Cold intolerance", "Dry skin and hair thinning", "Brain fog"],
      diagnosis: ["TSH and free T4 blood tests, plus thyroid antibody testing (TPO)", "Ultrasound sometimes used if a nodule or goiter is found"],
      checklist: ["Get TSH, free T4, and thyroid antibody levels checked", "Ask how often levels should be rechecked once on medication", "Take thyroid medication consistently, same time each day", "Ask about interactions with supplements or other medications"],
      questions: ["What's my target TSH range?", "How long until a dose change shows results?", "Could my symptoms be from something other than my thyroid?"],
      email: { to: "your primary care provider or endocrinologist", subject: "Ongoing symptoms despite thyroid treatment", body: "Hi [Doctor's name],\n\nI'm still experiencing [symptoms] despite being on thyroid medication. Could we recheck my levels and discuss whether a dose adjustment is needed?\n\nThank you,\n[Your name]" },
      links: ["American Thyroid Association — thyroid.org"] },

    graves: { name: "Graves' Disease", sub: "Autoimmune condition causing an overactive thyroid.",
      overview: "Graves' disease causes the immune system to produce antibodies that overstimulate the thyroid, leading to hyperthyroidism — too much thyroid hormone. It's the most common cause of hyperthyroidism and can also cause eye symptoms (Graves' ophthalmopathy) in some people. Treatment options include medication, radioactive iodine, or surgery, depending on severity and preference.",
      symptoms: ["Rapid heartbeat or palpitations", "Unexplained weight loss", "Anxiety or irritability", "Bulging eyes or eye irritation"],
      diagnosis: ["TSH, free T4, and TSI antibody blood tests", "Radioactive iodine uptake scan to confirm the cause of hyperthyroidism"],
      checklist: ["Get a full thyroid panel including antibodies", "Ask about a heart rhythm check if palpitations occur", "Ask about eye symptoms specifically — they need separate monitoring", "Discuss which treatment path (medication, iodine, surgery) fits your goals"],
      questions: ["Which treatment option is right for my situation?", "Are my eyes at risk, and do I need an eye specialist?", "How will treatment affect future pregnancy plans, if relevant?"],
      email: { to: "your endocrinologist's office", subject: "New or worsening eye symptoms", body: "Hi [Doctor's name],\n\nI've noticed new eye symptoms — [describe] — since my Graves' diagnosis. Should I be seen by an eye specialist?\n\nThank you,\n[Your name]" },
      links: ["American Thyroid Association — thyroid.org"] },

    sjogrens: { name: "Sjögren's Syndrome", sub: "Immune attack on moisture-producing glands, causing dryness.",
      overview: "Sjögren's syndrome causes the immune system to attack glands that produce tears and saliva, leading to chronic dry eyes and dry mouth, though it can also affect other organs. It can occur alone (primary) or alongside another autoimmune condition like lupus or RA (secondary). It's diagnosed through a combination of symptoms, bloodwork, and sometimes a lip biopsy.",
      symptoms: ["Persistent dry eyes and dry mouth", "Difficulty swallowing", "Joint pain", "Dental problems from reduced saliva"],
      diagnosis: ["Blood tests for SSA/SSB antibodies", "Schirmer test for tear production, and sometimes a lip biopsy"],
      checklist: ["Ask about antibody testing (SSA/SSB)", "See a dentist regularly — dry mouth increases cavity risk", "Ask about artificial tears or saliva substitutes", "Watch for new symptoms suggesting organ involvement"],
      questions: ["Is my Sjögren's primary or secondary to another condition?", "What can help with dryness day to day?", "Are any other organs at risk?"],
      email: { to: "your rheumatologist's office", subject: "Worsening dryness symptoms", body: "Hi [Doctor's name],\n\nMy dry eye and mouth symptoms have gotten worse and are affecting daily activities. Could we discuss additional treatment options?\n\nThank you,\n[Your name]" },
      links: ["Sjögren's Foundation — sjogrens.org"] },

    as: { name: "Ankylosing Spondylitis", sub: "Inflammatory arthritis primarily affecting the spine.",
      overview: "Ankylosing spondylitis causes chronic inflammation in the spine and sacroiliac joints, which over time can lead to new bone formation and fused vertebrae if untreated. It typically starts with lower back pain in the teens or twenties and is often mistaken for mechanical back pain early on, delaying diagnosis. Physical therapy and, when needed, biologic medication can significantly slow progression.",
      symptoms: ["Chronic lower back and hip pain, worse in the morning", "Pain that improves with movement, not rest", "Fatigue", "Eye inflammation (uveitis) in some cases"],
      diagnosis: ["X-ray or MRI of the sacroiliac joints and spine", "HLA-B27 blood test, though a negative result doesn't rule it out"],
      checklist: ["Ask about HLA-B27 testing and imaging (X-ray or MRI)", "Start a daily stretching or physical therapy routine", "Ask about biologic treatment if NSAIDs aren't enough", "Watch for eye redness or pain — report it promptly"],
      questions: ["Is my spine showing signs of fusion on imaging?", "Am I a candidate for a biologic?", "What exercises are safe and helpful for me?"],
      email: { to: "your rheumatologist's office", subject: "Back pain not improving with current treatment", body: "Hi [Doctor's name],\n\nMy back pain hasn't improved with my current treatment plan. Could we discuss whether additional imaging or a treatment change makes sense?\n\nThank you,\n[Your name]" },
      links: ["Spondylitis Association of America — spondylitis.org"] },

    vitiligo: { name: "Vitiligo", sub: "Autoimmune loss of skin pigment cells, causing white patches.",
      overview: "Vitiligo happens when the immune system attacks melanocytes, the cells that produce skin pigment, leaving patches of skin without color. It's not contagious or dangerous physically, but it can have a real impact on confidence and mental health, especially when patches are visible. It's often linked to other autoimmune conditions, so a broader health check is sometimes worthwhile.",
      symptoms: ["Patchy loss of skin color", "Premature graying of hair", "Loss of color inside the mouth or nose", "Patches that may spread over time"],
      diagnosis: ["Usually diagnosed by visual exam, sometimes with a Wood's lamp (UV light)", "A skin biopsy is rarely needed but can rule out other causes"],
      checklist: ["Ask about screening for related autoimmune conditions (thyroid especially)", "Discuss sun protection for depigmented skin", "Ask about treatment options if repigmentation is a goal", "Connect with others who have vitiligo if it's affecting your confidence"],
      questions: ["Should I be screened for other autoimmune conditions?", "What treatment options exist if I want repigmentation?", "How do I protect depigmented skin from sun damage?"],
      email: { to: "your dermatologist's office", subject: "New or spreading patches", body: "Hi [Doctor's name],\n\nI've noticed new or spreading patches since my last visit. Could we discuss whether treatment options make sense for me?\n\nThank you,\n[Your name]" },
      links: ["VITFriends — vitfriends.org", "Global Vitiligo Foundation — globalvitiligofoundation.org"] },

    alopecia: { name: "Alopecia Areata", sub: "Autoimmune hair loss that can affect the scalp or whole body.",
      overview: "Alopecia areata causes the immune system to attack hair follicles, leading to hair loss that can range from small round patches to complete loss of scalp or body hair. Hair can regrow and fall out again unpredictably, which makes it emotionally difficult even though it's not physically dangerous. Newer treatments, including JAK inhibitors, have expanded options in recent years.",
      symptoms: ["Round, smooth patches of hair loss", "Nail pitting or ridging in some cases", "Sudden or gradual onset", "Possible eyebrow or eyelash loss"],
      diagnosis: ["Usually diagnosed by visual exam of the hair loss pattern", "A scalp biopsy can confirm the diagnosis if it's unclear"],
      checklist: ["Ask about treatment options, including newer JAK inhibitors", "Consider a wig, scarf, or no covering — whatever feels right for you", "Ask about emotional support resources — this affects confidence for many people", "Track patterns of regrowth and loss over time"],
      questions: ["What treatment options fit the extent of my hair loss?", "Are there long-term risks with newer treatments?", "Is this likely to be a one-time episode or recurring?"],
      email: { to: "your dermatologist's office", subject: "Discussing treatment options for alopecia areata", body: "Hi [Doctor's name],\n\nI'd like to talk through treatment options for my hair loss, including newer medications if I might be a candidate. Could we schedule a visit?\n\nThank you,\n[Your name]" },
      links: ["National Alopecia Areata Foundation — naaf.org"] },

    mg: { name: "Myasthenia Gravis", sub: "Autoimmune condition causing muscle weakness that worsens with activity.",
      overview: "Myasthenia gravis happens when the immune system blocks communication between nerves and muscles, causing weakness that gets worse with activity and improves with rest. It most often affects eye and eyelid muscles first, then can spread to face, throat, and limb muscles. Most people manage it well with medication, though severe flares (myasthenic crisis) can affect breathing and need emergency care.",
      symptoms: ["Drooping eyelids or double vision", "Weakness that worsens with activity", "Difficulty swallowing or slurred speech", "Shortness of breath in severe cases"],
      diagnosis: ["Blood test for acetylcholine receptor (AChR) or MuSK antibodies", "Electromyography (EMG) to test nerve-muscle communication"],
      checklist: ["Know the signs of myasthenic crisis and when to seek emergency care", "Ask about antibody testing (AChR, MuSK)", "Track which activities trigger fatigue", "Carry a card noting your diagnosis and medications for emergencies"],
      questions: ["Which antibody type do I have, and does it change treatment?", "What are my warning signs for a crisis?", "Which medications should I avoid, since some worsen MG?"],
      email: { to: "your neurologist's office", subject: "Increasing weakness or swallowing difficulty", body: "Hi [Doctor's name],\n\nI've noticed increasing weakness or difficulty swallowing since my last visit. Should I come in sooner than my next scheduled appointment?\n\nThank you,\n[Your name]" },
      links: ["Myasthenia Gravis Foundation of America — myasthenia.org"] },

    gbs: { name: "Guillain-Barré Syndrome", sub: "Rare autoimmune condition attacking peripheral nerves, often after infection.",
      overview: "Guillain-Barré syndrome happens when the immune system attacks the peripheral nervous system, usually starting days to weeks after an infection. It causes weakness that typically starts in the legs and can spread upward, sometimes rapidly enough to require hospitalization and breathing support. Most people recover, though the timeline can range from weeks to over a year.",
      symptoms: ["Weakness or tingling starting in the legs", "Difficulty walking", "Rapid heart rate or blood pressure changes", "Difficulty breathing in severe cases"],
      diagnosis: ["Diagnosis is largely clinical, based on rapid symmetric weakness after infection", "Spinal tap and nerve conduction studies support the diagnosis"],
      checklist: ["Treat any new weakness after an infection as urgent — seek care quickly", "Ask about early treatment options (IVIG or plasma exchange)", "Plan for rehabilitation support during recovery", "Track functional progress week to week during recovery"],
      questions: ["How severe is my case, and what's the expected recovery timeline?", "What rehabilitation support is available?", "What are signs recovery is stalling or worsening?"],
      email: { to: "your neurology or rehabilitation team", subject: "Update on recovery progress", body: "Hi [Doctor's name],\n\nI wanted to update you on my recovery progress since discharge: [describe]. Could we discuss whether my rehab plan needs adjusting?\n\nThank you,\n[Your name]" },
      links: ["GBS/CIDP Foundation International — gbs-cidp.org"] },

    scleroderma: { name: "Scleroderma (Systemic Sclerosis)", sub: "Autoimmune condition causing thickening and hardening of skin and, sometimes, internal organs.",
      overview: "Scleroderma causes the immune system to trigger excess collagen production, leading to hardened, thickened skin and, in systemic forms, potential involvement of the lungs, heart, kidneys, or digestive tract. It ranges from limited forms mainly affecting skin to diffuse forms with broader organ involvement. Regular organ monitoring is a key part of care even when skin symptoms feel stable.",
      symptoms: ["Skin thickening or tightening", "Raynaud's phenomenon (fingers turning white or blue in cold)", "Difficulty swallowing", "Shortness of breath"],
      diagnosis: ["Blood tests for specific antibodies (anti-Scl-70, anti-centromere)", "Skin exam plus organ testing (lung function tests, echocardiogram) to check involvement"],
      checklist: ["Ask about baseline lung function testing (PFTs)", "Ask about heart and kidney monitoring schedules", "Manage Raynaud's with warmth and, if needed, medication", "Track any new skin tightening or organ symptoms"],
      questions: ["Do I have limited or diffuse scleroderma, and what does that mean for monitoring?", "How often should my lungs and heart be checked?", "What Raynaud's management options exist?"],
      email: { to: "your rheumatologist's office", subject: "New shortness of breath or swallowing difficulty", body: "Hi [Doctor's name],\n\nI've noticed new shortness of breath or swallowing difficulty since my last visit. Should I be seen sooner or get additional testing?\n\nThank you,\n[Your name]" },
      links: ["Scleroderma Foundation — scleroderma.org"] },

    dermatomyositis: { name: "Dermatomyositis", sub: "Autoimmune condition causing muscle weakness and a distinctive skin rash.",
      overview: "Dermatomyositis causes immune-driven inflammation of the muscles and a characteristic skin rash, often on the eyelids, knuckles, and chest. It can occur at any age, including in children, and in some adult cases is associated with an increased risk of certain cancers, which is why cancer screening is often part of the initial workup. Treatment usually combines medication to control inflammation with physical therapy to maintain strength.",
      symptoms: ["Purple-red rash on eyelids or knuckles", "Progressive muscle weakness, often in hips and shoulders", "Fatigue", "Difficulty rising from a chair or climbing stairs"],
      diagnosis: ["Blood test for muscle enzymes (CK) plus specific myositis antibodies", "Skin exam, muscle MRI, or biopsy to confirm"],
      checklist: ["Ask about cancer screening appropriate for your age, if newly diagnosed as an adult", "Get baseline muscle enzyme (CK) levels", "Start physical therapy early to maintain strength", "Use sun protection — the rash can worsen with UV exposure"],
      questions: ["Was cancer screening done as part of my workup?", "What's my muscle strength trend over time?", "How can I protect my skin from flares?"],
      email: { to: "your rheumatologist's office", subject: "New or worsening muscle weakness", body: "Hi [Doctor's name],\n\nI've noticed new or worsening muscle weakness — [describe, e.g., trouble with stairs] — since my last visit. Could we discuss next steps?\n\nThank you,\n[Your name]" },
      links: ["The Myositis Association — myositis.org"] },

    polymyositis: { name: "Polymyositis", sub: "Autoimmune inflammation of the muscles, without the rash seen in dermatomyositis.",
      overview: "Polymyositis causes immune-driven inflammation of the muscles, leading to progressive weakness, most often in the hips, thighs, shoulders, and neck. Unlike dermatomyositis, it doesn't involve a skin rash, which can make diagnosis rely more heavily on muscle enzyme tests, imaging, and sometimes a muscle biopsy. It typically responds to immunosuppressive treatment, though recovery of strength can take time.",
      symptoms: ["Symmetrical muscle weakness (hips, thighs, shoulders)", "Difficulty climbing stairs or lifting arms overhead", "Fatigue", "Muscle tenderness in some cases"],
      diagnosis: ["Blood test for muscle enzymes (CK)", "EMG and sometimes a muscle biopsy, since there's no distinctive rash to go on"],
      checklist: ["Get baseline muscle enzyme (CK) levels and imaging or biopsy if needed", "Start physical therapy early to preserve function", "Track which movements have gotten harder over time", "Ask about screening for overlapping autoimmune conditions"],
      questions: ["What confirmed my diagnosis — bloodwork, imaging, or biopsy?", "How is my strength trending on treatment?", "What physical therapy plan fits my level of weakness?"],
      email: { to: "your rheumatologist's office", subject: "Muscle weakness update", body: "Hi [Doctor's name],\n\nI wanted to update you on my muscle strength since starting treatment: [describe]. Could we discuss whether my current plan is working?\n\nThank you,\n[Your name]" },
      links: ["The Myositis Association — myositis.org"] },

    addisons: { name: "Addison's Disease", sub: "Autoimmune destruction of the adrenal glands, reducing cortisol and aldosterone.",
      overview: "Addison's disease happens when the immune system damages the adrenal glands, reducing production of cortisol and aldosterone, hormones essential for stress response, blood pressure, and salt balance. Symptoms often develop slowly and can be mistaken for less serious conditions, but an untreated adrenal crisis is life-threatening. People with Addison's typically carry emergency injectable steroids and a medical alert card.",
      symptoms: ["Chronic fatigue and muscle weakness", "Unintentional weight loss", "Darkening of the skin", "Low blood pressure and salt cravings"],
      diagnosis: ["Morning cortisol and ACTH stimulation test", "Antibody testing to confirm an autoimmune cause"],
      checklist: ["Carry an emergency steroid injection kit and medical alert ID", "Know the signs of adrenal crisis and when to use emergency steroids", "Ask about a stress-dosing plan for illness, surgery, or major stress", "Get regular electrolyte and hormone level checks"],
      questions: ["What's my stress-dosing plan for illness or surgery?", "Who should know how to use my emergency injection?", "How often should my hormone levels be rechecked?"],
      email: { to: "your endocrinologist's office", subject: "Reviewing my stress-dosing and emergency plan", body: "Hi [Doctor's name],\n\nI'd like to review my stress-dosing plan and make sure my emergency kit and instructions are current. Could we go over this at my next visit?\n\nThank you,\n[Your name]" },
      links: ["National Adrenal Diseases Foundation — nadf.us"] },

    aps: { name: "Antiphospholipid Syndrome (APS)", sub: "Autoimmune clotting disorder that increases risk of blood clots and pregnancy complications.",
      overview: "Antiphospholipid syndrome causes the immune system to produce antibodies that increase the risk of dangerous blood clots in veins or arteries, as well as pregnancy complications like recurrent miscarriage. It can occur alone or alongside another autoimmune condition, often lupus. Management usually centers on blood thinners and close monitoring, especially during pregnancy or before surgery.",
      symptoms: ["Blood clots in legs or lungs", "Recurrent miscarriage", "Stroke or TIA-like symptoms in younger people", "Low platelet count"],
      diagnosis: ["Blood tests for antiphospholipid antibodies, repeated 12 weeks apart to confirm", "Diagnosis also requires a history of a clot or pregnancy complication"],
      checklist: ["Ask which antiphospholipid antibodies you tested positive for", "Discuss a clotting-risk plan before any surgery", "If pregnant or planning pregnancy, coordinate with a high-risk OB", "Know the signs of a clot that need emergency care"],
      questions: ["What's my long-term plan for blood thinners?", "How does APS affect pregnancy planning?", "What symptoms mean I should go to the ER immediately?"],
      email: { to: "your hematologist or rheumatologist", subject: "Planning ahead for an upcoming surgery", body: "Hi [Doctor's name],\n\nI have an upcoming surgery and want to make sure my blood thinner plan is coordinated beforehand. Could we discuss timing?\n\nThank you,\n[Your name]" },
      links: ["APS Foundation of America — apsfa.org"] },

    aih: { name: "Autoimmune Hepatitis", sub: "Autoimmune inflammation of the liver.",
      overview: "Autoimmune hepatitis happens when the immune system attacks liver cells, causing inflammation that can lead to scarring (cirrhosis) if untreated. It can appear suddenly with noticeable symptoms or be found incidentally through routine bloodwork showing elevated liver enzymes. Most people respond well to immunosuppressive treatment, though it's often a long-term or lifelong therapy.",
      symptoms: ["Fatigue", "Yellowing of skin or eyes (jaundice)", "Abdominal discomfort", "Joint pain"],
      diagnosis: ["Blood tests for liver enzymes and autoimmune antibodies (ANA, ASMA)", "Liver biopsy to confirm the diagnosis and assess damage"],
      checklist: ["Get regular liver enzyme and function monitoring", "Ask about a liver biopsy if diagnosis is uncertain", "Avoid alcohol and discuss all medications with your doctor", "Ask about bone density monitoring if on long-term steroids"],
      questions: ["How much liver damage is shown on my most recent tests?", "Is this likely to be lifelong treatment?", "What symptoms mean I should be seen urgently?"],
      email: { to: "your hepatologist's office", subject: "New symptoms or abnormal labs", body: "Hi [Doctor's name],\n\nI've noticed [symptoms] or received abnormal lab results since my last visit. Could we discuss whether this needs follow-up sooner?\n\nThank you,\n[Your name]" },
      links: ["American Liver Foundation — liverfoundation.org"] },

    pbc: { name: "Primary Biliary Cholangitis", sub: "Autoimmune destruction of small bile ducts in the liver.",
      overview: "Primary biliary cholangitis causes the immune system to slowly destroy the small bile ducts in the liver, leading to bile buildup that can damage liver tissue over time. It occurs overwhelmingly in women and is often first detected through routine bloodwork before symptoms appear. With early treatment, many people maintain normal liver function for years.",
      symptoms: ["Fatigue", "Itchy skin (often before other symptoms)", "Dry eyes and mouth", "Yellowing of skin or eyes in later stages"],
      diagnosis: ["Blood test for antimitochondrial antibodies (AMA), positive in most cases", "Liver function tests and sometimes imaging or biopsy"],
      checklist: ["Get liver function and antibody (AMA) testing", "Ask about treatment to slow disease progression", "Discuss options for managing itching", "Get bone density monitoring — PBC increases osteoporosis risk"],
      questions: ["How is my liver function trending on treatment?", "What can help with itching day to day?", "Should I be screened for related autoimmune conditions?"],
      email: { to: "your hepatologist's office", subject: "Itching not controlled with current approach", body: "Hi [Doctor's name],\n\nMy itching hasn't improved with the current approach. Could we discuss additional options at my next visit?\n\nThank you,\n[Your name]" },
      links: ["American Liver Foundation — liverfoundation.org"] },

    sarcoidosis: { name: "Sarcoidosis", sub: "Immune-driven inflammation that forms small clusters of cells (granulomas) in organs, often the lungs.",
      overview: "Sarcoidosis causes the immune system to form small clusters of inflammatory cells called granulomas, most often in the lungs and lymph nodes, though it can affect skin, eyes, heart, or nervous system. Many cases resolve on their own without treatment, while others need medication to prevent organ damage. Because it can mimic other conditions, diagnosis sometimes takes time and multiple tests.",
      symptoms: ["Persistent cough or shortness of breath", "Fatigue", "Skin nodules or rashes", "Swollen lymph nodes"],
      diagnosis: ["Chest X-ray or CT scan showing characteristic patterns", "Biopsy of an affected area to confirm granulomas"],
      checklist: ["Get baseline chest imaging and lung function tests", "Ask about eye and heart screening, since sarcoidosis can affect both silently", "Track whether symptoms are stable, improving, or worsening", "Ask whether treatment or watchful waiting fits your case"],
      questions: ["Which organs are affected in my case?", "Do I need treatment now, or is watchful waiting appropriate?", "How often should imaging be repeated?"],
      email: { to: "your pulmonologist's office", subject: "New or worsening breathing symptoms", body: "Hi [Doctor's name],\n\nI've noticed new or worsening shortness of breath or cough since my last visit. Should I come in sooner for evaluation?\n\nThank you,\n[Your name]" },
      links: ["Foundation for Sarcoidosis Research — stopsarcoidosis.org"] },

    vasculitis: { name: "ANCA-Associated Vasculitis", sub: "Autoimmune inflammation of small blood vessels, often affecting kidneys and lungs.",
      overview: "ANCA-associated vasculitis causes the immune system to attack small blood vessels, most seriously in the kidneys and lungs, which can lead to organ damage if not treated promptly. It includes related conditions like granulomatosis with polyangiitis and microscopic polyangiitis. Treatment usually starts with strong immunosuppression to control the acute flare, followed by lower-dose maintenance therapy.",
      symptoms: ["Fatigue and unexplained fever", "Blood in urine", "Sinus or nosebleed issues", "Shortness of breath or cough"],
      diagnosis: ["Blood test for ANCA antibodies", "Kidney or tissue biopsy to confirm vessel inflammation"],
      checklist: ["Get kidney function and urine testing regularly", "Ask about ANCA antibody subtype and what it means", "Know the signs of a flare that need urgent evaluation", "Ask about the maintenance treatment plan after the initial flare is controlled"],
      questions: ["Which organs were affected at diagnosis, and how are they now?", "What's my maintenance treatment plan?", "What symptoms mean I should be seen urgently?"],
      email: { to: "your nephrologist or rheumatologist", subject: "New symptoms since last visit", body: "Hi [Doctor's name],\n\nI've noticed [symptoms] since my last visit and wanted to check whether I should be seen sooner.\n\nThank you,\n[Your name]" },
      links: ["Vasculitis Foundation — vasculitisfoundation.org"] },

    pernicious: { name: "Pernicious Anemia", sub: "Autoimmune condition that prevents absorption of vitamin B12.",
      overview: "Pernicious anemia happens when the immune system attacks stomach cells needed to absorb vitamin B12, leading to B12 deficiency even with adequate dietary intake. Left untreated, it can cause nerve damage that may not fully reverse, which is why catching and treating it early matters. It's typically managed with B12 injections or high-dose oral supplementation for life.",
      symptoms: ["Fatigue and weakness", "Numbness or tingling in hands and feet", "Memory problems or brain fog", "Pale or yellowish skin"],
      diagnosis: ["Blood test for B12 levels and intrinsic factor antibodies", "Complete blood count often shows a specific type of anemia"],
      checklist: ["Get B12 levels and intrinsic factor antibody testing", "Ask about injection vs. high-dose oral B12 and which fits you", "Track any numbness or tingling — report new nerve symptoms promptly", "Get levels rechecked periodically once on treatment"],
      questions: ["Is injection or oral B12 more appropriate for me?", "How often should my levels be rechecked?", "Are my nerve symptoms likely to fully resolve?"],
      email: { to: "your primary care provider", subject: "B12 treatment not resolving symptoms", body: "Hi [Doctor's name],\n\nI'm still experiencing [symptoms] despite B12 treatment. Could we recheck my levels and discuss whether the approach needs adjusting?\n\nThank you,\n[Your name]" },
      links: ["Pernicious Anaemia Society — pasoc.org.uk"] },

    cidp: { name: "CIDP", sub: "Chronic inflammatory demyelinating polyneuropathy — a slower-developing cousin of Guillain-Barré syndrome.",
      overview: "CIDP causes the immune system to attack the protective covering of peripheral nerves, similar to Guillain-Barré syndrome but developing over months rather than days to weeks, and often requiring ongoing treatment rather than a single course. It causes progressive or relapsing weakness and numbness, usually starting in the legs and spreading. Treatments like IVIG, plasma exchange, or steroids can significantly improve strength and function.",
      symptoms: ["Progressive weakness in arms and legs", "Numbness or tingling", "Loss of reflexes", "Difficulty with balance or fine motor tasks"],
      diagnosis: ["Nerve conduction studies showing a pattern of demyelination", "Spinal tap showing elevated protein without high cell count"],
      checklist: ["Ask about nerve conduction studies to confirm diagnosis", "Discuss which treatment (IVIG, plasma exchange, steroids) fits your case", "Track strength and function over time with objective measures", "Set up physical or occupational therapy support"],
      questions: ["Is my CIDP relapsing or progressive, and does that change treatment?", "How will we measure whether treatment is working?", "What's the long-term outlook with treatment?"],
      email: { to: "your neurologist's office", subject: "Update on strength since starting treatment", body: "Hi [Doctor's name],\n\nI wanted to update you on my strength and symptoms since starting treatment: [describe]. Could we discuss whether adjustments are needed?\n\nThank you,\n[Your name]" },
      links: ["GBS/CIDP Foundation International — gbs-cidp.org"] },

    behcets: { name: "Behçet's Disease", sub: "Rare autoimmune condition causing inflammation of blood vessels throughout the body.",
      overview: "Behçet's disease causes immune-driven inflammation of blood vessels, leading to recurrent mouth and genital sores, eye inflammation, and sometimes involvement of the skin, joints, digestive tract, or nervous system. It's more common along the historic Silk Road region (Turkey, Middle East, East Asia) but can occur anywhere. Because symptoms are varied and can come and go, diagnosis often takes time.",
      symptoms: ["Recurrent painful mouth ulcers", "Genital sores", "Eye inflammation (uveitis)", "Skin lesions"],
      diagnosis: ["No single test — diagnosis is based on a pattern of recurring symptoms over time", "Pathergy test (skin prick reaction) can support diagnosis in some cases"],
      checklist: ["Ask about eye screening — uveitis can threaten vision if untreated", "Track which symptoms flare together to help identify patterns", "Ask about treatment options for mouth and genital sores specifically", "Discuss whether any organ involvement needs closer monitoring"],
      questions: ["Are my eyes at risk, and how often should they be checked?", "What treatment options exist for the sores specifically?", "Is any organ involvement beyond skin and mucous membranes?"],
      email: { to: "your rheumatologist's office", subject: "New eye symptoms", body: "Hi [Doctor's name],\n\nI've noticed new eye redness, pain, or vision changes. Should I be seen urgently given my Behçet's diagnosis?\n\nThank you,\n[Your name]" },
      links: ["American Behçet's Disease Association — behcets.com"] },

    jia: { name: "Juvenile Idiopathic Arthritis", sub: "The most common form of chronic arthritis in children.",
      overview: "Juvenile idiopathic arthritis is an umbrella term for autoimmune joint inflammation that begins before age 16 and lasts more than six weeks, once other causes are ruled out. It includes several subtypes affecting different numbers of joints and, in some forms, other organs like the eyes. With modern treatment, most children with JIA can stay active and avoid long-term joint damage.",
      symptoms: ["Joint swelling, pain, or stiffness, often worse in the morning", "Limping without a clear injury", "Eye inflammation (uveitis) in some subtypes", "Fatigue or reduced activity level"],
      diagnosis: ["Diagnosis of exclusion — ruling out infections, injury, and other causes of joint symptoms lasting 6+ weeks", "Blood tests and imaging support but don't single-handedly confirm JIA"],
      checklist: ["Ask which JIA subtype your child has and what it means for monitoring", "Set up routine eye exams — some subtypes carry silent uveitis risk", "Work with the school on a 504 plan or IEP if needed", "Ask about physical therapy to maintain joint mobility"],
      questions: ["Which subtype of JIA does my child have?", "How often does my child need eye screening?", "What activity level is safe and encouraged?"],
      email: { to: "your child's pediatric rheumatologist", subject: "School accommodations for JIA", body: "Hi [Doctor's name],\n\nWe're setting up school accommodations for [child's name] and would appreciate documentation of their diagnosis and any activity or attendance considerations.\n\nThank you,\n[Your name]" },
      links: ["Arthritis Foundation (Juvenile Arthritis) — arthritis.org/juvenile-arthritis"] },
  };

const CORE_LINKS = [
  { label: "School Accommodations", href: "#" },
  { label: "Advocating at Appointments", href: "#" },
  { label: "Insurance & Prior Authorization", href: "#" },
  { label: "Contacting Lawmakers", href: "#" },
];

const conditionKeys = Object.keys(conditions);

export default function ResourceLibrary() {
  const [selectedKey, setSelectedKey] = useState(conditionKeys[0]);
  const [counter, setCounter] = useState(null);

  useEffect(() => {
    fetch("/api/resource-stats", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ok && typeof data.total === "number") {
          setCounter(data.total);
        }
      })
      .catch((e) => console.error("resource-stats fetch failed", e));
  }, []);

  async function handleSelect(key) {
    setSelectedKey(key);
    setCounter((c) => (typeof c === "number" ? c + 1 : c));
    try {
      const res = await fetch("/api/track-resource-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition: key }),
      });
      const data = await res.json();
      if (data && data.ok && typeof data.total === "number") {
        setCounter(data.total);
      }
    } catch (e) {
      console.error("track-resource-view fetch failed", e);
    }
  }

  const c = conditions[selectedKey];

  return (
    <>
      <Nav />
      <div className="reslib-page">
        <div className="reslib-wrap">
          <div className="reslib-hero">
            <span className="reslib-eyebrow">Resource Library</span>
            <h1 className="reslib-hero-title">Everything you need to know, by condition.</h1>
            <p className="reslib-hero-body">
              Plain-language information built with patients, caregivers, and clinicians — symptoms,
              how it's diagnosed, checklists, sample emails, questions to bring to appointments, and
              trusted places to go next. Choose a condition below to read everything in one place.
            </p>
            <span className="reslib-count">{conditionKeys.length} conditions covered so far</span>

            <div className="reslib-big-counter">
              <div className="reslib-big-counter-num">
                {counter === null ? "—" : counter.toLocaleString()}
              </div>
              <div className="reslib-big-counter-label">resources distributed toward our 10,000 goal</div>
            </div>
          </div>

          <div className="reslib-select-row">
            <span className="reslib-select-label">Browse by condition</span>
            <select
              className="reslib-select"
              value={selectedKey}
              onChange={(e) => handleSelect(e.target.value)}
            >
              {conditionKeys.map((key) => (
                <option key={key} value={key}>
                  {conditions[key].name}
                </option>
              ))}
            </select>
          </div>

          <div className="reslib-panel">
            <div className="reslib-panel-head">
              <div>
                <h2>{c.name}</h2>
                <p className="reslib-sub">{c.sub}</p>
              </div>
            </div>

            <div className="reslib-section">
              <h3>Overview</h3>
              <p>{c.overview}</p>
            </div>

            <div className="reslib-section">
              <h3>Common symptoms</h3>
              <ul className="reslib-plain">
                {c.symptoms.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="reslib-section">
              <h3>How it's diagnosed</h3>
              <ul className="reslib-plain">
                {c.diagnosis.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="reslib-section">
              <h3>Checklist</h3>
              <ul className="reslib-checklist">
                {c.checklist.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="reslib-section">
              <h3>Questions to ask your doctor</h3>
              <ul className="reslib-qlist">
                {c.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="reslib-section">
              <h3>Sample email</h3>
              <div className="reslib-email-sample">
                <span className="reslib-field">
                  To: {c.email.to}
                  <br />
                  Subject: {c.email.subject}
                </span>
                {"\n\n"}
                {c.email.body}
              </div>
            </div>

            <div className="reslib-section">
              <h3>Trusted resources</h3>
              <div className="reslib-link-row">
                {c.links.map((l, i) => (
                  <a key={i} href="#">{l}</a>
                ))}
              </div>
            </div>

            <div className="reslib-section">
              <h3>Related core guides</h3>
              <div className="reslib-core-links">
                {CORE_LINKS.map((l) => (
                  <a key={l.label} href={l.href}>{l.label}</a>
                ))}
              </div>
            </div>

            <div className="reslib-disclaimer">
              This page provides general information and is not a substitute for advice from a
              qualified healthcare provider. Always consult your care team about your specific situation.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
