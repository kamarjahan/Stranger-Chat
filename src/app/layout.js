import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// --- SEO CONFIGURATION ---
export const metadata = {
  title: 'Kamar Jahan | Finance & Tech Portfolio',
  description: 'The professional portfolio of Muhammad Kamar Jahan - Future Chartered Accountant and Full Stack Developer.',
  keywords: ['Kamar Jahan', 'Finance', 'CA', 'Web Developer', 'Portfolio', 'Next.js', 'React'],
  authors: [{ name: 'Kamar Jahan' }],
  creator: 'Kamar Jahan',
  openGraph: {
    title: 'Kamar Jahan | Finance & Tech Portfolio',
    description: 'Bridging the gap between Financial Discipline and Technological Innovation.',
    url: 'https://kamarjahan.in',
    siteName: 'Kamar Jahan Portfolio',
    images: [
      {
        url: 'https://kamarjahan.in/profile.png', // Uses your profile photo as the preview
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kamar Jahan | Finance & Tech Portfolio',
    description: 'Future CA & Tech Enthusiast.',
    images: ['https://kamarjahan.in/profile.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}