export interface ArticleHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export function extractHeadings(markdown: string): ArticleHeading[] {
  const tree = unified().use(remarkParse).parse(markdown);
  const slugger = new GithubSlugger();
  const headings: ArticleHeading[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) {
      return;
    }

    const text = toString(node);
    headings.push({
      depth: node.depth,
      text,
      id: slugger.slug(text)
    });
  });

  return headings;
}
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import type { Heading } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
