/* ==================================================================
   SPARKS ACADEMY: REGISTRATION FORM CONTENT & POLICIES
   ------------------------------------------------------------------
   Edit wording here. If you change what parents agree to, also change
   POLICY_VERSION (e.g. to today's date). Every registration stores the
   version it was signed under, so you always know which wording a
   family agreed to.
   ================================================================== */

export const POLICY_VERSION = "2026-10-22";

/** Name of the host facility, shown in the Release of Liability. Fill this in. */
export const FACILITY_NAME = "";

export const formIntro = {
  eyebrow: "Sparks Academy · Registration",
  title: "We are delighted to have you join the Sparks family!",
  body: "This form takes about 10–15 minutes. Once you submit it, one of our coordinators will reach out to welcome you and answer any questions.",
  needs: ["Each child’s date of birth & grade", "Emergency contacts", "Preferred nearby hospital"],
};

export const MAX_CHILDREN = 4;
export const GRADES = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

export const photoQuestions = [
  {
    id: "photo_group",
    short: "Photos in group chats",
    question: "May we take photos and videos of your child/children and share them in our parent group chats?",
  },
  {
    id: "photo_social",
    short: "Photos on social media",
    question: "May we share photos and videos that include your child/children on social media, such as Facebook and Instagram?",
  },
] as const;

/** A policy is made of blocks: a paragraph ("p"), a bullet list ("ul"), or a small heading ("h"). */
export type PolicyBlock = { p: string } | { ul: string[] } | { h: string };

export interface Policy {
  id: string;
  title: string;
  blocks: PolicyBlock[];
  signLabel: string;
  /** Long policies scroll inside a box */
  long?: boolean;
}

const facility = FACILITY_NAME ? ` (${FACILITY_NAME})` : "";

