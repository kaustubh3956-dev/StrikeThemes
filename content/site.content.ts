import type { SiteContent } from "./types";

/** Single source of truth for every string on the page. Swap this file to rebrand. */
export const siteContent: SiteContent = {
  brand: "STRIKE",

  nav: [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Practice", href: "/practice" },
    { label: "CodeArena", href: "/code-arena" },
    { label: "Quiz", href: "/quiz" },
    { label: "System Design", href: "/system-design" },
    { label: "Contests", href: "/contests" },
  ],
  navCta: { label: "Get Started", href: "/signup" },

  hero: {
    titleTop: "Take control of your",
    titleBottom: "Future With",
    titleAccent: "Strike",
    subtitle:
      "Master DSA, System Design & AI with interactive coding environments",
    cta: { label: "Join Us", href: "/signup" },
  },

  codePanel: {
    filename: "strike.js",
    status: "READY",
    runLabel: "Run Code",
    code: `// Two Sum — O(n) with a hash map
function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
    output: ["> node strike.js", "[ 0, 1 ]", "✓ passed in 0.04s"],
  },

  membership: {
    kicker: "The Strike Membership",
    title: "Membership",
    titleAccent: "Plans",
    blurb:
      "One focused investment in your engineering career. Every course, present and future. Pay once, learn forever.",
    note: "Prices inclusive of GST · One-time payment · No renewals",
    plans: [
      {
        id: "plus",
        name: "Strike Plus",
        kicker: "Membership Plan",
        description:
          "All existing Strike courses with access for your selected duration.",
        durations: [
          { label: "2 Years", price: 10499, strikePrice: 16999, discount: 38 },
          { label: "3 Years", price: 11999, strikePrice: 18499, discount: 35 },
          {
            label: "4 Years",
            price: 14374,
            strikePrice: 19999,
            discount: 38,
            popular: true,
          },
        ],
        features: [
          "All current courses included",
          "HD recordings",
          "Live class access during plan",
          "Notes",
          "Resume Review",
          "Certificates",
          "System Design Platform",
          "DSA Platform",
          "Coder Arena Platform",
        ],
        cta: "Get Strike Plus",
      },
      {
        id: "ultra",
        name: "Strike Ultra",
        kicker: "Membership Plan",
        description:
          "This plan includes all existing courses, plus upcoming courses for your selected duration.",
        durations: [
          { label: "2 Years", price: 11499, strikePrice: 20999, discount: 45 },
          { label: "3 Years", price: 13499, strikePrice: 22999, discount: 41 },
          {
            label: "4 Years",
            price: 15524,
            strikePrice: 24999,
            discount: 46,
            popular: true,
          },
        ],
        features: [
          "Everything in Strike Plus",
          "Upcoming batches included",
          "Coder Arena Platform",
          "Certificates",
          "Resume Review",
          "Notes",
          "System Design Platform",
          "DSA Platform",
        ],
        cta: "Get Strike Ultra",
        bestValue: true,
      },
    ],
  },

  offer: {
    title: "What We Offer",
    blurb: "Explore our comprehensive courses designed to elevate your skills",
    courses: [
      {
        title: "Thunder: 100 Days of Code",
        href: "/course/thunder-web",
        tag: "Web",
        blurb: "A hundred-day sprint from fundamentals to shipped products.",
      },
      {
        title: "DevOps: Foundations to Production",
        href: "/course/devops",
        tag: "DevOps",
        blurb: "Pipelines, containers and observability the way teams run them.",
      },
      {
        title: "DSA + GenAI Combo",
        href: "/course/combo",
        tag: "Combo",
        blurb: "Algorithmic depth paired with applied generative AI.",
      },
      {
        title: "Data Structures & Algorithms",
        href: "/course/dsa",
        tag: "DSA",
        blurb: "First-principles problem solving across 200+ curated problems.",
      },
      {
        title: "Generative AI",
        href: "/course/gen-ai",
        tag: "AI",
        blurb: "Build real AI products with modern frameworks and evaluation.",
      },
    ],
  },

  why: {
    title: "Why Choose Us",
    blurb:
      "Learn smarter with modern tools, guided mentors, and a platform built to help you grow your skills faster.",
    features: [
      {
        title: "Interview Preparation",
        blurb: "Hands-on tracks and mentor feedback modelled on real loops.",
        icon: "spark",
      },
      {
        title: "AI Support",
        blurb: "Contextual hints that explain the why, never just the answer.",
        icon: "ai",
      },
      {
        title: "Project Based Learning",
        blurb: "Ship production-shaped projects, not toy exercises.",
        icon: "stack",
      },
      {
        title: "Track Your Progress",
        blurb: "Live progress tracking that keeps streaks and gaps visible.",
        icon: "pulse",
      },
    ],
  },

  companies: {
    title: "Get All Premium Questions Asked In FAANG Companies",
    names: [
      "Google",
      "Meta",
      "Amazon",
      "Apple",
      "Netflix",
      "Cisco",
      "PayPal",
      "Oracle",
      "Microsoft",
      "Uber",
    ],
  },

  mentors: {
    title: "Meet With Our Mentors",
    people: [
      {
        name: "Rohit Negi",
        role: "Founder & Lead Instructor",
        bio: "Heartfelt problem solver, instructor and visionary leader. Highest placement in India of 2 Cr+. Post graduate from IIT Guwahati, GATE-CSE'20 AIR 202.",
        initials: "RN",
        badges: ["Ex-Uber", "IIT Graduate", "2 Cr+ Package"],
        href: "https://www.linkedin.com/in/rohit-negi9/",
      },
      {
        name: "Aditya Tandon",
        role: "Co-Founder & Senior Instructor",
        bio: "Senior software engineer passionate about scalable systems and elegant algorithms. Dedicated mentor committed to teaching, learning and inspiring future developers.",
        initials: "AT",
        badges: ["Ex-Ola", "IIT Guwahati", "@Oxyzo"],
        href: "https://www.linkedin.com/in/adityatandon2/",
      },
    ],
  },

  testimonials: {
    title: "Trusted by Visionaries",
    blurb: "Hear from real learners who built their careers with Strike",
    items: [
      {
        name: "Namita Singh",
        quote:
          "I learned everything from beginner to advanced levels and built multiple real-world projects that strengthened my skills and boosted my confidence as a full-stack developer.",
      },
      {
        name: "Gopal Kumar Jha",
        quote:
          "Rohit Bhaiya taught not just the what but the why behind everything. My consistency broke many times, but I finally made it.",
      },
      {
        name: "Adheli Priyanka",
        quote:
          "Builds from basics with in-depth explanations. Daily homework, live classes and project contests with rewards kept me motivated throughout.",
      },
      {
        name: "Alok",
        quote:
          "The live classes, HD recordings and daily practice problems made learning smooth. Real-world projects prepared me for actual development work.",
      },
      {
        name: "Aryan Verma",
        quote:
          "The First Principles teaching helped me understand concepts deeply, not just memorize solutions like other courses.",
      },
      {
        name: "Shree",
        quote:
          "From zero coding knowledge to building full-stack projects. The mentorship and doubt support made all the difference in my journey.",
      },
      {
        name: "Navlesh Kumar",
        quote:
          "The First Principles approach transformed how I build applications. Every concept clicked perfectly and boosted my confidence.",
      },
      {
        name: "Mehul Prajapati",
        quote:
          "The way complex topics like System Design are taught is unmatched. I built 5+ projects that directly helped me crack multiple interviews.",
      },
      {
        name: "Sonu",
        quote:
          "MERN stack, DSA and System Design all in one place. The community support and regular contests pushed me beyond my limits.",
      },
      {
        name: "Babita Patel",
        quote:
          "A true from-scratch learning experience. Daily assignments, live guidance and project challenges kept me consistent every single day.",
      },
    ],
  },

  faq: {
    title: "Your Questions, Answered",
    blurb: "Get instant answers to the most common questions about Strike.",
    items: [
      {
        question: "What programming languages can I learn on the platform?",
        answer:
          "Strike offers comprehensive courses in JavaScript, Python, Java, C++, React and Node.js, plus Data Structures, Algorithms, System Design and Full-Stack Development with hands-on projects.",
      },
      {
        question: "What will I learn in the DSA + Gen AI course?",
        answer:
          "Data Structures & Algorithms from basics to advanced, alongside Generative AI fundamentals. Arrays, trees, graphs and dynamic programming, plus building AI-powered applications with modern frameworks. Includes 200+ problems, live doubt sessions and real-world AI projects.",
      },
      {
        question: "Do I need prior coding experience to join?",
        answer:
          "Basic programming knowledge in any language is recommended. If you are completely new, start with our beginner programming course first. The DSA + Gen AI course is designed for learners who know basic syntax.",
      },
      {
        question: "How is Gen AI integrated with DSA in this course?",
        answer:
          "You will learn how AI models use data structures internally, how to optimise algorithms for AI applications, and how to build projects like chatbots, code generators and recommendation systems.",
      },
      {
        question: "Will this help me crack product-based company interviews?",
        answer:
          "The course is designed for interview preparation. You will solve 200+ problems from interview archives, learn the First Principles approach, and get weekly mock interviews.",
      },
      {
        question: "How long does it take to complete the course?",
        answer:
          "Designed to be completed in 6-8 months with consistent daily practice. You get access to all course materials for your plan duration, so you can learn at your own pace.",
      },
    ],
  },

  footer: {
    blurb:
      "Empowering developers with cutting-edge tools and resources. Strike is your gateway to endless coding with guided lessons and real projects.",
    columns: [
      {
        title: "Platform",
        links: [
          { label: "Home", href: "/" },
          { label: "Practice", href: "/practice" },
          { label: "DSA Sheet", href: "/dsa-sheet" },
        ],
      },
      {
        title: "Company",
        links: [{ label: "Contact", href: "/contact" }],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms of Service", href: "/terms" },
          { label: "Privacy Policy", href: "/privacy" },
        ],
      },
    ],
    copyright: "© 2026 STRIKE. All rights reserved.",
  },
};
