import stream from 'stream'

export function toObj () {

}

export default class Json2obj extends stream.Transform {

	constructor (
		{writableObjectMode, readableObjectMode} = {
			writableObjectMode: false,
			readableObjectMode: true
		}
	) {
		super({writableObjectMode, readableObjectMode})

		this.vertices = new Set
		this.textureCoordinates = new Set
		this.vertexNormals = new Set
		this.parameterVertices = new Set
		this.faces = new Set
	}

	_flush (done) {
		done()
	}

	_transform (chunk, encoding, done) {

		if (this.writableObjectMode){
			this.vertices.add chunk.vertices.add
		}

		this.push(chunk.toStrin
		this.push('\n')
		done()
	}
}
