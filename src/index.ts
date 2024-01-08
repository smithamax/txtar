import { readFile } from "node:fs/promises";

export type File = {
  name: string;
  data: string;
};

export type Archive = {
  comment: string;
  files: File[];
};

export async function parseFile(path: string): Promise<Archive> {
  return parse(await readFile(path, { encoding: "utf8" }));
}

export function parse(str: string): Archive {
  let content: string | null = str;

  const marker = findFileMarker(content);

  const ar: Archive = { comment: marker.before, files: [] };
  let lastName = marker.name;
  content = marker.after;

  while (content) {
    const { before, name, after } = findFileMarker(content);
    ar.files.push({ name: lastName, data: before });
    content = after;
    lastName = name;
  }

  return ar;
}

function findFileMarker(str: string): {
  before: string;
  name: string;
  after: string | null;
} {
  let i = 0;
  for (;;) {
    const marker = isMarker(str.slice(i));
    if (marker) {
      return {
        before: str.slice(0, i),
        name: marker.name,
        after: marker.after,
      };
    }
    const j = str.indexOf(NEWLINE_MARKER, i);
    if (j === -1) {
      if (str.length > 0 && !str.endsWith("\n")) {
        str += "\n";
      }
      return {
        before: str,
        name: "",
        after: null,
      };
    }

    i = j + 1;
  }
}

const NEWLINE_MARKER = "\n-- ";
const MARKER = "-- ";
const MARKER_END = " --";

function isMarker(str: string): { name: string; after: string } | null {
  // if string doesn't have prefix `-- ` early return
  if (str.slice(0, 3) !== MARKER) {
    return null;
  }

  // find next newline
  const nl = str.indexOf("\n");
  if (nl === -1) return null;

  const after = str.slice(nl + 1);
  str = str.slice(0, nl);

  // if string doesn't have suffix ` --` or it has no name
  if (
    str.slice(-3) !== MARKER_END ||
    str.length <= MARKER.length + MARKER_END.length
  ) {
    return null;
  }

  return {
    name: str.slice(MARKER.length, -MARKER_END.length),
    after,
  };
}
