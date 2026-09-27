export interface NavLink {
  label: string;
  href: string;
}

export interface HeroContent {
  titleTop: string;
  titleBottom: string;
  titleAccent: string;
  subtitle: string;
  cta: NavLink;
}

export interface CodePanelContent {
  filename: string;
  status: string;
  runLabel: string;
  code: string;
  output: string[];
}

export interface PlanDuration {
  label: string;
  price: number;
  strikePrice: number;
  discount: number;
  popular?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  kicker: string;
  description: string;
  durations: PlanDuration[];
  features: string[];
  cta: string;
  bestValue?: boolean;
}

export interface Course {
  title: string;
  href: string;
  tag: string;
  blurb: string;
}

export interface Feature {
  title: string;
  blurb: string;
  icon: "spark" | "ai" | "stack" | "pulse";
}

export interface Mentor {
  name: string;
  role: string;
  bio: string;
  initials: string;
  badges: string[];
  href: string;
}

export interface Testimonial {
  name: string;
  quote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SiteContent {
  brand: string;
  nav: NavLink[];
  navCta: NavLink;
  hero: HeroContent;
  codePanel: CodePanelContent;
  membership: {
    kicker: string;
    title: string;
    titleAccent: string;
    blurb: string;
    note: string;
    plans: Plan[];
  };
  offer: { title: string; blurb: string; courses: Course[] };
  why: { title: string; blurb: string; features: Feature[] };
  companies: { title: string; names: string[] };
  mentors: { title: string; people: Mentor[] };
  testimonials: { title: string; blurb: string; items: Testimonial[] };
  faq: { title: string; blurb: string; items: FaqItem[] };
  footer: {
    blurb: string;
    columns: FooterColumn[];
    copyright: string;
  };
}
