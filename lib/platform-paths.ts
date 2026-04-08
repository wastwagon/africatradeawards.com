/** Routes that use `PlatformSiteChrome` / account-style pages (dark mode toggle applies here). */
export function isPlatformChromePath(pathname: string | null): boolean {
	if (!pathname) return false
	return (
		pathname.startsWith("/login") ||
		pathname.startsWith("/vote") ||
		pathname.startsWith("/portal")
	)
}
