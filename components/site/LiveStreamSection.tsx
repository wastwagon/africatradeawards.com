type Props = {
  title: string;
  enabled: boolean;
  embedUrl: string;
};

export default function LiveStreamSection({ title, enabled, embedUrl }: Props) {
  const showPlayer = enabled && embedUrl.length > 0;

  return (
    <section className="platform-page">
      <div className="container" style={{ maxWidth: 1040 }}>
        <div className="platform-page-header">
          <p className="platform-eyebrow">Africa Trade Awards</p>
          <h1 className="platform-title">{title}</h1>
          <p className="platform-lead">
            Watch the ceremony here when the stream is live. If playback does not start, open the stream on YouTube or Facebook
            using the official Africa Trade Chamber accounts.
          </p>
        </div>

        {showPlayer ? (
          <div className="ata-live-stream-embed">
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="platform-card">
            <p className="platform-lead" style={{ marginBottom: 0 }}>
              The live stream is not active on the website right now. Please check back on event day or follow our social channels
              for updates.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