export const policies: Policy[] = [
  {
    id: "commitments",
    title: "Parent Commitments",
    blocks: [
      {
        p: "I understand that SPARKS Academy is a collaborative, parent-led program. When parents are involved and share insights about their children’s learning and interests, the SPARKS Academy team can better customize the experience for each child.",
      },
      {
        ul: [
          "If I am present during class, I will not use my cellphone or laptop, unless the students are working independently and do not need my help (Little Sparks almost always need help with independent work). Urgent calls and messages are an exception.",
          "If I have agreed to volunteer, I commit to fulfilling my assigned duties as scheduled or arranged. I acknowledge that, for volunteering parents, participation is essential to the success and safety of the program.",
          "I understand that if an ongoing issue arises between children of different families, parents from both families will come together to guide the children in solving the problem. Our goal is to develop character and bring out the best that is already innate in every child.",
          "If my child is not potty trained, I understand that I must be present at all times.",
          "I acknowledge that this is a peanut-free program and will not pack or bring any food items containing peanuts or peanut butter.",
          "I understand that solidarity of the learning team and parents is absolutely essential at SPARKS. I am committed to the learning, character development, and joy of not only my own children but every child who attends SPARKS Academy.",
        ],
      },
    ],
    signLabel: "If you agree to the parent commitments above, type your full name as your e-signature",
  },
  {
    id: "discipline",
    title: "Discipline Policy",
    blocks: [
      { p: "Generally, difficulties with focus and disagreements will be handled through conversation and allowance of breaks." },
      {
        p: "With other behavioral challenges that disrupt the learning environment, such as light pushing, saying something intentionally hurtful, horseplay indoors, repeatedly distracting others, or refusing to participate after multiple redirections, breaks and offers to do alternative assignments, there is a three-step support process:",
      },
      {
        ul: [
          "Step One: The behavior is addressed directly, and a discussion is held with the parent to help the child and find a positive solution and develop their character (whether it means being more patient, kind, considerate, selfless, etc.).",
          "Step Two: If the behavior continues, a formal discussion is held with the parent. The child may need to temporarily sit out of activities or go home. The parent and child will make a plan of how to prevent the behavior in the future and how to develop new habits instead.",
          "Step Three: If the disruptive behavior persists despite previous opportunities to develop and strengthen their character, the student can no longer be a learner at SPARKS Academy.",
        ],
      },
      { h: "Zero-tolerance actions" },
      { p: "The following actions result in immediate dismissal from the program for the year:" },
      {
        ul: [
          "Adult or student use of drugs or alcohol during co-op hours or events, including e-cigarettes/vapes and wine. Wearing any clothing that promotes drugs, alcohol, or explicit/inappropriate content (as determined by the SPARKS Academy staff and individuals who oversee the facility).",
          "Causing or intending to cause significant physical harm to another child or adult.",
          "Intentional and significant damage to the facility or personal property.",
          "Engaging in targeted and persistent bullying.",
        ],
      },
    ],
    signLabel:
      "If you acknowledge the Discipline Policy, the three-step support process, and the zero-tolerance actions, type your full name as your e-signature",
  },
  {
    id: "sick",
    title: "Sick Policy",
    blocks: [
      {
        p: "To help maintain a safe and healthy environment for all children, families, and volunteers, we ask that you please keep your child home if they show any of the following symptoms within the last 5 days:",
      },
      {
        ul: [
          "Fever of 102°F or higher",
          "Repeated vomiting or diarrhea",
          "Shortness of breath or difficulty breathing",
          "Rash that could be contagious",
          "Significant eye redness with discharge (possible pink eye)",
          "Lethargy or extreme fatigue",
          "Positive COVID test (please notify us if your child or someone in your household tests positive for COVID-19)",
        ],
      },
      { p: "Children may return to the co-op when they have been symptom-free for at least 24 hours without the use of medication after the 5 days have passed." },
      { p: "For the common cold, please attend no less than 3 days after the start of symptoms (e.g. nasal congestion, sore throat, coughing) if the symptoms are mild or have cleared." },
      { p: "We kindly ask that all families err on the side of caution. If a child appears ill during the co-op day, they may be asked to go home." },
    ],
    signLabel: "Type your full name to e-sign in acknowledgement of the Sick Policy",
  },
  {
    id: "fees_dress",
    title: "Fee Policy & Dress Code",
    blocks: [
      { h: "Fee Policy" },
      {
        ul: [
          "Refund policy: Co-op fees are non-refundable, including in the event of illness, missed days, removal due to behavior, or withdrawal after the middle of the month.",
          "Fees are due within 5 days of invoice.",
        ],
      },
      { h: "Dress Code" },
      {
        ul: [
          "Adults and kids should not wear anything that references drugs/alcohol, contains profanity, or contains anything that could be offensive or considered explicit content.",
          "Shorts, skirts and dresses should be long enough to account for bending over and sitting.",
          "Pants are recommended (though not required) even on warm days, since the play area is blacktop and kids can sometimes fall on their knees.",
        ],
      },
    ],
    signLabel: "Type your full name to e-sign in agreement with the Fee Policy and Dress Code",
  },
  {
    id: "release",
    title: "Release of Liability, Assumption of Risk, and Emergency Medical Authorization",
    long: true,
    blocks: [
      { p: "For purposes of this document:" },
      {
        ul: [
          `“SPARKS Academy” includes its founders, coordinators, instructors, volunteers, and the owner/host of the facility where programming takes place${facility}.`,
          "“My child(ren)” means every child I enroll.",
        ],
      },
      { h: "Release of Liability and Assumption of Risk" },
      { p: "By agreeing to this release form, I acknowledge that SPARKS Academy cannot guarantee that my child(ren) or I will not become infected with COVID-19 or any other contagious illness." },
      {
        p: "I voluntarily agree to assume the risks associated with my child(ren)’s participation in SPARKS Academy activities and accept responsibility for injuries, illnesses, damages, losses, claims, liabilities, or expenses that my child(ren) or I may experience or incur in connection with participation, to the extent permitted by law.",
      },
      {
        p: "I understand that some classes and activities may include, without limitation, jumping, stretching, running, physical games and sports, using scissors and paints, handling ingredients for science experiments, cooking with open flames under supervision, using various food ingredients, and other related activities. I understand that some activities involve inherent risks, including physical strain or bodily injury.",
      },
      {
        p: "We are a peanut-free program and consistently remind students and families not to bring peanut-ingredient foods, but we cannot guarantee that the environment will be completely free of peanuts or other allergens. As the parent or guardian, you are responsible for constantly reminding your child not to take or accept food from anyone else and for ensuring that your child is consistently vocal about any allergies they may have.",
      },
      {
        p: "To the extent permitted by law, I agree to release, indemnify, and hold harmless SPARKS Academy from claims, demands, or causes of action arising from my child(ren)’s or my participation in SPARKS Academy activities, including claims involving injury, illness, damage, or loss, except where such release is prohibited by law.",
      },
      { p: "I acknowledge that I have read this statement, understand the potential risks associated with participation, and voluntarily accept those risks on behalf of myself and my child(ren)." },
      { h: "Parental Responsibility for Child Awareness, Supervision, and Safety" },
      {
        p: "I acknowledge and agree that I, as the parent or legal guardian, have primary and ongoing responsibility for my child(ren)’s safety, awareness, and behavior at all times while participating in SPARKS Academy activities. This includes, but is not limited to:",
      },
      {
        ul: [
          "Personally explaining all known and potential risks, facility hazards, activity rules, and expected behavior to my child(ren) before and throughout the program.",
          "Ensuring my child(ren) understand and are willing and able to follow all safety instructions, rules, and adult directions.",
          "Inspecting the activity area and asking questions about different activities and promptly removing or prohibiting my child(ren) from any activity or area that I believe is unsafe or inappropriate for them.",
          "Instructing my child(ren) on personal safety practices, including recognizing hazards (such as sharp objects, open flames, kitchen appliances, cleaning products, animals, or wildlife), avoiding them, and immediately reporting concerns to an adult.",
        ],
      },
      {
        p: "I accept full responsibility for ensuring my child(ren) are adequately prepared, aware, and responsible for their own safety and the safety of others. I understand that SPARKS Academy coordinators, instructors, and parent volunteers cannot continuously monitor every child and that supervision is shared and limited.",
      },
      { h: "Child Conduct and Parental Indemnification" },
      {
        p: "I agree that I am responsible for my child(ren)’s conduct. If my child(ren) cause injury, damage, or loss to any person or property, I will indemnify and hold harmless SPARKS Academy from any resulting claims, to the extent permitted by law. I further agree that SPARKS Academy may, in its discretion, require my child(ren) to leave an activity if their behavior creates a safety risk or disrupts the program.",
      },
      { h: "Emergency Medical Authorization" },
      {
        p: "I authorize SPARKS Academy coordinators, instructors, and designated parent volunteers to act on my behalf in an emergency if I cannot be reached or it is impracticable to communicate with me or another family member. This authorization includes seeking emergency medical care or other treatment for my child(ren) as deemed necessary under the circumstances. I agree to be responsible for medical expenses incurred on behalf of my child(ren).",
      },
      {
        p: "If I, as the parent or legal guardian, experience a medical emergency and am unable to communicate, I authorize the responsible adults present at SPARKS Academy to contact emergency services, including calling 911 when necessary. I understand that I am responsible for any medical expenses incurred on my behalf.",
      },
      { h: "Medical Conditions, Allergies, and Medications" },
      {
        p: "I agree to disclose relevant medical conditions, allergies, medications, and other health-related information concerning my child(ren) that could affect their safety or participation in SPARKS Academy activities. I understand that incomplete or inaccurate information may increase the risk of harm and may affect the ability of SPARKS Academy personnel to respond appropriately in an emergency.",
      },
      {
        p: "I further agree to update this information promptly if anything changes, and I accept responsibility for any increased risk that results from incomplete, inaccurate, or outdated information I provide.",
      },
      { h: "Facility Disclaimer and Assumption of Risk" },
      {
        p: "I understand that SPARKS Academy meets in a facility that may be used by other individuals or groups on days when SPARKS Academy is not in session. As a result, SPARKS Academy coordinators and volunteers may not be aware of every condition or potential hazard on the premises or in the surrounding area. Such hazards may include, but are not limited to, kitchen appliances, tools, cleaning products, and animals or wildlife (such as cats, spiders, or other animals) that may enter indoor or outdoor spaces.",
      },
      {
        p: "I acknowledge that reasonable care is taken to promote a safe environment; however, I understand that not all hazards can necessarily be anticipated, identified, or controlled. I accept responsibility for helping my child(ren) understand the importance of personal safety and agree to communicate consistently with them about recognizing potential hazards, following safety expectations, and making responsible choices to help protect themselves and others.",
      },
      {
        p: "To the extent permitted by law, I accept the risks associated with conditions or hazards that may be present at the facility and understand that the responsibility of SPARKS Academy is subject to applicable law and the circumstances of any incident.",
      },
      { h: "Acknowledgment and Agreement" },
      { p: "By signing below, I confirm that:" },
      {
        ul: [
          "I have carefully read this entire document.",
          "I understand the risks and my primary responsibility for my child(ren)’s awareness, supervision, and safety.",
          "I have had the opportunity to ask questions and ask for any clarification I need.",
          "I am signing voluntarily on behalf of myself and my child(ren).",
          "I have explained the relevant risks and rules to my child(ren) in an age-appropriate manner.",
        ],
      },
    ],
    signLabel: "Type your full name to e-sign in agreement with the Release of Liability",
  },
  {
    id: "joy",
    title: "Sparking JOY",
    blocks: [
      {
        p: "I am committed to sparking the joy of learning for my child so they may become a lifelong learner and freely release their innate talents and abilities.",
      },
    ],
    signLabel: "Type your full name to e-sign in agreement with Sparking JOY",
  },
];
