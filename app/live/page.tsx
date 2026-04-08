import type { Metadata } from "next";
import Layout from "@/components/layout/Layout";
import LiveStreamSection from "@/components/site/LiveStreamSection";
import { getPublicSiteSettings } from "@/lib/public-site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSiteSettings();
  return {
    title: `${s.eventLiveStreamTitle.trim() || "Live stream"} | Africa Trade Awards`,
    description: "Watch the Africa Trade Awards live stream on event day.",
  };
}

export default async function LivePage() {
  const s = await getPublicSiteSettings();
  return (
    <Layout>
      <LiveStreamSection
        title={s.eventLiveStreamTitle.trim() || "Live stream"}
        enabled={s.eventLiveStreamEnabled}
        embedUrl={s.eventLiveStreamEmbedUrl.trim()}
      />
    </Layout>
  );
}
