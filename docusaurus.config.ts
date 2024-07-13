import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tailwindPlugin from './plugins/tailwind-plugin'


const config: Config = {
  title: 'Prometheux',
  tagline: '',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://prometheux.co.uk/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'prometheux', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  deploymentBranch: 'main',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [tailwindPlugin],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/prometheuxresearch/docs/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'Prometheux Logo',
        src: 'img/logotype.svg',
        srcDark: 'img/logotype-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'learn',
          position: 'left',
          label: 'Learn',
        },    
        {
          href: 'https://www.prometheux.co.uk',
          label: 'Back to homepage',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Learn',
              to: `/learn/getting-started`,
            },
          ],
        },
    
        {
          title: 'More',
          items: [
            {
              label: 'Home',
              to: 'https://www.prometheux.co.uk',
            },
            {
              label: 'Research',
              to: 'https://www.prometheux.co.uk/#research-section',
            },
            {
              label: 'LinkedIn',
              to: 'https://www.linkedin.com/company/prometheux'
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Prometheux. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['prolog', 'bash', 'cypher'],
      defaultLanguage: 'prolog',
      
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
