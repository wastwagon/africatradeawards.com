export type CmsFaqItem = {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  published: boolean;
  publishAt?: string;
  unpublishAt?: string;
};

export type CmsPublicationItem = {
  slug: string;
  title: string;
  excerpt: string;
  dateText: string;
  dateline: string;
  image: string;
  href: string;
  sortOrder: number;
  published: boolean;
  publishAt?: string;
  unpublishAt?: string;
};

export type CmsSnippetItem = {
  key: string;
  label: string;
  content: string;
  sortOrder: number;
};

export const DEFAULT_FAQS: CmsFaqItem[] = [
  {
    question: "What are the Africa Trade Awards?",
    answer:
      "The Africa Trade Awards are recognition honours established by the African Trade Chamber to acknowledge individuals, institutions, enterprises, and public authorities whose work has had a material impact on Africa's trade and industrial development.",
    category: "About",
    sortOrder: 1,
    published: true,
  },
  {
    question: "Are the Awards competitive?",
    answer:
      "No. The Africa Trade Awards are conferred as recognition honours. They do not operate as competitive prizes and are not based on open nominations, rankings, or public voting.",
    category: "Process",
    sortOrder: 2,
    published: true,
  },
  {
    question: "How are recognition decisions made?",
    answer:
      "Recognition decisions are made through a structured review process conducted by the Recognition and Validation Committee. The Committee assesses evidence of delivered outcomes within the reference period, drawing on professional judgment and sector expertise.",
    category: "Process",
    sortOrder: 3,
    published: true,
  },
];

export const DEFAULT_PUBLICATIONS: CmsPublicationItem[] = [
  {
    slug: "africa-trade-awards-2026",
    title: "Africa Trade Awards 2026 Honour Leaders Driving Africa's Industrialisation and Intra-African Trade",
    excerpt:
      "The Africa Trade Awards 2026 concluded in Accra as a landmark celebration of leadership, innovation, and execution in advancing Africa's industrialisation and intra-African trade agenda under the AfCFTA.",
    dateText: "January 29, 2026",
    dateline: "Accra, Ghana",
    image: "/assets/img/gallery/2P9A9182.jpg",
    href: "/publications/africa-trade-awards-2026",
    sortOrder: 1,
    published: true,
  },
];

export const DEFAULT_ABOUT_SNIPPETS: CmsSnippetItem[] = [
  {
    key: "about_overview_paragraph_1",
    label: "About overview paragraph 1",
    content:
      "The Africa Trade Awards are recognition honours established by the African Trade Chamber to acknowledge individuals, institutions, enterprises, and public authorities whose work has materially shaped Africa's trade and industrial landscape.",
    sortOrder: 1,
  },
  {
    key: "about_overview_paragraph_2",
    label: "About overview paragraph 2",
    content:
      "The Awards recognise those whose decisions and execution influenced how goods are produced, financed, moved, and exchanged across African markets.",
    sortOrder: 2,
  },
  {
    key: "about_overview_paragraph_3",
    label: "About overview paragraph 3",
    content:
      "Conferred as part of the Africa Trade Summit 2026, the Awards sit within a broader convening of public and private sector leaders focused on trade, industrial development, finance, infrastructure, and market integration.",
    sortOrder: 3,
  },
  {
    key: "about_recognition_how_it_works",
    label: "How recognition works",
    content:
      "The Awards are conferred as recognition honours. They are not based on open nominations or public voting. Recognition is determined through a structured review process grounded in delivered outcomes.",
    sortOrder: 10,
  },
  {
    key: "about_governance_oversight",
    label: "Governance and oversight",
    content:
      "The Awards are governed through a structured oversight framework designed to ensure professional judgment, consistency, and institutional credibility in recognition decisions.",
    sortOrder: 11,
  },
  {
    key: "about_committee_intro",
    label: "Committee introduction",
    content:
      "The Recognition and Validation Committee reviews and validates recognition decisions. Members are senior professionals drawn from trade, finance, industry, infrastructure, and public policy.",
    sortOrder: 20,
  },
  {
    key: "about_committee_footer",
    label: "Committee footer",
    content:
      "Recognition decisions are reached through deliberation and professional judgment, guided by the Awards principles and scope.",
    sortOrder: 30,
  },
];
