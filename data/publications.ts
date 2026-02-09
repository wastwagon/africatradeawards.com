export interface Publication {
  slug: string
  title: string
  excerpt: string
  date: string
  dateline?: string
  image?: string
}

export const publications: Publication[] = [
  {
    slug: 'africa-trade-awards-2026',
    title: 'Africa Trade Awards 2026 Honour Leaders Driving Africa\'s Industrialisation and Intra-African Trade',
    excerpt: 'The Africa Trade Awards 2026 concluded in Accra as a landmark celebration of leadership, innovation, and execution in advancing Africa\'s industrialisation and intra-African trade agenda under the African Continental Free Trade Area (AfCFTA).',
    date: 'January 29, 2026',
    dateline: 'Accra, Ghana',
    image: '/assets/img/gallery/2P9A9182.jpg',
  },
]
