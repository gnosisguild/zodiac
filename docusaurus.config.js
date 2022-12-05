const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Zodiac",
  tagline: "The expansion pack for DAOs",
  url: "https://zodiac.eth",
  baseUrl: "/zodiac/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "gnosis", // Usually your GitHub org/user name.
  projectName: "zodiac", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Zodiac",
      logo: {
        alt: "Zodiac",
        src: "img/logo.png",
      },
      items: [
        {
          href: "https://zodiac.wiki/",
          label: "zodiac.wiki",
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
              label: "zodiac.wiki",
              to: "https://zodiac.wiki/index.php/Category:Documentation",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/gnosisguild",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/gnosisguild",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              href: "https://gnosisguild.mirror.xyz/",
            },
            {
              label: "GitHub",
              href: "https://github.com/gnosis/zodiac",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Gnosis.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    colorMode: {
      // "light" | "dark"
      defaultMode: "dark",
      // Dark/light switch icon options
      switchConfig: {
        // Icon for the switch while in dark mode
        darkIcon: "🌙",
        lightIcon: "☀️",
      },
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/gnosis/zodiac/edit/master/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/gnosis/zodiac/edit/master/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
