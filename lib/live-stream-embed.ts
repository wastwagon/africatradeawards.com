/**
 * Normalize user-pasted URLs into iframe-safe embed src values.
 * Supports YouTube watch / short links / embed URLs and Facebook video plugin URLs.
 */
export function normalizeLiveStreamEmbedUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";

  let u: URL;
  try {
    u = new URL(t);
  } catch {
    throw new Error("Live stream URL is not valid.");
  }

  if (u.protocol !== "https:") {
    throw new Error("Live stream URL must use https://.");
  }

  let host = u.hostname.toLowerCase();
  if (host.startsWith("www.")) host = host.slice(4);
  if (host.startsWith("m.")) host = host.slice(2);

  if (host === "youtube.com" && (u.pathname === "/watch" || u.pathname.startsWith("/watch/"))) {
    const v = u.searchParams.get("v");
    if (!v || !/^[\w-]{6,}$/.test(v)) {
      throw new Error("YouTube watch URL must include a valid video id (the v= parameter).");
    }
    return `https://www.youtube.com/embed/${encodeURIComponent(v)}`;
  }

  if (host === "youtube.com" && u.pathname.startsWith("/shorts/")) {
    const id = u.pathname.split("/").filter(Boolean)[1];
    if (!id || !/^[\w-]{6,}$/.test(id)) {
      throw new Error("YouTube Shorts URL is invalid.");
    }
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  }

  if (host === "youtu.be") {
    const id = u.pathname.split("/").filter(Boolean)[0];
    if (!id || !/^[\w-]{6,}$/.test(id)) {
      throw new Error("YouTube short link (youtu.be) is invalid.");
    }
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  }

  if ((host === "youtube.com" || host === "youtube-nocookie.com") && u.pathname.startsWith("/embed/")) {
    const rest = u.pathname.slice("/embed/".length);
    const id = rest.split("/")[0];
    if (!id || !/^[\w-]{6,}$/.test(id)) {
      throw new Error("YouTube embed URL is invalid.");
    }
    return `${u.origin}/embed/${encodeURIComponent(id)}${u.search}`;
  }

  if (host === "facebook.com" && u.pathname === "/plugins/video.php") {
    return u.toString();
  }

  throw new Error(
    "Use a YouTube link (watch, Shorts, youtu.be, or /embed/…) or a Facebook embed URL (facebook.com/plugins/video.php?… from the embed dialog).",
  );
}
