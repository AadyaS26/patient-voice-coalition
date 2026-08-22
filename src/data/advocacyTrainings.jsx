// src/data/advocacyTrainings.jsx
//
// Single source of truth for the Advocacy Training catalog and each
// training's own detail page. Add a new training by adding an entry here.
//
// `minutes` is an honest read-time estimate (roughly word count / 200 wpm),
// not a padded course-length number.
//
// `takeaways` are 2-3 short bullets shown in a highlighted box at the top
// of the detail page, so someone can get the gist before reading the whole
// thing.

import React from "react";

export const TRAININGS = [
  {
    id: "advocacy-basics",
    index: "I",
    level: "Beginner",
    minutes: 4,
    title: "Advocacy Basics",
    excerpt: "The four building blocks behind almost every form of advocacy: the ask, the story, the connection, and the thank you.",
    takeaways: [
      "Every message needs one specific ask, not a general appeal.",
      "You're usually writing to a staffer, not the legislator. Treat it the same either way.",
      "One bill, one story, one ask beats a long list every time.",
    ],
    videoUrl: "https://www.youtube.com/embed/W27H8rG7oHc",
    learnBullets: [
      "What advocacy actually means in a policy context",
      "The four building blocks of any advocacy message",
      "Who actually reads your message (hint: usually not the legislator)",
      "The most common mistake first-time advocates make",
    ],
    quiz: {
      question: "What's missing from this ask: \"Please care about autoimmune disease\"?",
      options: [
        { id: "a", text: "A specific, actionable request" },
        { id: "b", text: "A personal story" },
        { id: "c", text: "A thank you" },
        { id: "d", text: "A signature" },
      ],
      correctId: "a",
      explanation: "It's a feeling, not an action. A useful ask names exactly what you want the person to do, like \"vote yes on HB 1234.\"",
    },
content: (
      <>
        <p>
          Advocacy sounds bigger than it is. At its core, it's one thing: telling someone with
          power over a decision what you want them to do, and why. Testimony, public comment,
          meetings, letters — all of it is just a format for doing that one thing.
        </p>

        <h4>The four building blocks</h4>
        <div className="av-steps-grid">
          <div className="av-step-card">
            <span className="av-step-num">1</span>
            <h5>The ask</h5>
            <p>
              Specific and concrete: "vote yes on HB 1234," "support this amendment." A vague ask
              like "please care about autoimmune disease" gives someone nothing to act on. Finish
              this sentence before you write anything: "I am asking you to ______."
            </p>
          </div>
          <div className="av-step-card">
            <span className="av-step-num">2</span>
            <h5>The story</h5>
            <p>
              Legislators hear from lobbyists all day. What they don't hear enough is a real person
              explaining how a policy touches their actual life. Your diagnosis, your insurance
              denial, your years without an answer. It doesn't need to be dramatic. It needs to be
              true.
            </p>
          </div>
          <div className="av-step-card">
            <span className="av-step-num">3</span>
            <h5>The connection</h5>
            <p>
              One sentence linking your story to your ask. "Because I waited three years for a
              diagnosis, I'm asking you to support funding for earlier screening." That bridge is
              what turns a sad story into an argument.
            </p>
          </div>
          <div className="av-step-card">
            <span className="av-step-num">4</span>
            <h5>The thank you</h5>
            <p>
              Close by thanking them for their time, even without knowing how they'll vote. It
              costs nothing and keeps the door open for next time.
            </p>
          </div>
        </div>

        <h4>Who you're actually talking to</h4>
        <p>
          Most of the time you won't reach the legislator directly. You'll reach a legislative aide
          or staffer. That's not a lesser audience. Staffers read constituent mail, compile it into
          briefings, and often draft the talking points the legislator uses. Treat every staffer
          interaction like it's going straight to the top, because in practice, it is.
        </p>

        <h4>The single biggest mistake beginners make</h4>
        <p>
          Trying to cover everything. A message listing five different problems gets skimmed and
          forgotten. A message about one bill, with one ask and one story, gets read and
          remembered. Depth beats breadth every time.
        </p>
      </>
    ),
  },
  {
    id: "finding-legislation",
    index: "II",
    level: "Beginner",
    minutes: 5,
    title: "Finding Legislation",
    excerpt: "Where to search, how to set up alerts, and how to read a bill without a law degree.",
    takeaways: [
      "Set up keyword alerts on your state legislature's site. Bills should come to you.",
      "You only need three things from a bill: summary, status, and sponsor.",
      "Advocacy has the most power while a bill is still in committee.",
    ],
    videoUrl: "https://www.youtube.com/embed/B45S0K_tQKA",
    learnBullets: [
      "Where to actually search for bills that affect you",
      "How to set up alerts so bills come to you",
      "The three things worth knowing about any bill",
      "Why timing changes how much your advocacy matters",
    ],
    quiz: {
      question: "Which piece of information tells you how much time you have left to act on a bill?",
      options: [
        { id: "a", text: "The bill's summary" },
        { id: "b", text: "The bill's status" },
        { id: "c", text: "The bill's sponsor" },
        { id: "d", text: "The bill's number" },
      ],
      correctId: "b",
      explanation: "Status (introduced, in committee, passed one chamber) tells you where a bill is in the process, and how much runway you have to act.",
    },
content: (
      <>
        <p>
          The hardest part of legislative advocacy usually isn't writing the message. It's finding
          out a relevant bill exists before the vote already happened. Here's how to actually find
          bills early enough to matter.
        </p>

        <h4>Start with what you already have</h4>
        <p>
          Check the <a href="/legislation" style={{ color: "#A87C2A" }}>Legislation page</a> on this
          site first. Bills are already organized by condition and jurisdiction, with plain-language
          summaries so you don't have to parse legal text yourself.
        </p>

        <h4>Search your state legislature's website directly</h4>
        <p>
          Every U.S. state legislature has a public bill-tracking site, usually named something like
          "[state]leg.gov" or "legis.[state].gov." Search by keyword: try your condition name,
          "chronic illness," "insurance coverage," "prior authorization," or "disability
          accommodations." Most sites let you set up email alerts for new bills matching a keyword.
          This is the highest-leverage five minutes you can spend, because it means bills come to
          you instead of you having to remember to check.
        </p>

        <h4>Use LegiScan for a wider net</h4>
        <p>
          LegiScan.com aggregates bill data from all 50 states and Congress in one place, with free
          keyword-alert subscriptions. It updates a bit slower than a state's own site sometimes,
          but it's the easiest way to watch multiple states at once if your chapter's advocates are
          spread across state lines.
        </p>

        <h4>Reading a bill without a law degree</h4>
        <p>
          You don't need to read the full bill text to advocate on it. Look for three things:
        </p>
        <div className="av-steps-grid av-steps-grid-3">
          <div className="av-step-card">
            <h5>Summary</h5>
            <p>Usually a short paragraph at the top explaining what the bill does.</p>
          </div>
          <div className="av-step-card">
            <h5>Status</h5>
            <p>Introduced, in committee, passed one chamber. This tells you how much time you have.</p>
          </div>
          <div className="av-step-card">
            <h5>Sponsor</h5>
            <p>The legislator who introduced it. Often your best first contact, since they already agree with its goal.</p>
          </div>
        </div>

        <h4>Timing matters more than anything else here</h4>
        <p>
          A bill in committee, before any vote, is when advocacy has the most power. Committee
          members are still forming their position, and testimony or public comment can genuinely
          shift the language. Once a bill passes committee and heads to a floor vote, individual
          advocacy matters less; the coalition-building has usually already happened. Find bills
          early, not after they're already trending toward a vote.
        </p>
      </>
    ),
  },
  {
    id: "contacting-representatives",
    index: "III",
    level: "Beginner",
    minutes: 4,
    title: "Contacting Representatives",
    excerpt: "Matching the right legislator to a bill, choosing a format, and writing something a staffer will actually read.",
    takeaways: [
      "State bills need state legislators. Federal bills need your U.S. Representative or Senators.",
      "Email is the highest volume-to-effort ratio if you can only do one thing.",
      "Put your ask in the first sentence. Five or six sentences total is plenty.",
    ],
        videoUrl: null,
    learnBullets: [
      "How to match the right legislator to a given bill",
      "Email vs. phone vs. mail, and when each one matters",
      "A message structure that actually gets read",
      "What to do if you don't hear back",
    ],
    quiz: {
      question: "If you can only choose one way to contact a legislator, which is generally the highest volume-to-effort option?",
      options: [
        { id: "a", text: "A phone call" },
        { id: "b", text: "Physical mail" },
        { id: "c", text: "Email" },
        { id: "d", text: "An in-person visit" },
      ],
      correctId: "c",
      explanation: "Email is the fastest to send and the easiest for an office to log and count, which is why it's the default recommendation.",
    },
content: (
      <>
        <p>
          "Contact your representative" sounds simple until you realize you have several: a state
          representative, a state senator, a U.S. Representative, and two U.S. Senators. The right
          one depends entirely on which bill you're contacting them about.
        </p>

        <h4>Match the legislator to the bill's level</h4>
        <p>
          State bills need state legislators. Federal bills need your U.S. Representative or
          Senators. This sounds obvious, but it's the most common mistake: someone emails their U.S.
          Senator about a state bill the Senator has zero authority over. Our{" "}
          <a href="/legislation" style={{ color: "#A87C2A" }}>Legislation page</a> letter tool
          automatically matches you to the right legislator based on your address and the bill
          you're viewing, so this part is handled for you if you use it.
        </p>

        <h4>Email vs. phone vs. mail</h4>
        <p>
          Email is the easiest to send and the easiest for an office to log and count. Many offices
          tally constituent contacts by position (support or oppose) and report those numbers
          internally. Phone calls get logged too, and some staffers say a live call carries a bit
          more weight since it takes more effort, but only if you can actually get through. Physical
          mail is slowest but hardest to ignore; a handwritten letter is rare enough now that it
          stands out. If you can only do one, do email. It's the highest volume-to-effort ratio.
        </p>

        <h4>What actually gets read</h4>
        <p>
          Short. A staffer reading fifty constituent emails a day will read the first two sentences
          closely and skim the rest. Put your ask in the first sentence, not the last. Five or six
          sentences total is plenty: one line of story, one line connecting it to the bill, one
          clear ask, one thank you.
        </p>

        <h4>A structure that works every time</h4>
        <p style={{ background: "#F7F3EA", padding: "16px 18px", borderRadius: 6, borderLeft: "3px solid #A87C2A" }}>
          "My name is [name], I live in [city/district]. [One sentence: your condition or connection
          to this issue.] I'm writing to ask you to [specific ask] on [bill number/name]. [One
          sentence: why this matters to you specifically.] Thank you for your time and
          consideration."
        </p>

        <h4>Following up</h4>
        <p>
          If you don't hear back in two to three weeks, a polite follow-up is normal and expected.
          Offices are busy, and a second message doesn't come across as pushy if it's brief and
          references the first one.
        </p>
      </>
    ),
  },
  {
    id: "sharing-your-story",
    index: "IV",
    level: "Beginner",
    minutes: 4,
    title: "Sharing Your Patient Story",
    excerpt: "What separates a story that's true from a story that's actually useful for policy.",
    takeaways: [
      "Specificity moves people. Name the exact barrier, not just how hard it was.",
      "Four parts: where you started, what went wrong, what it cost you, what you want to change.",
      "You never have to share more than you're comfortable with. Anonymous is always an option.",
    ],
        videoUrl: null,
    learnBullets: [
      "What separates a policy-useful story from a personal one",
      "The four-part shape that works almost every time",
      "How much detail is actually enough",
      "Why you're always in control of what you share",
    ],
    quiz: {
      question: "Which of these is the most policy-useful detail?",
      options: [
        { id: "a", text: "\"It was really hard.\"" },
        { id: "b", text: "\"I waited 11 months for a referral because there are only two specialists in my county.\"" },
        { id: "c", text: "\"I've always struggled with this.\"" },
        { id: "d", text: "\"Things got complicated.\"" },
      ],
      correctId: "b",
      explanation: "It names a specific, fixable barrier (a wait time tied to a specialist shortage) instead of a general feeling, which gives policymakers something concrete to act on.",
    },
content: (
      <>
        <p>
          Your story is the one thing in advocacy nobody else can provide. But a story that's true
          isn't automatically a story that's useful for policy. There's a difference between telling
          your story to a friend and telling it to someone deciding whether to fund a program.
        </p>

        <h4>What makes a story policy-useful</h4>
        <p>
          Specificity. "It was really hard" doesn't move anyone. "I waited 11 months for a
          rheumatology referral because there are only two rheumatologists in my county" does,
          because it points at a fixable problem. Before you write, ask yourself what specific,
          nameable barrier you ran into. A wait time, a cost, a lack of specialists, an insurance
          denial, a diagnostic delay. Name it directly.
        </p>

        <h4>The shape that works</h4>
        <div className="av-steps-grid">
          <div className="av-step-card">
            <span className="av-step-num">1</span>
            <h5>Where you started</h5>
            <p>A sentence on your diagnosis or condition, briefly.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-num">2</span>
            <h5>What went wrong</h5>
            <p>The specific barrier. This is the part that should be concrete, since it's what maps to a policy fix.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-num">3</span>
            <h5>What it cost you</h5>
            <p>Not just emotionally. Time, money, missed work, missed school. Policymakers respond to costs they can picture.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-num">4</span>
            <h5>What you want to change</h5>
            <p>Connect your experience directly to the ask. This line turns a personal story into testimony.</p>
          </div>
        </div>

        <h4>How much detail is too much</h4>
        <p>
          For most advocacy contexts (a letter, a public comment, a 2-3 minute testimony slot),
          three to five sentences is the right length. Save the fuller version of your story for our
          Patient Stories page or a meeting where you have more time. Most policy formats reward a
          tight, specific story over a comprehensive one.
        </p>

        <h4>You control what you share</h4>
        <p>
          You never have to share more than you're comfortable with, and you can share anonymously
          in most formats, including this site's Patient Stories page. A shorter story you're fully
          comfortable sharing beats a longer one you regret sharing.
        </p>
      </>
    ),
  },
  {
    id: "public-comment",
    index: "V",
    level: "Intermediate",
    minutes: 4,
    title: "Public Comment",
    excerpt: "The lowest-barrier way to get an official record of your position on a bill or rule.",
    takeaways: [
      "It's usually just a written form online. No scheduling, no public speaking.",
      "Legislative comment is tied to a bill. Regulatory comment is tied to an agency rule.",
      "Under 200 words. State your position in sentence one, give one reason, stop.",
    ],
    videoUrl: "https://www.youtube.com/embed/pVC2RdYE-Q4",
    learnBullets: [
      "The difference between legislative and regulatory comment",
      "What to actually write, and how short is short enough",
      "A template you can adapt in minutes",
      "Where to find comment periods that are currently open",
    ],
    quiz: {
      question: "A comment submitted to a legislative committee about a specific bill is an example of which kind of public comment?",
      options: [
        { id: "a", text: "Regulatory comment" },
        { id: "b", text: "Legislative comment" },
        { id: "c", text: "Neither" },
        { id: "d", text: "Both equally" },
      ],
      correctId: "b",
      explanation: "Legislative comment is tied to a specific bill in a legislature. Regulatory comment is tied to an agency's proposed rule instead.",
    },
content: (
      <>
        <p>
          Public comment is one of the most underused tools in advocacy because people assume it's
          harder than it is. In most cases, it's a written statement you submit online. No
          scheduling, no public speaking, no travel.
        </p>

        <h4>Two kinds of public comment</h4>
        <div className="av-steps-grid av-steps-grid-2">
          <div className="av-step-card">
            <h5>Legislative</h5>
            <p>
              Submitted to a specific committee ahead of (or instead of) a hearing, often through a
              state legislature's website or a "position letter" system. Tied to a specific bill.
            </p>
          </div>
          <div className="av-step-card">
            <h5>Regulatory</h5>
            <p>
              Submitted on a proposed rule from a government agency, not a bill in the legislature.
              Often through a state agency's site, or federally through regulations.gov. Usually has
              a fixed comment period with a hard deadline.
            </p>
          </div>
        </div>

        <h4>What to actually write</h4>
        <p>
          Keep it under 150-200 words unless the form asks for more. State your position clearly in
          the first sentence ("I support/oppose [bill/rule]"), give one specific reason grounded in
          your experience, and stop. Long comments don't carry more weight than short, clear ones.
          Committees are often reading dozens or hundreds of these, and clarity wins over length.
        </p>

        <h4>A template to start from</h4>
        <p style={{ background: "#F7F3EA", padding: "16px 18px", borderRadius: 6, borderLeft: "3px solid #A87C2A" }}>
          "My name is [name] from [city, state]. I live with [condition]. [1-2 sentences: how this
          bill or rule specifically affects you.] I urge the committee to [support/oppose/amend]
          [bill number or rule name]. Thank you for considering my comment."
        </p>

        <h4>Save your proof</h4>
        <p>
          Screenshot the confirmation page after you submit. Many portals don't send a confirmation
          email, and your own dated proof of submission matters if you ever need to verify your
          advocacy history.
        </p>

        <h4>Where to find open comment periods</h4>
        <p>
          Check our <a href="/events" style={{ color: "#A87C2A" }}>Events page</a>. We post public
          hearings and open comment periods there as we find them, with direct links to submit.
        </p>
      </>
    ),
  },
  {
    id: "testimony",
    index: "VI",
    level: "Intermediate",
    minutes: 5,
    title: "Testimony",
    excerpt: "Speaking or writing formally on the official record before a committee.",
    takeaways: [
      "Written testimony counts even if you never show up or speak.",
      "2 minutes is about 250-300 words. Practice out loud with a timer at least once.",
      "First-time nerves are normal. Committees see them constantly.",
    ],
        videoUrl: null,
    learnBullets: [
      "The difference between written and oral testimony",
      "How to actually register to testify",
      "How to structure a 2-3 minute statement",
      "What really happens once you're in the room",
    ],
    quiz: {
      question: "Roughly how many words is a typical 2-minute spoken statement?",
      options: [
        { id: "a", text: "50-75 words" },
        { id: "b", text: "250-300 words" },
        { id: "c", text: "600-700 words" },
        { id: "d", text: "1,000+ words" },
      ],
      correctId: "b",
      explanation: "At a normal speaking pace, 2 minutes is about 250-300 words, which is shorter than most first-time testifiers expect.",
    },
content: (
      <>
        <p>
          Testimony is public comment's more formal cousin: a statement entered into the official
          record of a specific hearing, either spoken live or submitted in writing in lieu of
          speaking. It carries more weight than a regular email because it becomes part of a
          permanent, citable government record.
        </p>

        <h4>Written vs. oral testimony</h4>
        <p>
          Most committees accept written testimony even from people who don't attend or speak. This
          is the lower-barrier option and still counts as official testimony on the record. Oral
          testimony means signing up, often the same day or a few days ahead, for a 2-3 minute
          speaking slot, either in person or, increasingly, by video call.
        </p>

        <h4>How to register to testify</h4>
        <p>
          Every legislature does this a little differently, but the pattern is usually: find the
          hearing on the committee's calendar, look for a "sign up to testify" or "witness
          registration" link (often open the morning of, or a day or two before), and submit your
          name, your position (support, oppose, or neutral), and sometimes written remarks in
          advance.
        </p>

        <h4>Writing a 2-3 minute statement</h4>
        <div className="av-steps-grid av-steps-grid-timeline">
          <div className="av-step-card">
            <span className="av-step-time">0:00</span>
            <p>Name and one line of context.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-time">0:10</span>
            <p>Your position and the bill number.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-time">0:20</span>
            <p>Your story, with one specific, concrete detail.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-time">1:50</span>
            <p>Your ask, restated clearly.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-time">2:00</span>
            <p>Thank you.</p>
          </div>
        </div>
        <p>
          Practice it out loud with a timer at least once. Reading time and speaking time are
          different, and most first-time testifiers run long.
        </p>

        <h4>What actually happens in the room (or on the call)</h4>
        <p>
          You'll usually be one of several people testifying in a row. Committee members may or may
          not ask follow-up questions. If they do, it's fine to say "I don't know, but I'm happy to
          follow up in writing" instead of guessing. Nobody expects you to have every statistic
          memorized. Your lived experience is the testimony, not a policy briefing.
        </p>

        <h4>First-time nerves are normal</h4>
        <p>
          Nearly everyone's first testimony is nerve-wracking, and committees know that. They see
          first-time testifiers constantly and aren't judging your delivery, they're listening for
          your point. If public speaking genuinely isn't for you, written testimony carries real
          weight too and is a completely legitimate way to participate.
        </p>
      </>
    ),
  },
  {
    id: "policymaker-meetings",
    index: "VII",
    level: "Intermediate",
    minutes: 5,
    title: "Policymaker Meetings",
    excerpt: "Requesting a meeting with a legislator's office, running it well, and following up.",
    takeaways: [
      "Use the office's own meeting-request form, not a general email.",
      "Bring one page, not a packet. A one-pager actually gets read.",
      "Follow up within a day or two, restating your ask in one sentence.",
    ],
        videoUrl: null,
    learnBullets: [
      "How to actually request a meeting with an office",
      "How to structure a tight 15-minute conversation",
      "What to bring (and what not to)",
      "How to follow up in a way that keeps the door open",
    ],
    quiz: {
      question: "What should you bring to a legislative meeting instead of a multi-page packet?",
      options: [
        { id: "a", text: "A slideshow presentation" },
        { id: "b", text: "A single one-page leave-behind" },
        { id: "c", text: "A full copy of the bill text" },
        { id: "d", text: "Nothing at all" },
      ],
      correctId: "b",
      explanation: "A one-pager is far more likely to actually get read and kept. Staffers meet with dozens of groups, and a packet usually doesn't survive their desk.",
    },
content: (
      <>
        <p>
          A direct meeting, usually with a legislative aide rather than the legislator personally,
          is one of the highest-impact things an advocate can do, because it's a real conversation
          instead of one message among hundreds.
        </p>

        <h4>Requesting a meeting</h4>
        <p>
          Most legislator websites have a "contact" or "schedule a meeting" form specifically for
          constituent meeting requests. Use that rather than a general email, since it usually
          routes directly to whoever schedules the legislator's calendar. State that you're a
          constituent, name the specific bill or issue, and say you're flexible on timing. In
          person, by phone, or by video all work.
        </p>

        <h4>A simple request template</h4>
        <p style={{ background: "#F7F3EA", padding: "16px 18px", borderRadius: 6, borderLeft: "3px solid #A87C2A" }}>
          "My name is [name], and I'm a constituent in [district/city]. I'd like to request a
          15-minute meeting to discuss [bill number/issue] and how it affects [condition/community]
          patients in our area. I'm flexible on timing and happy to meet in person, by phone, or by
          video, whatever works best for your office."
        </p>

        <h4>Structuring a 15-minute meeting</h4>
        <div className="av-steps-grid av-steps-grid-timeline">
          <div className="av-step-card">
            <span className="av-step-time">0-2 min</span>
            <p>Introductions and a one-line summary of why you're there.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-time">2-8 min</span>
            <p>Your story, tied concretely to the ask. The heart of the meeting.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-time">8-12 min</span>
            <p>Your specific ask, stated clearly, with room for their questions.</p>
          </div>
          <div className="av-step-card">
            <span className="av-step-time">12-15 min</span>
            <p>Agree on a next step, and thank them.</p>
          </div>
        </div>

        <h4>Bring one page, not a packet</h4>
        <p>
          A single one-page leave-behind with your name, contact info, the bill number, and 2-3
          bullet points is far more likely to actually get read, and kept, than a multi-page packet.
          Staffers meet with dozens of groups. A one-pager survives their desk. A packet usually
          doesn't.
        </p>

        <h4>Always follow up</h4>
        <p>
          Send a short thank-you email within a day or two, restating your ask in one sentence. This
          is also your chance to answer any question they asked that you didn't have an answer to in
          the room, which gives you a legitimate reason to follow up and keeps the relationship warm
          for next time.
        </p>

        <h4>Track who you meet</h4>
        <p>
          Keep a simple record: office, date, who attended, what was discussed, any next step. This
          becomes valuable for your chapter's institutional memory, and as documentation if you ever
          need to show your advocacy history.
        </p>
      </>
    ),
  },
];

export function getTraining(id) {
  return TRAININGS.find((t) => t.id === id) || null;
}
