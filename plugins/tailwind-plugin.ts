import type {Config} from '@docusaurus/types'

type PluginConfig = Config['plugins'][0]

const tailwindPlugin:PluginConfig = (context, options) =>  {
  return {
    name: "tailwind-plugin",
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = [
        require("postcss-import"),
        require("tailwindcss"),
        require("autoprefixer"),
      ];
      return postcssOptions;
    },
  };
}

export default tailwindPlugin