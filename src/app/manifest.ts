import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Spendify - Gen-Z Expense Tracker',
    short_name: 'Spendify',
    description: 'The ultra-minimal expense tracker. Track spending, split bills with the squad, and hit your savings goals.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#09090B',
    theme_color: '#09090B',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
