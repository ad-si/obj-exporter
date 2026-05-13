#!/usr/bin/env node
import { readFileSync } from "node:fs"
import { basename, isAbsolute, join } from "node:path"

import yaml from "js-yaml"

import Json2obj, { toObj, type Mesh } from "./index.js"

export default function convert(): void {
  const args = process.argv.slice(2)

  if (process.stdin.isTTY) {
    if (args.length === 0) {
      console.log(`Usage: ${basename(process.argv[1])} <yaml or json mesh-file>`)
      process.exit(1)
    }

    const inputArg = args[args.length - 1]
    const filePath = isAbsolute(inputArg) ? inputArg : join(process.cwd(), inputArg)
    const mesh = yaml.load(readFileSync(filePath, "utf8")) as Mesh

    process.stdout.write(toObj(mesh))
    return
  }

  process.stdin.setEncoding("utf8")
  process.stdin.pipe(new Json2obj({ writableObjectMode: false })).pipe(process.stdout)
}

const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url.endsWith(process.argv[1] ?? "")

if (isMainModule) convert()
