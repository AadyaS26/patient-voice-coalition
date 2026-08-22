// src/data/advocacyTrainings.jsx
//
// Single source of truth for the Advocacy Training catalog and each
// training's own detail page. Add a new training by adding an entry here —
// both /advocacy-training (the catalog grid) and /advocacy-training/:id
// (the detail page) read from this same array.

import React from "react";

export const TRAININGS = [
  {
    id: "advocacy-basics",
    index: "I",
    level: "Beginner",
    hours: "1.5 hours",
    title: "Advocacy Basics",
    excerpt:
      "What advocacy actually is, and the four building blocks that make up almost every form of it — the ask, the story, the connection, and the thank you.",
    content: (
      <>
        <p>
          Advocacy sounds bigger than it is. At its core, it's just one thing: telling someone
          with power over a decision what you want them to do, and why. Everything else —
          testimony, public comment, meetings, letters — is a format for doing that one thing.
        </p>
        <h4>The four building blocks</h4>
        <p>
          <strong>1. The ask.</strong> Every piece of advocacy needs a specific, concrete ask —
          "vote yes on HB 1234," "support this amendment," "schedule a hearing on this bill." A
          vague ask ("please care about autoimmune disease") gives the person nothing to act on.
          Before you write or say anything, finish this sentence: "I am asking you to ______."
        </p>
        <p>
          <strong>2. The story.</strong> Legislators hear from lobbyists and policy staff all day.
          What they don't hear enough of is a real person explaining how a specific policy touches
          their actual life. Your diagnosis, your insurance denial, your years without an answer —
          that's the part nobody else in the room can offer. It doesn't need to be dramatic. It
          needs to be specific and true.
        </p>
        <p>
          <strong>3. The connection.</strong> Explain, in one sentence, how your story connects to
          your ask. "Because I waited three years for a diagnosis, I'm asking you to support
          funding for earlier screening" — that bridge is what turns a sad story into an argument.
        </p>
        <p>
          <strong>4. The thank you.</strong> Always close by thanking them for their time and
          attention, even if you don't know how they'll vote. It costs nothing and it's the norm
          that keeps doors open for the next ask.
        </p>
        <h4>Who you're actually talking to</h4>
        <p>
          Most of the time, you won't reach the legislator directly — you'll reach a legislative
          aide or staffer. That's not a lesser audience. Staffers are the ones who read constituent
          mail, compile it into briefings, and often draft the talking points the legislator uses.
          Treat every staffer interaction like it's going straight to the top, because functionally,
          it is.
        </p>
        <h4>The single biggest mistake beginners make</h4>
        <p>
          Trying to cover everything. A message that lists five different problems with the
          healthcare system will get skimmed and forgotten. A message about one bill, one ask, one
          story, gets read and remembered. Depth beats breadth every time in advocacy writing.
        </p>
      </>
    ),
  },
  {
    id: "finding-legislation",
    index: "II",
    level: "Beginner",
    hours: "1.5 hours",
    title: "Finding Legislation",
    excerpt:
      "How to find bills that actually affect you before the vote already happened — where to search, how to set up alerts, and how to read a bill without a law degree.",
    content: (
      <>
        <p>
          The hardest part of legislative advocacy usually isn't writing the message — it's finding
          out a relevant bill exists before the vote already happened. Here's how to actually find
          bills early enough to matter.
        </p>
        <h4>Start with what you already have</h4>
        <p>
          Check the <a href="/legislation" style={{ color: "#A87C2A" }}>Legislation page</a> on this
          site first — bills are already organized by condition and jurisdiction, with plain-language
          summaries so you don't have to parse legal text yourself.
        </p>
        <h4>Search your state legislature's website directly</h4>
        <p>
          Every U.S. state legislature has a public bill-tracking site (usually
          "[state]leg.gov" or "legis.[state].gov"). Search by keyword — try your condition name,
          "chronic illness," "insurance coverage," "prior authorization," or "disability
          accommodations." Most sites let you set up email alerts for new bills matching a keyword —
          this is the single highest-leverage five minutes you can spend, because it means bills
          come to you instead of you having to remember to check.
        </p>
        <h4>Use LegiScan for a wider net</h4>
        <p>
          LegiScan.com aggregates bill data from all 50 states and Congress in one place, with free
          keyword-alert subscriptions. It's slower to update than a state's own site sometimes, but
          it's the easiest way to watch multiple states at once if your chapter's advocates are
          spread across state lines.
        </p>
        <h4>Reading a bill without a law degree</h4>
        <p>
          You don't need to read the full bill text to advocate on it. Look for three things: the
          <strong> bill summary</strong> (usually a paragraph at the top explaining what it does),
          the <strong>current status</strong> (introduced, in committee, passed one chamber, etc. —
          this tells you how much time you have), and the <strong>sponsor</strong> (the legislator
          who introduced it — often your best first contact, since they already agree with the
          bill's goal).
        </p>
        <h4>Timing matters more than anything else here</h4>
        <p>
          A bill in committee, before any vote, is when advocacy has the most power — committee
          members are still forming their position, and testimony/public comment can genuinely
          shift language. Once a bill passes committee and heads to a floor vote, individual
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
    hours: "1 hour",
    title: "Contacting Representatives",
    excerpt:
      "Finding the right legislator for a given bill, choosing email vs. phone vs. mail, and a message structure that actually gets read by a busy staffer.",
    content: (
      <>
        <p>
          "Contact your representative" sounds simple until you realize you have several — a state
          representative, a state senator, a U.S. Representative, and two U.S. Senators — and the
          right one depends entirely on which bill you're contacting them about.
        </p>
        <h4>Match the legislator to the bill's level</h4>
        <p>
          State bills need state legislators. Federal bills need your U.S. Representative or
          Senators. This sounds obvious, but it's the single most common mistake — someone emails
          their U.S. Senator about a state bill the Senator has zero authority over. Our
          <a href="/legislation" style={{ color: "#A87C2A" }}> Legislation page</a> letter tool
          automatically matches you to the right legislator based on your address and the bill you're
          viewing, so this is handled for you if you use it.
        </p>
        <h4>Email vs. phone vs. mail</h4>
        <p>
          Email is the easiest to send and the easiest for an office to log and count, which matters
          more than people think — many offices tally constituent contacts by position (support/
          oppose) and report those numbers internally. Phone calls are logged too, and some staffers
          say a live call carries slightly more weight since it takes more effort — but only if you
          can actually get through. Physical mail is the slowest but the hardest to ignore; a
          handwritten letter is rare enough now that it stands out. If you can only do one, do email
          — it's the highest volume-to-effort ratio.
        </p>
        <h4>What actually gets read</h4>
        <p>
          Short. A staffer reading fifty constituent emails a day will read the first two sentences
          of yours closely and skim the rest. Put your ask in the first sentence, not the last. Five
          or six sentences total is plenty — one line of story, one line connecting it to the bill,
          one clear ask, one thank you.
        </p>
        <h4>A structure that works every time</h4>
        <p>
          "My name is [name], I live in [city/district]. [One sentence: your condition or connection
          to this issue]. I'm writing to ask you to [specific ask] on [bill number/name]. [One
          sentence: why this matters to you specifically]. Thank you for your time and
          consideration."
        </p>
        <h4>Following up</h4>
        <p>
          If you don't hear back in two to three weeks, a polite follow-up is normal and expected —
          offices are busy, and a second message doesn't come across as pushy if it's brief and
          references the first one.
        </p>
      </>
    ),
  },
  {
    id: "sharing-your-story",
    index: "IV",
    level: "Beginner",
    hours: "1 hour",
    title: "Sharing Your Patient Story",
    excerpt:
      "Turning your experience into something a policymaker can actually use — what makes a story policy-useful, and how much detail is enough.",
    content: (
      <>
        <p>
          Your story is the one thing in advocacy that literally nobody else can provide. But a
          story that's true isn't automatically a story that's useful for policy — there's a
          difference between telling your story to a friend and telling it to someone deciding
          whether to fund a program.
        </p>
        <h4>What makes a story policy-useful</h4>
        <p>
          Specificity. "It was really hard" doesn't move anyone; "I waited 11 months for a
          rheumatology referral because there are only two rheumatologists in my county" does,
          because it points at a fixable problem. Before you write your story, ask: what specific,
          nameable barrier did I run into? Was it a wait time, a cost, a lack of specialists, an
          insurance denial, a diagnostic delay? Name it directly.
        </p>
        <h4>The shape that works</h4>
        <p>
          <strong>Where you started:</strong> a sentence on your diagnosis or condition, briefly.
          <br />
          <strong>What went wrong:</strong> the specific barrier — this is the part that should be
          concrete and detailed, because it's the part that maps to a policy fix.
          <br />
          <strong>What it cost you:</strong> not just emotionally — time, money, missed work,
          missed school, a delayed diagnosis. Policymakers respond to costs they can picture.
          <br />
          <strong>What you want to see change:</strong> connect your experience directly to the
          ask. "That's why I'm asking you to support [bill]" — this line is what turns a personal
          story into testimony.
        </p>
        <h4>How much detail is too much</h4>
        <p>
          For most advocacy contexts (a letter, a public comment, a 2-3 minute testimony slot),
          three to five sentences is the right length. Save the full, longer version of your story
          for our Patient Stories page or a meeting where you have more time — most policy formats
          reward a tight, specific story over a comprehensive one.
        </p>
        <h4>You control what you share</h4>
        <p>
          You never have to share more than you're comfortable with, and you can share anonymously
          in most formats, including on this site's Patient Stories page. A shorter story you're
          fully comfortable sharing is always better than a longer one you regret sharing.
        </p>
      </>
    ),
  },
  {
    id: "public-comment",
    index: "V",
    level: "Intermediate",
    hours: "1 hour",
    title: "Public Comment",
    excerpt:
      "The lowest-barrier way to get an official record of your position — legislative vs. regulatory comment, what to write, and where to find open comment periods.",
    content: (
      <>
        <p>
          Public comment is one of the most underused tools in advocacy because people assume it's
          harder than it is. In most cases, it's just a written statement you submit online — no
          scheduling, no public speaking, no travel.
        </p>
        <h4>Two kinds of public comment</h4>
        <p>
          <strong>Legislative comment:</strong> submitted to a specific committee ahead of (or
          instead of) a hearing, often through a state legislature's website or a dedicated "position
          letter" system. This is tied to a specific bill.
        </p>
        <p>
          <strong>Regulatory/agency comment:</strong> submitted on a proposed rule or regulation by
          a government agency (not a bill in the legislature) — often through a state agency's
          website, or federally through regulations.gov. These usually have a fixed comment period
          with a hard deadline listed in the rule notice.
        </p>
        <h4>What to actually write</h4>
        <p>
          Keep it under 150-200 words unless the form specifically asks for more. State your
          position clearly in the first sentence ("I support/oppose [bill/rule]"), give one specific
          reason grounded in your experience, and stop. Long comments don't carry more weight than
          short, clear ones — committees are often reading dozens or hundreds of these, and clarity
          wins over length.
        </p>
        <h4>A template to start from</h4>
        <p style={{ background: "#F7F3EA", padding: "14px 16px", borderRadius: 6, borderLeft: "3px solid #A87C2A" }}>
          "My name is [name] from [city, state]. I live with [condition]. [1-2 sentences: how this
          bill/rule specifically affects you]. I urge the committee to [support/oppose/amend] [bill
          number or rule name]. Thank you for considering my comment."
        </p>
        <h4>Save your proof</h4>
        <p>
          Screenshot the confirmation page after you submit. Many portals don't send a confirmation
          email, and having your own dated proof of submission matters if you ever need to verify
          your advocacy history.
        </p>
        <h4>Where to find open comment periods</h4>
        <p>
          Check our <a href="/events" style={{ color: "#A87C2A" }}>Events page</a> — we post public
          hearings and open comment periods there as we find them, with direct links to submit.
        </p>
      </>
    ),
  },
  {
    id: "testimony",
    index: "VI",
    level: "Intermediate",
    hours: "1.5 hours",
    title: "Testimony",
    excerpt:
      "Speaking or writing formally on the official record before a committee — written vs. oral, how to register, and how to write a 2-3 minute statement.",
    content: (
      <>
        <p>
          Testimony is public comment's more formal cousin — a statement entered into the official
          record of a specific hearing, either spoken live or submitted in writing in lieu of
          speaking. It carries more weight than a regular email because it's part of a permanent,
          citable government record.
        </p>
        <h4>Written vs. oral testimony</h4>
        <p>
          Most committees accept written testimony even from people who don't attend or speak —
          this is the lower-barrier option and still counts as official testimony on the record.
          Oral testimony means signing up (often the same day or a few days ahead) for a 2-3 minute
          speaking slot, either in person or, increasingly, by video call.
        </p>
        <h4>How to register to testify</h4>
        <p>
          Every legislature does this slightly differently, but the pattern is usually: find the
          hearing on the committee's calendar, look for a "sign up to testify" or "witness
          registration" link (often open the morning of, or a day or two before), and submit your
          name, position (support/oppose/neutral), and sometimes a written copy of your remarks in
          advance.
        </p>
        <h4>Writing a 2-3 minute statement</h4>
        <p>
          At a normal speaking pace, 2 minutes is roughly 250-300 words — shorter than most people
          expect. Structure: your name and one line of context (10 seconds), your position and the
          bill number (10 seconds), your story with one specific, concrete detail (60-90 seconds),
          your ask restated clearly (10 seconds), thank you (5 seconds). Practice it out loud with a
          timer at least once — reading time and speaking time are different, and most first-time
          testifiers run long.
        </p>
        <h4>What actually happens in the room (or on the call)</h4>
        <p>
          You'll usually be one of several people testifying in a row. Committee members may or may
          not ask follow-up questions — if they do, it's fine to say "I don't know, but I'm happy to
          follow up in writing" rather than guessing. Nobody expects you to have every statistic
          memorized; your lived experience is the testimony, not a policy briefing.
        </p>
        <h4>First-time nerves are normal</h4>
        <p>
          Nearly everyone's first testimony is nerve-wracking, and committees know that — they see
          first-time testifiers constantly and are not judging your delivery, they're listening for
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
    hours: "1.5 hours",
    title: "Policymaker Meetings",
    excerpt:
      "How to request a meeting with a legislator's office, run a tight 15-minute conversation, and follow up in a way that keeps the relationship warm.",
    content: (
      <>
        <p>
          A direct meeting — usually with a legislative aide rather than the legislator personally
          — is one of the highest-impact things an advocate can do, because it's a real
          conversation instead of one message among hundreds.
        </p>
        <h4>Requesting a meeting</h4>
        <p>
          Most legislator websites have a "contact" or "schedule a meeting" form specifically for
          constituent meeting requests — use that rather than a general email, since it usually
          routes directly to whoever schedules the legislator's calendar. State that you're a
          constituent, name the specific bill or issue, and suggest you're flexible on timing
          (in-person, phone, or video all work — don't limit yourself to one format unless you have
          to).
        </p>
        <h4>A simple request template</h4>
        <p style={{ background: "#F7F3EA", padding: "14px 16px", borderRadius: 6, borderLeft: "3px solid #A87C2A" }}>
          "My name is [name], and I'm a constituent in [district/city]. I'd like to request a
          15-minute meeting to discuss [bill number/issue] and how it affects [condition/community]
          patients in our area. I'm flexible on timing and happy to meet in person, by phone, or by
          video — whatever works best for your office."
        </p>
        <h4>Structuring a 15-minute meeting</h4>
        <p>
          <strong>0-2 min:</strong> introductions and a one-line summary of why you're there.
          <br />
          <strong>2-8 min:</strong> your story, concretely tied to the specific ask — this is the
          heart of the meeting, don't rush it, but don't ramble either.
          <br />
          <strong>8-12 min:</strong> your specific ask, stated clearly, and space for their
          questions.
          <br />
          <strong>12-15 min:</strong> agree on a next step — "will you let us know your position
          before the committee vote?" — and thank them.
        </p>
        <h4>Bring one page, not a packet</h4>
        <p>
          A single one-page leave-behind with your name, contact info, the bill number, and 2-3
          bullet points is far more likely to actually get read (and kept) than a multi-page packet.
          Staffers meet with dozens of groups; a one-pager survives their desk, a packet doesn't.
        </p>
        <h4>Always follow up</h4>
        <p>
          Send a short thank-you email within a day or two, restating your ask in one sentence. This
          is also the moment to answer any question they asked that you didn't have an answer to in
          the room — it gives you a legitimate reason to follow up and keeps the relationship warm
          for the next ask.
        </p>
        <h4>Track who you meet</h4>
        <p>
          Keep a simple record — office, date, who attended, what was discussed, any next step. This
          becomes valuable both for your own chapter's institutional memory and as documentation if
          you ever need to show your advocacy history.
        </p>
      </>
    ),
  },
];

export function getTraining(id) {
  return TRAININGS.find((t) => t.id === id) || null;
}
