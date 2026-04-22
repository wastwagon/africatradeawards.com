import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Africa Trade Awards team for partnership, media, or general enquiries.",
  openGraph: {
    title: "Contact | Africa Trade Awards",
    description: "Contact the Africa Trade Awards team for partnership, media, or general enquiries.",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

