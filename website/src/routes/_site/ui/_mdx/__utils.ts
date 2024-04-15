import type { MetaDescriptor, MetaFunction } from "@remix-run/node";
import { mergeMeta } from "@resolid/framework/utils";

export const mergeFrontmatter = (frontmatter: { title: string; description?: string }): MetaFunction => {
  return mergeMeta(() => {
    const meta: MetaDescriptor[] = [{ title: frontmatter.title }];

    if (frontmatter.description) {
      meta.push({ name: "description", content: frontmatter.description });
    }

    return meta;
  });
};
