import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import styles from './index.module.css'

const frameworks = [
  {
    title: 'Browser',
    description: 'Vanilla JavaScript — works everywhere',
    link: '/docs/quickstarts/browser',
    icon: '🌐',
  },
  {
    title: 'React',
    description: 'Components and hooks for React apps',
    link: '/docs/quickstarts/react',
    icon: '⚛️',
  },
  {
    title: 'Next.js',
    description: 'Server and client support for Next.js',
    link: '/docs/quickstarts/nextjs',
    icon: '▲',
  },
  {
    title: 'Node.js',
    description: 'Server-side tracking for Node.js',
    link: '/docs/quickstarts/node',
    icon: '🟢',
  },
]

function Hero() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={styles.hero}>
      <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
      <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
      <Link className="button button--primary button--lg" to="/docs/quickstarts/browser">
        Get Started
      </Link>
    </header>
  )
}

function FrameworkCard({ title, description, link, icon }) {
  return (
    <Link to={link} className={styles.card}>
      <span className={styles.cardIcon}>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  )
}

function FrameworkGrid() {
  return (
    <section className={styles.frameworks}>
      <h2>Choose your framework</h2>
      <div className={styles.grid}>
        {frameworks.map((fw) => (
          <FrameworkCard key={fw.title} {...fw} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Hero />
      <main className={styles.main}>
        <FrameworkGrid />
      </main>
    </Layout>
  )
}
