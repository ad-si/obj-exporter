import {
  Transform,
  type TransformCallback,
  type TransformOptions,
} from "node:stream"

export interface Vertex {
  x: number
  y: number
  z: number
}

export interface Face {
  vertices: Vertex[]
  normal?: Vertex
}

export interface Mesh {
  faces: Face[]
}

export interface Json2objOptions {
  writableObjectMode?: boolean
  readableObjectMode?: boolean
}

export class ObjBuilder {
  private readonly vertexMap = new Map<string, number>()
  private readonly faceList: number[][] = []

  addFace(face: Face): void {
    const indices = face.vertices.map((vertex) => {
      const key = JSON.stringify(vertex)
      const existing = this.vertexMap.get(key)
      if (existing !== undefined) return existing
      const next = this.vertexMap.size + 1
      this.vertexMap.set(key, next)
      return next
    })
    this.faceList.push(indices)
  }

  toString(): string {
    const lines: string[] = ["o Solid Object", ""]

    for (const key of this.vertexMap.keys()) {
      const v = JSON.parse(key) as Vertex
      lines.push(`v ${v.x} ${v.y} ${v.z}`)
    }

    lines.push("")

    for (const face of this.faceList) {
      lines.push(`f ${face.join(" ")}`)
    }

    return lines.join("\n") + "\n"
  }
}

export function toObj(mesh: Mesh): string {
  const builder = new ObjBuilder()
  for (const face of mesh.faces) builder.addFace(face)
  return builder.toString()
}

export default class Json2obj extends Transform {
  private readonly builder = new ObjBuilder()
  private lineBuffer = ""

  constructor({
    writableObjectMode = true,
    readableObjectMode = false,
  }: Json2objOptions = {}) {
    const opts: TransformOptions = { writableObjectMode, readableObjectMode }
    super(opts)
  }

  private processFace(face: Face): void {
    if (face && Array.isArray(face.vertices)) {
      this.builder.addFace(face)
    }
  }

  override _transform(
    chunk: unknown,
    _encoding: BufferEncoding,
    done: TransformCallback,
  ): void {
    if (this.writableObjectMode) {
      if (typeof chunk !== "object" || chunk === null) {
        done(
          new TypeError(
            'Chunk must be of type "object" ' +
              "or writableObjectMode must be set to false",
          ),
        )
        return
      }
      this.processFace(chunk as Face)
      done()
      return
    }

    const text = Buffer.isBuffer(chunk)
      ? chunk.toString("utf8")
      : String(chunk)
    this.lineBuffer += text

    const lines = this.lineBuffer.split("\n")
    this.lineBuffer = lines.pop() ?? ""

    try {
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        this.processFace(JSON.parse(trimmed) as Face)
      }
      done()
    } catch (err) {
      done(err as Error)
    }
  }

  override _flush(done: TransformCallback): void {
    try {
      const remaining = this.lineBuffer.trim()
      if (remaining) {
        this.processFace(JSON.parse(remaining) as Face)
      }
      this.push(this.builder.toString())
      done()
    } catch (err) {
      done(err as Error)
    }
  }
}
