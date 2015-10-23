'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var Yaml2json = (function (_stream$Transform) {
	_inherits(Yaml2json, _stream$Transform);

	function Yaml2json() {
		var _ref = arguments.length <= 0 || arguments[0] === undefined ? {
			writableObjectMode: false,
			readableObjectMode: true
		} : arguments[0];

		var writableObjectMode = _ref.writableObjectMode;
		var readableObjectMode = _ref.readableObjectMode;

		_classCallCheck(this, Yaml2json);

		_get(Object.getPrototypeOf(Yaml2json.prototype), 'constructor', this).call(this, { writableObjectMode: writableObjectMode, readableObjectMode: readableObjectMode });

		this.internalBuffer = '';
	}

	_createClass(Yaml2json, [{
		key: '_flush',
		value: function _flush(done) {
			var _this = this;

			var json = _jsYaml2['default'].safeLoad(this.internalBuffer);

			if (this.readableObjectMode) {
				json.faces.forEach(function (face) {
					return _this.push(face);
				});
			} else {
				json.faces.forEach(function (face) {
					return _this.push(JSON.stringify(face));
				});
			}

			done();
		}
	}, {
		key: '_transform',
		value: function _transform(chunk, encoding, done) {
			this.internalBuffer = this.internalBuffer.concat(chunk.toString());
			done();
		}
	}]);

	return Yaml2json;
})(_stream2['default'].Transform);

exports['default'] = Yaml2json;
module.exports = exports['default'];