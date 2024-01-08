import test from "node:test";
import assert from "node:assert/strict";
import { Archive, parse } from ".";

test("basic parse", () => {
  const input = `comment1
comment2
-- file1 --
File 1 text.
-- foo ---
More file 1 text.
-- file 2 --
File 2 text.
-- empty --
-- noNL --
hello world
-- empty filename line --
some content
-- --`;

  const got = parse(input);

  compare(got, {
    comment: "comment1\ncomment2\n",
    files: [
      {
        name: "file1",
        data: "File 1 text.\n-- foo ---\nMore file 1 text.\n",
      },
      { name: "file 2", data: "File 2 text.\n" },
      { name: "empty", data: "" },
      { name: "noNL", data: "hello world\n" },
      {
        name: "empty filename line",
        data: "some content\n-- --\n",
      },
    ],
  });
});

function compare(input: Archive, expected: Archive) {
  assert.deepEqual(input.comment, expected.comment);
  assert.equal(input.files.length, expected.files.length);
  for (let i = 0; i < input.files.length; i++) {
    assert.equal(input.files[i].name, expected.files[i].name);
    assert.deepEqual(input.files[i].data, expected.files[i].data);
  }
}
