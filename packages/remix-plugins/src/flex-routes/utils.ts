import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const paramPrefixChar = "$";
const escapeStart = "[";
const escapeEnd = "]";
const optionalStart = "(";
const optionalEnd = ")";

export const visitFiles = async (dir: string, visitor: (file: string) => void, base = dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true, encoding: "utf8" })) {
    const file = join(dir, entry.name);

    if (entry.isDirectory()) {
      await visitFiles(file, visitor, base);
    } else if (entry.isFile()) {
      visitor(relative(base, file));
    }
  }
};

type State = "NORMAL" | "ESCAPE" | "OPTIONAL" | "OPTIONAL_ESCAPE";

export const getRouteSegments = (routeId: string): [string[], string[]] => {
  const routeSegments: string[] = [];
  const rawRouteSegments: string[] = [];

  let index = 0;
  let routeSegment = "";
  let rawRouteSegment = "";
  let state: State = "NORMAL";

  const pushRouteSegment = (segment: string, rawSegment: string) => {
    if (!segment) {
      return;
    }

    if (rawSegment.includes("*") || rawSegment.includes(":") || rawSegment.includes("?")) {
      throw new Error("路由文件或目录中不能存在 `*` `:` `?` 特殊字符");
    }

    routeSegments.push(segment);
    rawRouteSegments.push(rawSegment);
  };

  while (index < routeId.length) {
    const char = routeId[index];
    index++;

    switch (state) {
      case "NORMAL": {
        if (char && [".", "/"].includes(char)) {
          pushRouteSegment(routeSegment, rawRouteSegment);
          routeSegment = "";
          rawRouteSegment = "";
          state = "NORMAL";
          break;
        }
        if (char === escapeStart) {
          state = "ESCAPE";
          rawRouteSegment += char;
          break;
        }
        if (char === optionalStart) {
          state = "OPTIONAL";
          rawRouteSegment += char;
          break;
        }
        if (!routeSegment && char == paramPrefixChar) {
          if (index === routeId.length) {
            routeSegment += "*";
            rawRouteSegment += char;
          } else {
            routeSegment += ":";
            rawRouteSegment += char;
          }
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case "ESCAPE": {
        if (char === escapeEnd) {
          state = "NORMAL";
          rawRouteSegment += char;
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case "OPTIONAL": {
        if (char === optionalEnd) {
          routeSegment += "?";
          rawRouteSegment += char;
          state = "NORMAL";
          break;
        }

        if (char === escapeStart) {
          state = "OPTIONAL_ESCAPE";
          rawRouteSegment += char;
          break;
        }

        if (!routeSegment && char === paramPrefixChar) {
          if (index === routeId.length) {
            routeSegment += "*";
            rawRouteSegment += char;
          } else {
            routeSegment += ":";
            rawRouteSegment += char;
          }
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
      case "OPTIONAL_ESCAPE": {
        if (char === escapeEnd) {
          state = "OPTIONAL";
          rawRouteSegment += char;
          break;
        }

        routeSegment += char;
        rawRouteSegment += char;
        break;
      }
    }
  }

  pushRouteSegment(routeSegment, rawRouteSegment);

  return [routeSegments, rawRouteSegments];
};

export const createRoutePath = (routeSegments: string[], rawRouteSegments: string[], isIndex?: boolean) => {
  const result: string[] = [];

  if (isIndex) {
    routeSegments = routeSegments.slice(0, -1);
  }

  for (let index = 0; index < routeSegments.length; index++) {
    let segment = routeSegments[index];
    const rawSegment = rawRouteSegments[index];

    if (segment.startsWith("_") && rawSegment.startsWith("_")) {
      continue;
    }

    if (segment.endsWith("_") && rawSegment.endsWith("_")) {
      segment = segment.slice(0, -1);
    }

    result.push(segment);
  }

  return result.length ? result.join("/") : undefined;
};

const PrefixLookupTrieEndSymbol = Symbol("PrefixLookupTrieEndSymbol");

type PrefixLookupNode = {
  [key: string]: PrefixLookupNode;
} & Record<typeof PrefixLookupTrieEndSymbol, boolean>;

export class PrefixLookupTrie {
  root: PrefixLookupNode = {
    [PrefixLookupTrieEndSymbol]: false,
  };

  add(value: string) {
    if (!value) throw new Error("Cannot add empty string to PrefixLookupTrie");

    let node = this.root;
    for (const char of value) {
      if (!node[char]) {
        node[char] = {
          [PrefixLookupTrieEndSymbol]: false,
        };
      }
      node = node[char];
    }
    node[PrefixLookupTrieEndSymbol] = true;
  }

  findAndRemove(prefix: string, filter: (nodeValue: string) => boolean): string[] {
    let node = this.root;
    for (const char of prefix) {
      if (!node[char]) return [];
      node = node[char];
    }

    return this.#findAndRemoveRecursive([], node, prefix, filter);
  }

  #findAndRemoveRecursive(
    values: string[],
    node: PrefixLookupNode,
    prefix: string,
    filter: (nodeValue: string) => boolean,
  ): string[] {
    for (const char of Object.keys(node)) {
      this.#findAndRemoveRecursive(values, node[char], prefix + char, filter);
    }

    if (node[PrefixLookupTrieEndSymbol] && filter(prefix)) {
      node[PrefixLookupTrieEndSymbol] = false;
      values.push(prefix);
    }

    return values;
  }
}
