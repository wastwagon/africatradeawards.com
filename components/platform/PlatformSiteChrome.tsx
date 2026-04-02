"use client";

import type { ReactNode } from "react";
import Layout from "@/components/layout/Layout";

type Props = { children: ReactNode };

/** Same header/footer as the marketing site so login, vote, and portals feel like one product. */
export default function PlatformSiteChrome({ children }: Props) {
  return (
    <Layout>
      <div className="platform-shell">{children}</div>
    </Layout>
  );
}
