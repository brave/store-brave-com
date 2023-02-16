import { error } from '@sveltejs/kit';
import { readdir, readFile } from 'fs/promises';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const prerender = true;

const BASE_DIR = './src/pages';

export const load: PageServerLoad = async ({ params }) => {  
  const pageMap = (await readdir(BASE_DIR)).reduce((pageMap, page) => {
    if (page.endsWith(".md")) {
      const slug = page.replace('.md', '');
      return new Map(...pageMap, [[slug, page]]);
    } else {
      return pageMap;
    }
  }, new Map());

  if (!pageMap.has(params.slug)) {
    throw error(404, "Page not found.");
  }

  const pageData = await readFile(`${BASE_DIR}/${pageMap.get(params.slug)}`, "utf-8");
  const { metadata, body } = extract_frontmatter(pageData);

  return {
    title: metadata.title,
    body: marked.parse(body)
  };
};

/**
 * Simple frontmatter extractor modified from @sveltejs
 * https://github.com/sveltejs/kit/blob/master/sites/kit.svelte.dev/src/lib/docs/server/markdown.js#L174-L187
 */
function extract_frontmatter(markdown: string) {
	const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown) || ["", markdown];
	const frontmatter = match[1]
	const body = markdown.slice(match[0].length);

	const metadata: Record<string, string> = {};
	frontmatter.split(/\r?\n/).forEach((pair) => {
		const i = pair.indexOf(':');
		metadata[pair.slice(0, i).trim()] = pair.slice(i + 1).trim();
	});

	return { metadata, body };
}
