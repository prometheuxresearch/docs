import Heading from '@theme/Heading';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Create a knowledge graph',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Unify and integrate data across siloed enterprise sources, without data migration.<br />
        Seamless integration with diverse data sources.
      </>
    ),
  },
  {
    title: 'Reason over your data',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Augment data with complex derived knowledge for exploratory and arbitrarily 
hard data analysis.<br />
        Perform in-memory distributed big data processing up to 10000x faster.
      </>
    ),
  },
  {
    title: '100% Confident explanations',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Step-by-step logical explanation for every result.<br />
        Identify and fix missing data via provenance.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className="col col--4">
      <div className="text--center">
        <Svg className="size-[200px]" role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className="flex items-center px-8 w-full">
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
