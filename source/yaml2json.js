import stream from 'stream'
import yaml from 'js-yaml'

export default class Yaml2json extends stream.Transform {

	constructor (
		{writableObjectMode, readableObjectMode} = {
			writableObjectMode: false,
			readableObjectMode: true
		}
	) {
		super({writableObjectMode, readableObjectMode})

		this.internalBuffer = ''
	}

	_flush  (done) {
		let json = yaml.safeLoad(this.internalBuffer)

		if (this.readableObjectMode) {
			json.faces.forEach(face => this.push(face))
		}
		else {
			json.faces.forEach(
				face => this.push(JSON.stringify(face))
			)
		}

		done()
	}

	_transform (chunk, encoding, done) {
		this.internalBuffer = this.internalBuffer.concat(chunk.toString())
		done()
	}
}
