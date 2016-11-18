'use strict';

var archiver = require('archiver');
var path = require('path');
var fs = require('fs');

// add here all the dirs that will be zipped
const dirs = [
    'es/02-javascript/02-practica/start-here',
    'es/03-javascript-en-el-navegador/03-practica/start-here'
];

dirs.forEach(function (src) {
    let zipFile = archiver('zip');
    let filename = path.join(path.dirname(src), `${path.basename(src)}.zip`);

    let output = fs.createWriteStream(filename);
    output.on('close', function () {
        console.log(`${filename} - ${zipFile.pointer()} total bytes`);
    });

    zipFile.pipe(output);
    zipFile.glob('**/*', {
        expand: true,
        cwd: src,
        dot: true
    });
    zipFile.finalize();
});
