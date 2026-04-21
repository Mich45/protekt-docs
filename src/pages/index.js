import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Shield, Zap, CloudOff, ShieldCheck, ChevronRight } from 'lucide-react';
import styles from './index.module.css';

const features = [
  {
    icon: Zap,
    title: 'Easy to Use',
    description:
      'Drop-in SDKs for all major frameworks. Get authentication running in less than 5 minutes with our intuitive APIs.',
  },
  {
    icon: CloudOff,
    title: 'Stateless by Default',
    description:
      'No database lookups required for validation. JWT-based sessions that scale infinitely across your infrastructure.',
  },
  {
    icon: ShieldCheck,
    title: 'Battle-Tested',
    description:
      'Enterprise-grade security standards built-in. Regularly audited and trusted by teams managing millions of users.',
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Protekt Documentation" description={siteConfig.tagline}>
      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              v1.0 
            </div>
            <h1 className={styles.heroTitle}>
              Identity and access management for{' '}
              <span className={styles.heroAccent}>developers</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Secure your applications with stateless authentication,
              fine-grained access controls, and a developer experience
              designed for the modern web.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.btnPrimary} to="/docs/introduction">
                Get Started
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={styles.features}>
          <div className={styles.featuresInner}>
            <h2 className={styles.featuresTitle}>Core Capabilities</h2>
            <div className={styles.featureGrid}>
              {features.map(({ icon: Icon, title, description }) => (
                <div key={title} className={styles.featureCard}>
                  <div className={styles.featureGlow} />
                  <div className={styles.featureIcon}>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className={styles.featureCardTitle}>{title}</h3>
                  <p className={styles.featureCardDesc}>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code snippet */}
        <section className={styles.code}>
          <div className={styles.codeGlow} />
          <div className={styles.codeInner}>
            <h2 className={styles.codeTitle}>Implement in seconds</h2>
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span /><span /><span />
                </div>
                <span className={styles.codeFilename}>auth.ts</span>
              </div>
              <div className={styles.codePre}>
                <div className={styles.lineNumbers}>
                  {[1,2,3,4].map(n => <span key={n}>{n}</span>)}
                </div>
                <pre><code>
                  <span className={styles.kw}>import</span>{' '}{'{ Protekt }'}{' '}
                  <span className={styles.kw}>from</span>{' '}
                  <span className={styles.str}>'@protekt/node'</span>;{'\n\n'}
                  <span className={styles.kw}>const</span> auth ={' '}
                  <span className={styles.cls}>new</span> Protekt({'{\n'}
                  {'  '}apiKey: process.env.PROTEKT_KEY{'\n'}
                  {'}'});
                </code></pre>
              </div>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}