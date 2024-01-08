# txtar

This is a nodejs module for reading [txtar](https://pkg.go.dev/golang.org/x/tools/txtar#hdr-Txtar_format)

## Usage

Given a txtar file, eg `example.txtar` with the following contents

```txt
Some comment
-- file1.txt --
file1 contents
-- file2.txt --
file2 contents
```

You can parse it like this

```ts
import { parseFile } from "txtar";

const archive = await parseFile("./example.txtar");

console.log(archive.comment); // Some comment

console.log(archive.files[0].name); // file1.txt
console.log(archive.files[0].data); // file1 contents
```
