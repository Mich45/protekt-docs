import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Setting up Protekt in your project takes less than 5 minutes. Regardless
        of your tech stack, Protekt provides a simple yet powerful set of
        methods and functions to secure your app.
      </>
    ),
  },
  {
    title: 'Stateless by Default',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        You don't need a database to run Protekt. Storing user sessions in your
        app database can become chaotic quickly. Protekt abstracts away the
        complexity by securely managing user identities, sessions, and tokens
        for you, automagically.
      </>
    ),
  },
  {
    title: 'Battle-Tested and Battle-Ready',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Protekt enhances your app security using state-of-the-art encryption
        algorithms, keeping you and your users' data secure against a wide range
        of attacks.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
