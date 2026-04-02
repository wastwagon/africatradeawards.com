'use client'

import { createContext, useContext, type ReactNode } from 'react'
import {
	type PublicSiteSettingsDTO,
	FALLBACK_PUBLIC_SITE_SETTINGS,
} from '@/lib/public-site-settings'

const SiteConfigContext = createContext<PublicSiteSettingsDTO>(FALLBACK_PUBLIC_SITE_SETTINGS)

export function SiteConfigProvider({
	value,
	children,
}: {
	value: PublicSiteSettingsDTO
	children: ReactNode
}) {
	return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig(): PublicSiteSettingsDTO {
	return useContext(SiteConfigContext)
}
