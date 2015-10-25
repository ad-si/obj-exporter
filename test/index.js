import fs from 'fs'
import path from 'path'
import stream from 'stream'

import Json2obj from '../source/index'
import Yaml2json from '../source/yaml2json'

let yaml2json = new Yaml2json
let json2obj = new Json2obj({readableObjectMode: false})

yaml2json.on('error', console.error)
json2obj.on('error', console.error)

fs
	.createReadStream(path.join(__dirname, 'tetrahedron.yaml'))
	.pipe(yaml2json)
	.pipe(json2obj)
	.pipe(new stream.Writable({
		write: (chunk, encoding, done) => done()
	}))
