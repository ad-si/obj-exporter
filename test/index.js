import fs from 'fs'
import path from 'path'

import ObjTransformer from '../source/index'
import Yaml2json from '../source/yaml2json'


fs
	.createReadStream(path.join(__dirname, 'tetrahedron.yaml'))
	.pipe(new Yaml2json)
	.pipe(new ObjTransformer)
	.pipe(process.stdout)
