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

    sjogrens: { name: "Sjögren's Disease", sub: "A systemic autoimmune disease, not just dry eyes and dry mouth.",
      overview: "Sjögren's disease causes the immune system to attack glands that produce tears and saliva, leading to chronic dry eyes and dry mouth — but it's a systemic disease, and complications can extend well beyond dryness to the kidneys, lungs, nervous system, and other organs. In 2023, the international Sjögren's community (patients, clinicians, and the Sjögren's Foundation) formally changed the name from 'Sjögren's syndrome' to 'Sjögren's disease' specifically to reflect this serious, systemic nature; the terms 'primary' and 'secondary' Sjögren's have also been retired in favor of describing it on its own regardless of whether another autoimmune condition is also present. It's diagnosed through a combination of symptoms, bloodwork, and sometimes a lip biopsy.",
      symptoms: ["Persistent dry eyes and dry mouth", "Difficulty swallowing", "Joint pain", "Dental problems from reduced saliva", "Possible involvement of the kidneys, lungs, or nervous system"],
      diagnosis: ["Blood tests for SSA/SSB antibodies", "Schirmer test for tear production, and sometimes a lip biopsy"],
      checklist: ["Ask about antibody testing (SSA/SSB)", "See a dentist regularly — dry mouth increases cavity risk", "Ask about artificial tears or saliva substitutes", "Watch for new symptoms suggesting organ involvement, including kidney or lung symptoms"],
      questions: ["Beyond dryness, am I being monitored for kidney, lung, or nerve involvement?", "What can help with dryness day to day?", "Are any other organs at risk?"],
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

    endometriosis: { name: "Endometriosis", sub: "A chronic condition where tissue similar to the uterine lining grows outside the uterus, causing pain and inflammation.",
      overview: "Endometriosis happens when tissue similar to the lining of the uterus grows outside it — often on the ovaries, fallopian tubes, or pelvic lining — where it still responds to the menstrual cycle by thickening and breaking down, but has nowhere to go. That triggers chronic inflammation, scar tissue, and adhesions that can bind organs together. It's not classified as an autoimmune disease, but it involves significant immune dysfunction and frequently overlaps with autoimmune and chronic pain conditions. It affects roughly 1 in 10 women and people assigned female at birth, and diagnosis is often delayed for years because pain is dismissed as \"normal\" period pain.",
      symptoms: ["Severe pelvic pain, especially during periods", "Pain during or after sex", "Heavy or irregular bleeding", "Digestive symptoms (bloating, nausea) that flare with the cycle", "Fatigue", "Difficulty getting pregnant"],
      diagnosis: ["Pelvic exam and imaging (ultrasound or MRI) can suggest endometriosis, especially for larger lesions or cysts", "Laparoscopic surgery, with biopsy of suspected lesions, is the only way to definitively confirm it — diagnosis takes an average of several years from first symptoms"],
      checklist: ["Track pain, bleeding, and other symptoms against your cycle in a log", "Ask for a referral to a gynecologist experienced in endometriosis if pain is dismissed", "Ask about imaging and whether laparoscopy is appropriate for you", "Discuss both hormonal and non-hormonal pain management options", "Ask about fertility counseling if pregnancy is a future consideration"],
      questions: ["Based on my symptoms, should we pursue imaging or a laparoscopy?", "What are my hormonal and non-hormonal treatment options?", "Could this be affecting my fertility, and should that change my treatment plan?", "What's my plan for pain that doesn't respond to current treatment?"],
      email: { to: "your gynecologist's office", subject: "Requesting evaluation for suspected endometriosis", body: "Hi [Doctor's name],\n\nI've been experiencing severe pelvic pain and other symptoms that line up with endometriosis: [describe symptoms and pattern]. Could we discuss next steps, including imaging or a referral to a specialist?\n\nThank you,\n[Your name]" },
      links: ["Endometriosis Foundation of America — endofound.org", "Endometriosis.org — endometriosis.org"] },

    fibromyalgia: { name: "Fibromyalgia", sub: "A chronic condition causing widespread pain, fatigue, and heightened sensitivity to pain throughout the body.",
      overview: "Fibromyalgia is a chronic pain condition rooted in how the nervous system processes pain signals — a state often called central sensitization, where the brain and spinal cord amplify pain and sensory input beyond what's typical. It causes widespread musculoskeletal pain, deep fatigue, sleep that doesn't feel restorative, and cognitive difficulties sometimes called \"fibro fog.\" It isn't classified as autoimmune, but it overlaps heavily with autoimmune and rheumatic conditions like lupus and rheumatoid arthritis, and many people navigate both at once. There's no single test — diagnosis relies on symptom patterns after other causes are ruled out — and management usually combines medication, movement, sleep support, and pacing strategies rather than one fix.",
      symptoms: ["Widespread pain lasting more than three months", "Fatigue that isn't relieved by rest", "Sleep that feels unrefreshing", "Cognitive difficulties (\"fibro fog\") — trouble focusing or with memory", "Heightened sensitivity to pain, touch, light, or sound", "Headaches and mood changes"],
      diagnosis: ["No blood test or imaging confirms fibromyalgia — diagnosis is based on widespread pain and symptom severity criteria (American College of Rheumatology criteria)", "Bloodwork is typically used to rule out overlapping conditions like rheumatoid arthritis, lupus, or thyroid disease"],
      checklist: ["Track pain locations, severity, and sleep quality in a log", "Ask about ruling out or screening for overlapping autoimmune or thyroid conditions", "Discuss a combination approach — medication, physical therapy, and sleep support — rather than one treatment alone", "Build a pacing strategy to manage activity without triggering flares", "Ask about a referral to rheumatology or a pain specialist if symptoms are unclear"],
      questions: ["Could my symptoms overlap with or point to another autoimmune condition?", "What combination of treatments fits my symptoms best?", "How do I manage a flare when it happens?", "What pacing or activity strategies do you recommend?"],
      email: { to: "your primary care provider or rheumatologist", subject: "Following up on fibromyalgia symptom management", body: "Hi [Doctor's name],\n\nI wanted to follow up on managing my fibromyalgia symptoms — specifically [pain, fatigue, sleep, etc.] — since my last visit. Could we discuss whether my current approach needs adjusting?\n\nThank you,\n[Your name]" },
      links: ["National Fibromyalgia Association — fmaware.org", "Fibromyalgia National Health Organization — supportfibromyalgia.org"] },

    nmosd: { name: "Neuromyelitis Optica Spectrum Disorder (NMOSD)", sub: "Rare autoimmune attack on the optic nerves and spinal cord, distinct from MS.",
      overview: "NMOSD happens when the immune system produces antibodies (most often against a protein called aquaporin-4) that attack the optic nerves and spinal cord, causing severe attacks of vision loss and weakness. It was once thought to be a type of MS, but it's now understood as a separate disease with different antibodies, different attack patterns, and different treatments — some MS medications can actually worsen NMOSD, which makes an accurate diagnosis critical. Attacks tend to be more severe than typical MS relapses, so early treatment to prevent further attacks matters a lot.",
      symptoms: ["Sudden vision loss or eye pain, sometimes in both eyes", "Weakness or paralysis in the arms or legs", "Numbness, tingling, or loss of bladder/bowel control", "Uncontrollable vomiting or hiccups (from brainstem involvement)"],
      diagnosis: ["Blood test for aquaporin-4 (AQP4) antibodies, and sometimes MOG antibodies for a related condition", "MRI of the brain, optic nerves, and spinal cord to look for characteristic lesions"],
      checklist: ["Ask specifically whether you've been tested for AQP4 and MOG antibodies", "Confirm your treatment plan is NMOSD-specific, not just borrowed from MS care", "Know the signs of an attack and have a plan to seek care immediately", "Ask about long-term antibody-suppressing treatment to prevent future attacks"],
      questions: ["Am I AQP4-positive, MOG-positive, or antibody-negative, and how does that change my treatment?", "What's my plan for recognizing and responding to a new attack quickly?", "Which treatments help prevent attacks long-term?"],
      email: { to: "your neurologist's office", subject: "New vision or weakness symptoms — possible NMOSD attack", body: "Hi [Doctor's name],\n\nI'm experiencing new vision loss / weakness / numbness [describe] and I'm concerned this could be an NMOSD attack. Should I be seen urgently?\n\nThank you,\n[Your name]" },
      links: ["Siegel Rare Neuroimmune Association — wearesrna.org"] },

    mctd: { name: "Mixed Connective Tissue Disease (MCTD)", sub: "An overlap autoimmune condition combining features of lupus, scleroderma, and myositis.",
      overview: "Mixed connective tissue disease is an overlap syndrome — it shares features with lupus, scleroderma, and polymyositis, and people with MCTD often have symptoms that look like more than one of these conditions at once. It's defined by a specific antibody (anti-U1-RNP) at high levels, which helps distinguish it from having several separate diagnoses. Because it's an overlap condition, the course varies a lot from person to person, and care often means monitoring for whichever organ systems are most affected.",
      symptoms: ["Raynaud's phenomenon (fingers turning white or blue in cold)", "Swollen, puffy fingers and joint pain", "Muscle weakness", "Skin tightening or rash"],
      diagnosis: ["Blood test for anti-U1-RNP antibodies at high titers", "Combination of clinical features from lupus, scleroderma, and myositis, plus ruling out other overlapping diagnoses"],
      checklist: ["Ask which organ systems are being monitored (lungs and heart especially, since MCTD can affect both)", "Get baseline lung function testing", "Manage Raynaud's with warmth and, if needed, medication", "Track which symptoms are most active to guide treatment focus"],
      questions: ["Which features of lupus, scleroderma, or myositis are most active in my case?", "How often should my lungs and heart be monitored?", "What symptoms mean I should be seen sooner?"],
      email: { to: "your rheumatologist's office", subject: "New or worsening symptoms since last visit", body: "Hi [Doctor's name],\n\nI've noticed new or worsening symptoms since my last appointment: [describe]. Could we discuss whether additional monitoring or treatment changes are needed?\n\nThank you,\n[Your name]" },
      links: ["Autoimmune Association — autoimmune.org"] },

    stiffperson: { name: "Stiff Person Syndrome", sub: "Rare autoimmune neurological disorder causing progressive muscle stiffness and painful spasms.",
      overview: "Stiff person syndrome is a rare autoimmune condition where the immune system interferes with the nerve signals that normally let muscles relax, causing stiffness in the trunk and limbs along with sudden, painful spasms — often triggered by noise, touch, or emotional stress. It's progressive and can significantly affect mobility and balance over time. It's frequently misdiagnosed at first, since stiffness and spasms can be mistaken for anxiety, a movement disorder, or a musculoskeletal issue, so getting to a specialist familiar with SPS matters.",
      symptoms: ["Progressive muscle stiffness, usually starting in the trunk and lower back", "Painful muscle spasms triggered by noise, touch, or stress", "Increased startle response", "Unsteady gait or falls as the disease progresses"],
      diagnosis: ["Blood test for anti-GAD65 antibodies, elevated in most cases", "Electromyography (EMG) showing continuous muscle activity even at rest"],
      checklist: ["Ask about anti-GAD65 antibody testing if stiffness or spasms are unexplained", "Track which triggers set off spasms (noise, cold, stress)", "Ask about treatment options, including IVIG, which has shown benefit in SPS", "Build a fall-prevention plan as balance is affected"],
      questions: ["Which SPS subtype do I have, and does that change treatment?", "Is IVIG or another immune-modulating treatment appropriate for me?", "What safety precautions should I take given my spasm triggers?"],
      email: { to: "your neurologist's office", subject: "Ongoing stiffness and spasms — requesting evaluation", body: "Hi [Doctor's name],\n\nI've been experiencing progressive stiffness and spasms that are affecting my daily life: [describe]. Could we discuss testing for stiff person syndrome or a referral to a specialist?\n\nThank you,\n[Your name]" },
      links: ["Stiff Person Syndrome Research Foundation — stiffperson.org"] },

    itp: { name: "Immune Thrombocytopenia (ITP)", sub: "Autoimmune destruction of blood platelets, increasing the risk of bruising and bleeding.",
      overview: "ITP happens when the immune system mistakenly attacks and destroys platelets, the blood cells responsible for clotting, leaving too few in circulation. It can appear suddenly, especially in children, often after a viral infection and resolving on its own, or become a chronic condition in adults that needs ongoing management. Severity varies widely — some people have mild bruising with normal life, while others need treatment to prevent serious bleeding.",
      symptoms: ["Easy or excessive bruising", "Small red or purple spots on the skin (petechiae)", "Bleeding gums or frequent nosebleeds", "Heavy menstrual bleeding"],
      diagnosis: ["Complete blood count showing a low platelet count", "Diagnosis of exclusion — ruling out other causes of low platelets like medications or other blood disorders"],
      checklist: ["Get a platelet count and repeat testing to track trends over time", "Ask which activities carry bleeding risk at your current platelet level", "Discuss treatment thresholds — not everyone needs treatment right away", "Know the signs of serious bleeding that need emergency care"],
      questions: ["What's my current platelet count, and what level would prompt treatment?", "Is this likely to resolve on its own or become chronic?", "What activities should I avoid or modify right now?"],
      email: { to: "your hematologist's office", subject: "Platelet count update and symptom check-in", body: "Hi [Doctor's name],\n\nI wanted to check in about my platelet count and some bruising/bleeding symptoms I've noticed: [describe]. Should we recheck levels or discuss treatment?\n\nThank you,\n[Your name]" },
      links: ["Platelet Disorder Support Association — pdsa.org"] },

    aiha: { name: "Autoimmune Hemolytic Anemia (AIHA)", sub: "Autoimmune destruction of red blood cells faster than the body can replace them.",
      overview: "Autoimmune hemolytic anemia happens when the immune system produces antibodies that mistakenly target red blood cells, breaking them down faster than the bone marrow can replace them. It can occur on its own or alongside another autoimmune condition like lupus, and severity ranges from mild and manageable to a medical emergency if red blood cell destruction is rapid. Treatment typically focuses on calming the immune response and, in some cases, addressing an underlying condition driving it.",
      symptoms: ["Fatigue and weakness", "Pale or yellowish skin (jaundice)", "Dark urine", "Shortness of breath or rapid heartbeat"],
      diagnosis: ["Complete blood count showing anemia, plus a direct antiglobulin (Coombs) test to confirm an immune cause", "Additional bloodwork to look for an underlying trigger, like lupus or a blood cancer"],
      checklist: ["Ask about a Coombs test if unexplained anemia is found", "Ask whether an underlying condition is driving the AIHA", "Track fatigue and any new jaundice or dark urine", "Discuss a plan for urgent care if hemoglobin drops rapidly"],
      questions: ["Is my AIHA primary or secondary to another condition?", "How quickly is this progressing, and what's the treatment plan?", "What symptoms mean I should seek emergency care?"],
      email: { to: "your hematologist's office", subject: "New fatigue and jaundice symptoms", body: "Hi [Doctor's name],\n\nI've been experiencing increasing fatigue and some yellowing of my skin/eyes. Could we check my blood counts and discuss whether this could be autoimmune hemolytic anemia?\n\nThank you,\n[Your name]" },
      links: ["Autoimmune Association — autoimmune.org"] },

    pemphigus: { name: "Pemphigus Vulgaris", sub: "Autoimmune blistering disease affecting the skin and mucous membranes.",
      overview: "Pemphigus vulgaris happens when the immune system attacks proteins that hold skin cells together, causing painful blisters and erosions on the skin and, often first, inside the mouth. Because blisters break easily, what's visible is frequently raw, painful sores rather than intact blisters, which can delay diagnosis. It's a serious condition that needs active treatment — untreated, widespread skin breakdown carries real risk of infection and fluid loss — but immunosuppressive treatment has made it much more manageable than it once was.",
      symptoms: ["Painful blisters or sores in the mouth, often the first sign", "Blisters on the skin that break easily into raw areas", "Sores in the throat, nose, or genital area", "Skin pain and tenderness"],
      diagnosis: ["Skin biopsy showing separation between skin cells (acantholysis)", "Blood test for desmoglein antibodies"],
      checklist: ["Ask about a skin or mouth biopsy if unexplained blistering or sores appear", "Ask about desmoglein antibody testing", "Discuss a wound-care plan for active blisters to reduce infection risk", "Track how quickly new sores appear on treatment"],
      questions: ["What treatment plan fits the extent of my blistering?", "How do we reduce infection risk while sores are healing?", "How will we know if treatment is working?"],
      email: { to: "your dermatologist's office", subject: "New or worsening blisters — requesting evaluation", body: "Hi [Doctor's name],\n\nI've developed painful blisters or sores in my mouth/on my skin that aren't healing: [describe]. Could we schedule a biopsy or evaluation?\n\nThank you,\n[Your name]" },
      links: ["International Pemphigus & Pemphigoid Foundation — pemphigus.org"] },

    bullouspemphigoid: { name: "Bullous Pemphigoid", sub: "Autoimmune blistering skin disease, most common in older adults.",
      overview: "Bullous pemphigoid happens when the immune system attacks proteins in the deeper layer of skin, causing large, tense, fluid-filled blisters that are typically less fragile than those in pemphigus vulgaris. It most often affects older adults and can start with intense itching before blisters even appear, which sometimes leads to a delayed diagnosis. It's generally treatable with topical or systemic immunosuppressive medication, and many people reach remission.",
      symptoms: ["Intense itching, sometimes before blisters appear", "Large, tense, fluid-filled blisters on the skin", "Blisters that don't break as easily as in pemphigus", "Redness or hive-like patches around blisters"],
      diagnosis: ["Skin biopsy showing separation at a deeper skin layer than pemphigus", "Blood test for BP180/BP230 antibodies"],
      checklist: ["Ask about a skin biopsy if unexplained itching or blistering develops", "Ask about BP180/BP230 antibody testing", "Discuss whether topical steroids alone are enough or systemic treatment is needed", "Track itching severity, since it often precedes new blister activity"],
      questions: ["Is topical or systemic treatment more appropriate for my case?", "How long is treatment typically needed?", "What's the likelihood of remission over time?"],
      email: { to: "your dermatologist's office", subject: "New blistering and itching — requesting evaluation", body: "Hi [Doctor's name],\n\nI've developed intense itching and blisters that are concerning me: [describe]. Could we schedule a biopsy or evaluation for bullous pemphigoid?\n\nThank you,\n[Your name]" },
      links: ["International Pemphigus & Pemphigoid Foundation — pemphigus.org"] },

    relapsingpolychondritis: { name: "Relapsing Polychondritis", sub: "Rare autoimmune condition causing recurrent inflammation of cartilage throughout the body.",
      overview: "Relapsing polychondritis causes the immune system to attack cartilage — most often in the ears, nose, and airway, but sometimes joints, eyes, or the cardiovascular system too. Recurring inflammation can eventually weaken or deform cartilage, and airway involvement is the most serious concern since it can affect breathing. Episodes come and go, which is part of why it's called \"relapsing,\" and treatment focuses on controlling inflammation to prevent lasting structural damage, especially to the airway.",
      symptoms: ["Sudden pain, redness, and swelling of the ear cartilage (sparing the earlobe)", "Nasal cartilage pain, sometimes leading to a saddle-nose deformity", "Hoarseness, cough, or difficulty breathing if the airway is involved", "Joint pain and eye inflammation"],
      diagnosis: ["Mostly a clinical diagnosis based on recurring episodes of cartilage inflammation", "Imaging (CT) of the airway to check for narrowing, and sometimes a biopsy of affected cartilage"],
      checklist: ["Ask about airway imaging if any breathing or voice changes occur — this needs prompt attention", "Track which cartilage sites flare and how often", "Ask about a pulmonology referral to monitor airway involvement", "Discuss a plan for early treatment at the first sign of a new flare"],
      questions: ["Is my airway involved, and how is it being monitored?", "What treatment plan reduces the frequency of flares?", "What symptoms mean I should seek care urgently?"],
      email: { to: "your rheumatologist's office", subject: "New ear, nose, or airway symptoms", body: "Hi [Doctor's name],\n\nI've noticed new pain or swelling in my ear/nose, or changes in my breathing/voice. Given my relapsing polychondritis, should I be seen sooner?\n\nThank you,\n[Your name]" },
      links: ["Autoimmune Association — autoimmune.org"] },

    goodpasture: { name: "Goodpasture Syndrome (Anti-GBM Disease)", sub: "Rare autoimmune condition attacking the kidneys and, often, the lungs.",
      overview: "Goodpasture syndrome, also called anti-GBM disease, happens when the immune system produces antibodies against a protein found in the tiny blood vessels of the kidneys and lungs, causing rapid kidney damage and sometimes lung bleeding. It can progress quickly — from first symptoms to significant kidney damage in days to weeks — so early recognition and treatment matter a great deal. With prompt treatment, including plasma exchange to remove the harmful antibodies, many people preserve kidney function that would otherwise be lost.",
      symptoms: ["Blood in the urine or foamy urine", "Coughing up blood", "Shortness of breath", "Fatigue, nausea, or swelling from kidney involvement"],
      diagnosis: ["Blood test for anti-GBM antibodies", "Kidney biopsy showing a characteristic pattern of antibody deposits"],
      checklist: ["Treat new blood in urine plus breathing symptoms as urgent — seek care quickly", "Ask about anti-GBM antibody testing", "Ask about plasma exchange as an early treatment option", "Get kidney function monitored closely once diagnosed"],
      questions: ["How much kidney function has been affected so far?", "Is plasma exchange appropriate for my case?", "What's my long-term kidney monitoring plan?"],
      email: { to: "your nephrologist's office", subject: "New blood in urine and breathing symptoms — urgent", body: "Hi [Doctor's name],\n\nI've noticed blood in my urine along with [breathing symptoms/coughing blood]. Given how quickly this type of condition can progress, could I be seen urgently?\n\nThank you,\n[Your name]" },
      links: ["National Kidney Foundation — kidney.org"] },

    egpa: { name: "Eosinophilic Granulomatosis with Polyangiitis (EGPA)", sub: "Rare autoimmune vasculitis often beginning with severe asthma and allergy symptoms.",
      overview: "EGPA (formerly called Churg-Strauss syndrome) is a rare form of vasculitis where the immune system causes inflammation of small blood vessels alongside a buildup of eosinophils, a type of white blood cell involved in allergic responses. It often starts with adult-onset asthma and sinus problems years before vasculitis symptoms appear, which can make the eventual diagnosis a surprise. Once vasculitis develops, it can affect nerves, skin, heart, and other organs, so treatment aims to control both the eosinophilic and vasculitic sides of the disease.",
      symptoms: ["Adult-onset or worsening asthma", "Chronic sinus congestion or nasal polyps", "Numbness or weakness from nerve involvement", "Skin rashes or nodules"],
      diagnosis: ["Blood test showing high eosinophil counts", "Biopsy of an affected tissue (skin, nerve, or lung) showing vasculitis with eosinophils, sometimes alongside ANCA antibody testing"],
      checklist: ["Ask about eosinophil counts if asthma is severe or hard to control", "Ask about nerve symptoms specifically — numbness or weakness can be an early sign of vasculitis", "Get baseline heart testing, since cardiac involvement is a key risk", "Track whether asthma and vasculitis symptoms are being treated together"],
      questions: ["Are my asthma and other symptoms connected to EGPA?", "Is my heart being monitored for involvement?", "What's the plan if new nerve symptoms appear?"],
      email: { to: "your rheumatologist or pulmonologist", subject: "Asthma with new nerve or skin symptoms", body: "Hi [Doctor's name],\n\nAlong with my asthma, I've noticed new symptoms — [numbness, rash, etc.] — that I understand can be linked to EGPA. Could we discuss further testing?\n\nThank you,\n[Your name]" },
      links: ["Vasculitis Foundation — vasculitisfoundation.org"] },

    autoimmuneencephalitis: { name: "Autoimmune Encephalitis", sub: "Immune attack on the brain that can cause rapid changes in memory, behavior, and movement.",
      overview: "Autoimmune encephalitis happens when the immune system produces antibodies that target proteins in the brain, causing inflammation that can lead to a fairly sudden shift in memory, personality, movement, or seizures. It's sometimes triggered by a tumor (paraneoplastic) or an infection, though often no clear trigger is found. Because the symptoms can look psychiatric at first — confusion, hallucinations, mood changes — it's sometimes misdiagnosed early on, but recognizing the autoimmune cause matters because immune treatment can lead to real recovery.",
      symptoms: ["Rapid changes in memory or confusion", "New psychiatric symptoms (hallucinations, severe anxiety, personality change)", "Seizures", "Abnormal movements or loss of coordination"],
      diagnosis: ["Blood and spinal fluid testing for specific autoimmune antibodies (e.g., anti-NMDA receptor)", "Brain MRI and EEG to look for inflammation or seizure activity, plus screening for an underlying tumor in some cases"],
      checklist: ["Ask about antibody testing (blood and spinal fluid) if psychiatric or neurological symptoms appear suddenly", "Ask whether tumor screening is appropriate, since some cases are paraneoplastic", "Discuss early immune treatment — earlier treatment is linked to better recovery", "Plan for rehabilitation support during recovery, since it can take time"],
      questions: ["Which antibody, if any, was identified, and does that change treatment or tumor screening?", "What does the recovery timeline typically look like?", "What rehabilitation support is available during recovery?"],
      email: { to: "your neurologist's office", subject: "Update on symptoms since starting treatment", body: "Hi [Doctor's name],\n\nI wanted to update you on changes in memory, mood, or movement since starting treatment: [describe]. Could we discuss whether adjustments are needed?\n\nThank you,\n[Your name]" },
      links: ["Autoimmune Encephalitis Alliance — aealliance.org"] },

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
