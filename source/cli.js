import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'
import bufferConverter from 'buffer-converter'

import TransformStream, {toObj} from './index'


export default function convert () {
	let args = process.argv.slice(2)
	let output = ''
	let flags = {}

	args.forEach((cliArgument) => {
		if (/^\-\-/i.test(cliArgument))
			flags[cliArgument.slice(2)] = true
	})


	if (process.stdin.isTTY) {

		if (!args.length) {
			console.log(
				`Usage: ${path.basename(process.argv[1])} <json mesh-file>`
			)

			return process.exit(1)
		}

		let filePath = args.pop()

		if (!path.isAbsolute(filePath))
			filePath = path.join(process.cwd(), filePath)

		let jsonStl = yaml.safeLoad(fs.readFileSync(filePath))

		output = toObj(jsonStl)

		process.stdout
			.write(output)
	}
	else {
		process.stdin.setEncoding('utf-8')

		process.stdin
			.pipe(new TransformStream())
			.pipe(process.stdout)
	}
}
