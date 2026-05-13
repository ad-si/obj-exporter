# obj-exporter

Export array-based representations of 3D models to
[Wavefront OBJ](https://en.wikipedia.org/wiki/Wavefront_.obj_file) files.

Works as a Node stream (one face per chunk) for memory-efficient conversion
of large meshes, or as a synchronous function for in-memory data.


## Installation

```sh
npm install obj-exporter
```

Requires Node.js 18 or newer.


## Mesh format

A mesh is a list of polygonal faces. Each face has an array of `vertices`
with `x`, `y`, `z` coordinates. Vertices that appear in more than one face
are deduplicated automatically.

```ts
interface Vertex { x: number; y: number; z: number }
interface Face   { vertices: Vertex[]; normal?: Vertex }
interface Mesh   { faces: Face[] }
```

Example:

```js
const tetrahedron = {
  faces: [
    {
      vertices: [
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: 1 },
      ],
    },
    {
      vertices: [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
      ],
    },
  ],
}
```


## Library usage

### Synchronous conversion

```js
import { writeFileSync } from "node:fs"
import { toObj } from "obj-exporter"

writeFileSync("tetrahedron.obj", toObj(tetrahedron))
```

Produces:

```
o Solid Object

v 1 0 0
v 0 1 0
v 0 0 1
v 0 0 0

f 1 2 3
f 4 1 3
```


### Streaming conversion

`Json2obj` is a `node:stream` Transform. By default it consumes face
objects (`writableObjectMode: true`) and emits OBJ text.

```js
import { createWriteStream } from "node:fs"
import { Readable } from "node:stream"
import Json2obj from "obj-exporter"

Readable.from(tetrahedron.faces)
  .pipe(new Json2obj())
  .pipe(createWriteStream("tetrahedron.obj"))
```

To consume a newline-delimited JSON stream of faces instead of objects,
disable writable object mode:

```js
process.stdin
  .pipe(new Json2obj({ writableObjectMode: false }))
  .pipe(process.stdout)
```


### Lower-level builder

If you want to assemble an OBJ string without involving streams, use
`ObjBuilder` directly:

```js
import { ObjBuilder } from "obj-exporter"

const builder = new ObjBuilder()
for (const face of tetrahedron.faces) builder.addFace(face)
const obj = builder.toString()
```


## CLI usage

The package installs an `obj-exporter` binary that converts a YAML or JSON
mesh file to OBJ on stdout.

```sh
# From a file (mesh loaded into memory)
obj-exporter tetrahedron.yaml > tetrahedron.obj

# From a stream of newline-delimited JSON faces
cat faces.ndjson | obj-exporter > out.obj
```


## API

| Export             | Type                                              | Description                                                       |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------------------- |
| `toObj(mesh)`      | `(mesh: Mesh) => string`                          | Convert a `{ faces }` object to an OBJ string.                    |
| `Json2obj`         | `class extends stream.Transform`                  | Streaming converter. Default: object input, text output.          |
| `ObjBuilder`       | `class { addFace(face); toString(): string }`     | Incrementally builds an OBJ string, deduplicating vertices.       |
| `Vertex`, `Face`, `Mesh` | TypeScript types                            | Re-exported for typed usage.                                      |


## Development

```sh
npm install
npm test       # runs the TypeScript test suite via tsx
npm run build  # emits ESM + .d.ts files to dist/
```
