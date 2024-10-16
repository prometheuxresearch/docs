import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
export default {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  learn: [{type: 'autogenerated', dirName: 'learn'}],
  examples: [{type: 'autogenerated', dirName: 'examples'}],
  sdk: [{type: 'autogenerated', dirName: 'sdk'}],
} satisfies SidebarsConfig;

