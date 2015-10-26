import fs from 'fs'
import path from 'path'
import stream from 'stream'

import Yaml2json from '@adius/yaml2json'

import Json2obj from '../source/index'


fs
	.createReadStream(path.join(__dirname, 'tetrahedron.yaml'))
	.pipe(new Yaml2json)
	.pipe(new stream.Transform({
		writableObjectMode: true,
		readableObjectMode: true,
		transform: function (chunk, encoding, done) {
			chunk.faces.forEach(face => this.push(face))
			done()
		}
	}))
	.pipe(new Json2obj)
	.pipe(new stream.Transform({
		transform: (chunk, encoding, done) => done(null, chunk)
	}))
	//.pipe(process.stdout)
