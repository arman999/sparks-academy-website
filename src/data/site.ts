/* ==================================================================
   SPARKS ACADEMY: HOMEPAGE CONTENT
   ------------------------------------------------------------------
   All the words on the homepage live in this file. Edit the text
   between the quotes, save, and push to GitHub; the site updates
   itself. Keep the quotes, commas and brackets as they are.
   ================================================================== */

import type { IconName } from "./icons";

export const site = {
  name: "Sparks Academy",
  tagline: "Team Learning Enrichment Center",
  description:
    "A joyful project-based learning enrichment center for 1st–6th graders in Riverside, CA, combining academic excellence with deep character building.",
  url: "https://sparksacademyenrichment.com",
  location: "Riverside, CA",
  phone: "559.904.0999",
  phoneHref: "tel:+15599040999",
  joinPath: "/join",
};

/* ---------- Top navigation (each link scrolls to a section) ---------- */
export const nav = [
  { label: "Vision", href: "/#vision" },
  { label: "Programs", href: "/#programs" },
  { label: "Schedule", href: "/#schedule" },
  { label: "Why Sparks", href: "/#why-sparks" },
  { label: "FAQ", href: "/#faq" },
];

/* ---------- Hero (top of the page) ---------- */
export const hero = {
  eyebrow: "Team Learning Enrichment Center · Riverside, CA",
  // The word in `highlight` gets the yellow swash. It must appear in `title`.
  title: "Sparking a joy of learning in every child’s heart.",
  highlight: "joy",
  subtitle:
    "Sparks Academy is a project-based learning environment for 1st–6th graders, sparking academic and personal growth through collaboration, hands-on learning and joy.",
  primaryCta: "Join Sparks Today",
  secondaryCta: { label: "Explore our programs", href: "#programs" },
  facts: [
    { icon: "users", text: "Grades 1–6" },
    { icon: "calendar", text: "Fridays, 10 AM–3 PM" },
    { icon: "mapPin", text: "Riverside, CA" },
  ] satisfies { icon: IconName; text: string }[],
  // Describe the hero photo for screen readers (used once src/assets/hero.jpg exists)
  photoAlt: "Sparks Academy students working together on a hands-on project",
  // Floating labels around the hero picture
  orbit: ["Public speaking", "Science", "Entrepreneurship", "Character", "Math", "Cultural studies", "Teamwork"],
};

/* ---------- Scrolling cards (loop forever, pause on hover) ---------- */
// type "feature" = white card with an icon
// type "quote"   = blue card with a testimonial
export const cards: (
  | { type: "feature"; icon: IconName; text: string }
  | { type: "quote"; text: string; author: string }
)[] = [
  { type: "feature", icon: "mic", text: "Kids develop public speaking skills" },
  { type: "quote", text: "My son gained so much confidence last year", author: "Sparks Mom" },
  { type: "feature", icon: "sprout", text: "Cultivating the innate talents and abilities of children" },
  { type: "quote", text: "My child came completely out of his shell!", author: "Sparks Mom" },
  {
    type: "quote",
    text: "I love this place because you teach us things we can actually use in real life",
    author: "Sparks Student",
  },
];

/* ---------- Vision & mission ---------- */
export const vision = {
  eyebrow: "Sparks Academy vision",
  title: "Sparking academic and personal growth through collaboration, hands-on learning and joy.",
  vision:
    "Our vision is to spark a joy of learning in every child’s heart, empowering students to solve problems and build skills collaboratively so they grow into compassionate, confident, and capable individuals who contribute positively to their families, communities, and the world.",
  mission:
    "Our mission is to empower children to be excellent team members and challenge themselves academically through an innovative, student-led educational experience. We are committed to fostering academic and personal growth through hands-on projects and interactive activities.",
  subjects: [
    { icon: "bookOpen", label: "Language arts" },
    { icon: "calculator", label: "Math" },
    { icon: "flask", label: "Science" },
    { icon: "globe", label: "Cultural studies" },
    { icon: "briefcase", label: "Entrepreneurship" },
    { icon: "heart", label: "Good character" },
  ] satisfies { icon: IconName; label: string }[],
};

/* ---------- What we offer (the two teams) ---------- */
export const teams = {
  eyebrow: "What we offer",
  title: "Two teams, one spark.",
  intro: "Students learn in two teams matched to their grade level, so every child can lead, collaborate and grow.",
  items: [
    {
      name: "Big Sparks Team",
      grades: "Grades 4–6",
      tone: "brand" as const,
      body: "Students engage in project-based learning for language arts, cultural studies, science, math, character building (virtues) and cultivating an entrepreneur-like mindset. The projects and their layered learning are led by the students as much as possible, with the guidance of parents. Students have innate abilities and talents; our unique project-based learning approach gives our kids opportunities to rise to their potential as leaders and collaborators.",
      tags: ["Language arts", "Cultural studies", "Science", "Math", "Virtues", "Entrepreneurship"],
    },
    {
      name: "Little Sparks Team",
      grades: "Grades 1–3",
      tone: "spark" as const,
      body: "In Little Sparks, students build leadership skills by helping lead whole-group lessons. They also take part in hands-on activities for writing, reading, science, cultural studies, personal development, entrepreneurship, and Spanish, and work as a team during project-based learning that involves multiple subjects.",
      tags: ["Reading", "Writing", "Science", "Spanish", "Cultural studies", "Leadership"],
    },
  ],
};

