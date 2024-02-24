import { describe, expect, test } from "vitest";
import { mergeMeta } from "./merge";

describe("mergeMeta function", () => {
  test("should merge and filter metadata correctly", () => {
    const matches = [
      {
        meta: [
          { title: "RootTitle" },
          { name: "description", content: "RootDescription" },
          { property: "og:title", content: "og:title" },
        ],
      },
      { meta: [{ title: "ParentTitle" }, { name: "description", content: "ParentDescription" }] },
    ];

    const leafMetaFn = () => [{ title: "LeafTitle" }, { name: "description", content: "LeafDescription" }];

    const mergedMetaFn = mergeMeta(leafMetaFn);

    // @ts-expect-error is not assignable to type
    const mergedMeta = mergedMetaFn({ matches });

    expect(mergedMeta).toEqual([
      { title: "LeafTitle - ParentTitle - RootTitle" },
      { name: "description", content: "LeafDescription" },
      { property: "og:title", content: "og:title" },
    ]);
  });
});
