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
  /** Banner treatment: silver for the standard tier, gold for the premium one. */
  banner: "silver" | "gold";
  durations: PlanDuration[];
  features: string[];
  cta: string;
  bestValue?: boolean;
}

export interface Course {
  title: string;
  href: string;
  /** Drives the artwork tint on the card header. */
  accent: "gold" | "cyan" | "violet";
  stack: string;
  live?: boolean;
  popular?: boolean;
  hours?: string;
  duration?: string;
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
  photo: string;
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

/** Interface strings for the offer, kept here so no copy lives in components. */
export interface SaleLabels {
  copy: string;
  copied: string;
  minimise: string;
  showDetails: string;
  expired: string;
}

export interface SaleOffer {
  id: string;
  /** Master switch. False renders no offer at all, whatever the theme asks for. */
  enabled: boolean;
  kicker: string;
  badge: string;
  discountLabel: string;
  appliesTo: string;
  coupon: string;
  cta: NavLink;
  countdownLabel: string;
  /** Optional ISO 8601 with offset. Before this, the offer stays hidden. */
  startsAt?: string;
  /** ISO 8601 with offset. */
  endsAt: string;
  labels: SaleLabels;
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
