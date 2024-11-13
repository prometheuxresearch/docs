import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import tailwindPlugin from "./plugins/tailwind-plugin";

const config: Config = {
  title: "Prometheux",
  tagline: "",
  favicon: "img/logo.svg",

  // Set the production url of your site here
  url: "https://prometheux.co.uk/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/docs",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "prometheux", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.
  deploymentBranch: "main",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [tailwindPlugin],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/prometheuxresearch/docs/edit/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          ignorePatterns: ["https://prometheux.co.uk/"],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    algolia: {
      // The application ID provided by Algolia
      appId: "DCCC0T0ITC",

      // Public API key: it is safe to commit it
      apiKey: "870d45e2eaf4483e87c2204607df57c7",

      indexName: "prometheux-co",

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push.
      // Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      externalUrlRegex: "external\\.com|domain\\.com",

      // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      replaceSearchResultPathname: {
        from: "/docs/", // or as RegExp: /\/docs\//
        to: "/",
      },

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: "search",

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: true,

      //... other Algolia params
    },
    navbar: {
      title: "",
      logo: {
        alt: "Prometheux Logo",
        src: "img/logotype.svg",
        srcDark: "img/logotype-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "learn",
          position: "left",
          label: "Learn",
        },
        {
          type: "docSidebar",
          sidebarId: "examples",
          position: "left",
          label: "Examples",
        },
        {
          type: "docSidebar",
          sidebarId: "sdk",
          position: "left",
          label: "Python SDK",
        },
        {
          href: "https://www.prometheux.ai",
          label: "Back to homepage",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Learn",
              to: "/learn/getting-started",
            },
            {
              label: "Examples",
              to: "/examples",
            },
            {
              label: "SDK",
              to: "/sdk",
            },
          ],
        },

        {
          title: "More",
          items: [
            {
              label: "Home",
              to: "https://www.prometheux.co.uk",
            },
            {
              label: "Research",
              to: "https://www.prometheux.co.uk/#research-section",
            },
            {
              label: "LinkedIn",
              to: "https://www.linkedin.com/company/prometheux",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Prometheux. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["prolog", "bash", "cypher"],
      defaultLanguage: "prolog",
    },
  } satisfies Preset.ThemeConfig,
  customFields: {
    docsChatUrl: "http://constellation-dev.prometheux.ai:3001/api/docsChat",
  },
};

export default config;
