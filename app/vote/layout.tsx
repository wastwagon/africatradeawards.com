import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public voting",
  description:
    "Cast your vote for Africa Trade Awards nominees. Secure verification helps keep the vote fair and transparent.",
  openGraph: {
    title: "Public voting | Africa Trade Awards",
    description:
      "Cast your vote for Africa Trade Awards nominees. Secure verification helps keep the vote fair and transparent.",
    type: "website",
  },
};

export default function VoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

