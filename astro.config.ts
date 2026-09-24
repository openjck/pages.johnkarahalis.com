// @ts-check

import type { Dirent } from "node:fs";
import { readdirSync } from "node:fs";
import { unified } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import remarkCustomHeaderId from "remark-custom-header-id";

type SidebarLink = {
  label: string;
  link: string;
};

// https://stackoverflow.com/a/1026087/715866
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSidebarEntries(): SidebarLink[] {
  const faqDir: string = "src/content/docs/board-games/faqs";
  const faqPath: string = "/board-games/faqs";

  return readdirSync(faqDir, { withFileTypes: true })
    .filter((dirent: Dirent) => dirent.isDirectory())
    .map((dirent: Dirent) => {
      return {
        label: capitalizeFirstLetter(dirent.name),
        link: `${faqPath}/${dirent.name}`,
      };
    });
}

export default defineConfig({
  integrations: [
    starlight({
      // Do not use Starlight to power or theme _any_ 404 pages.
      //
      // If this line were omitted, Starlight would power and theme all 404
      // pages, even for paths that are totally unrelated to pages that
      // Starlight manages. For example, even "/missing/path/here" would be
      // powered by a Starlight 404 page, with the site title of "Board Game
      // FAQs..." and all the rest. That would be confusing, since this whole
      // domain is not dedicated to board game FAQs.
      //
      // There is currently a 404 page in src/pages/404.mdx which is rendered
      // instead for all 404 routes. If _that_ were not provided, the host's 404
      // page (e.g., Netlify's 404 page) would display for all 404 routes.
      disable404Route: true,

      components: {
        // Do not use a link for the site title, since there's nothing
        // meaningful to link to.
        SiteTitle: "./src/components/TextOnlySiteTitle.astro",
      },
      favicon: "/images/favicon.ico",
      pagefind: false,
      sidebar: getSidebarEntries(),
      title: "Board Game FAQs by John Karahalis",
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkCustomHeaderId],
    }),
  },
});
