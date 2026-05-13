import { createReadStream } from "node:fs"
import { dirname, join } from "node:path"
import { Transform } from "node:stream"
import { pipeline } from "node:stream/promises"
import { fileURLToPath } from "node:url"
import { strict as assert } from "node:assert"
import { test } from "node:test"

import Yaml2json from "@adius/yaml2json"

import Json2obj, { toObj, type Face, type Mesh } from "../src/index.js"

const here = dirname(fileURLToPath(import.meta.url))

test("toObj produces vertices and faces for a tetrahedron", () => {
  const mesh: Mesh = {
    faces: [
      {
        vertices: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 0, z: 0 },
          { x: 0, y: 1, z: 0 },
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

  const obj = toObj(mesh)

  assert.match(obj, /^o Solid Object\n/)
  assert.match(obj, /\nv 0 0 0\n/)
  assert.match(obj, /\nv 1 0 0\n/)
  assert.match(obj, /\nv 0 1 0\n/)
  assert.match(obj, /\nv 0 0 1\n/)
  assert.match(obj, /\nf 1 2 3\n/)
  assert.match(obj, /\nf 1 2 4\n/)
})

test("Json2obj transforms streamed face objects to OBJ", async () => {
  const facesToObjects = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk: { faces: Face[] }, _enc, done) {
      for (const face of chunk.faces) this.push(face)
      done()
    },
  })

  const collector = new Transform({
    transform(chunk, _enc, done) {
      done(null, chunk)
    },
  })

  const chunks: Buffer[] = []
  collector.on("data", (c: Buffer) => chunks.push(c))

  await pipeline(
    createReadStream(join(here, "tetrahedron.yaml")),
    new Yaml2json(),
    facesToObjects,
    new Json2obj(),
    collector,
  )

  const out = Buffer.concat(chunks).toString("utf8")
  assert.match(out, /^o Solid Object\n/)
  assert.ok(out.includes("v 1 0 0"))
  assert.ok(out.includes("v 0 1 0"))
  assert.ok(out.includes("v 0 0 1"))
  assert.ok(out.includes("v 0 0 0"))
  assert.match(out, /\nf \d+ \d+ \d+/)
})