/* ---------- Schedule, location & tuition ---------- */
export const program = {
  eyebrow: "Schedule, location & tuition",
  title: "Fridays are for sparking.",
  schedule: {
    day: "Fridays",
    time: "10:00 AM – 3:00 PM",
    note: "Project-based learning",
  },
  character: {
    time: "9:30 – 10:00 AM",
    title: "Free & optional character session",
    body: "Before class, we host a session focused exclusively on character development. This inclusive space welcomes both interfaith and secular perspectives to explore the virtues that build strong, resilient characters.",
    virtues: ["Generosity", "Truthfulness", "Focus", "Wisdom", "Patience", "Confidence"],
  },
  location: {
    city: "Riverside, CA",
    note: "Questions about the location? Call us anytime.",
  },
  tuition: [
    { label: "Friday program", price: "$190", unit: "per month, per child" },
    { label: "Registration fee", price: "$20", unit: "one time" },
    { label: "Materials fee", price: "$40", unit: "for the whole year (subsidized)" },
  ],
  peanutFree:
    "Sparks is a peanut-free program. Please make sure snacks and lunches are peanut-free.",
};

/* ---------- Comparison table ---------- */
export const comparison = {
  eyebrow: "Why Sparks",
  title: "Learning that fits your child, not the other way around.",
  leftTitle: "Conventional learning",
  rightTitle: "Sparks Academy",
  // Each pair is [left column, right column] on the same row.
  rows: [
    [
      "Every child moves through the same lessons at the same pace, ready or not",
      "Customized curriculum that meets every child at their own pace, unique interests, and skill level (whether below, at, or above grade level)",
    ],
    [
      "Teacher-led lessons that can feel disconnected from real life",
      "Student-led project-based learning with real-world applications for their lives",
    ],
    [
      "Hard tasks and mistakes are something to avoid",
      "Building character and resilience by taking on challenges, while sparking the joy of tackling hard things and learning new things",
    ],
    [
      "A fixed list of topics that leaves little room for curiosity",
      "Real-time adaptive learning experiences that build on each child’s curiosity, interests, and readiness to learn",
    ],
  ] as [string, string][],
};

/* ---------- Frequently asked questions ---------- */
// Write [JOIN] to insert a "Join Sparks Today" link, and [PHONE] for the phone number.
export const faq = {
  eyebrow: "FAQ",
  title: "Questions parents ask us",
  items: [
    {
      q: "How do I register and enroll?",
      a: "To join Sparks Academy, fill out our registration form: [JOIN]. After you register, one of our coordinators will be happy to call you and answer any follow-up questions. You can also call us at [PHONE].",
    },
    {
      q: "How much is tuition and fees?",
      a: "The one-day-a-week drop-off program on Fridays is $190 a month per child. The registration fee is $20, and the materials fee is subsidized: only $40 for the entire year.",
    },
    {
      q: "Will I be able to watch my student in class?",
      a: "Absolutely. While Sparks Academy is primarily a drop-off program, you are welcome to observe quietly. Space is limited, so we kindly ask you to minimize noise to avoid distracting the students. If you’d like to be nearby, there is also a room next to both classes where you can stay and work.",
    },
    {
      q: "Does my child bring lunch?",
      a: "Yes. Please pack a peanut-free lunch to eat with their friends. We also suggest a snack they can enjoy during their first break between rotations. Children should bring a water bottle each session.",
    },
    {
      q: "Is your enrichment center aligned with state standards?",
      a: "Yes. Our programs are designed to foster both academic growth and character development. By delivering a high-quality educational experience that aligns with your charter school’s specific learning objectives, we make it seamless for families and charter administrators to meet state and charter requirements.",
    },
    {
      q: "Do you work with students with special needs?",
      a: "Yes. We welcome learners of all abilities and tailor our instruction to individual needs and family requests, provided students are able to follow center safety and conduct guidelines. Reach out to discuss a customized plan for your child.",
    },
    {
      q: "What homeschool charters are you affiliated with?",
      a: "We are working to establish partnerships with a handful of charter schools. If you’d like to recommend Sparks Academy to your charter school, please call us at [PHONE].",
    },
  ],
};

/* ---------- Final call to action ---------- */
export const finalCta = {
  title: "Ready to spark the joy of learning?",
  body: "Registration takes about 10–15 minutes. After you register, one of our coordinators will reach out to welcome your family and answer any questions.",
  cta: "Join Sparks Today",
};
