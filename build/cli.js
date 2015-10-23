'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = convert;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _bufferConverter = require('buffer-converter');

var _bufferConverter2 = _interopRequireDefault(_bufferConverter);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function convert() {
	var args = process.argv.slice(2);
	var output = '';
	var flags = {};

	args.forEach(function (cliArgument) {
		if (/^\-\-/i.test(cliArgument)) flags[cliArgument.slice(2)] = true;
	});

	if (process.stdin.isTTY) {

		if (!args.length) {
			console.log('Usage: ' + _path2['default'].basename(process.argv[1]) + ' <json mesh-file>');

			return process.exit(1);
		}

		var filePath = args.pop();

		if (!_path2['default'].isAbsolute(filePath)) filePath = _path2['default'].join(process.cwd(), filePath);

		var jsonStl = _jsYaml2['default'].safeLoad(_fs2['default'].readFileSync(filePath));

		output = (0, _index.toObj)(jsonStl);

		process.stdout.write(output);
	} else {
		process.stdin.setEncoding('utf-8');

		process.stdin.pipe(new _index2['default']()).pipe(process.stdout);
	}
}

module.exports = exports['default'];