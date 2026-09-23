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
  markdown: {
    processor: unified({
      remarkPlugins: [remarkCustomHeaderId],
    }),
  },
  integrations: [
    starlight({
      title: "Board Game FAQs by John Karahalis",
      disable404Route: true,
      pagefind: false,
      components: {
        // Do not use a link for the site title, since there's nothing meaningful
        // to link to.
        SiteTitle: "./src/components/TextOnlySiteTitle.astro",
      },
      sidebar: getSidebarEntries(),
    }),
  ],
});
