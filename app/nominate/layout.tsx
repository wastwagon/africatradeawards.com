import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nominate",
  description:
    "Submit a nomination for the Africa Trade Awards. Share why a person or organisation deserves recognition.",
  openGraph: {
    title: "Nominate | Africa Trade Awards",
    description:
      "Submit a nomination for the Africa Trade Awards. Share why a person or organisation deserves recognition.",
    type: "website",
  },
};

export default function NominateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

