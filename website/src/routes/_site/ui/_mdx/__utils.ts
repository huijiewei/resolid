import { mergeMeta } from "@resolid/framework/utils";
import type { MetaDescriptor, MetaFunction } from "react-router";

export const mergeFrontmatter = (frontmatter: { title: string; description?: string }): MetaFunction => {
  return mergeMeta(() => {
    const meta: MetaDescriptor[] = [{ title: frontmatter.title }];

    if (frontmatter.description) {
      meta.push({ name: "description", content: frontmatter.description });
    }

    return meta;
  });
};
