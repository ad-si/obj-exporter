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

		this.vertexMap = new Map
		this.textureCoordinateSet = new Set
		this.vertexNormalSet = new Set
		this.parameterVerticeSet = new Set
		this.faceSet = new Set
	}

	_transform (chunk, encoding, done) {

		let face = this.writableObjectMode ? chunk : JSON.parse(chunk)

		this.faceSet.add(face.vertices.map(
			vertex => {

				let vertexString = JSON.stringify(vertex)

				if (this.vertexMap.has(vertexString)) {
					return this.vertexMap.get(vertexString)
				}
				else {
					let vertexMapSize = this.vertexMap.size + 1
					this.vertexMap.set(vertexString, vertexMapSize)
					return vertexMapSize
				}

				this.vertexSet.add()
			}
		))

		done()
	}

	_flush (done) {

		this.push('o Solid Object\n\n')

		for (let vertexString of this.vertexMap.keys()) {
			//console.log('hjkl',vertexString)
			let vertex = JSON.parse(vertexString)
			this.push(`v ${vertex.x} ${vertex.y} ${vertex.z}\n`)
		}

		this.push(
			'\nf ' +
			[...this.faceSet]
				.map(face => face.join(' '))
				.join('\nf ') +
			'\n'
		)

		done()
	}
}
