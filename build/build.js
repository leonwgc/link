const fs = require('fs');
const colors = require('colors');
const path = require('path');
const zlib = require('zlib');
const rollup = require('rollup');
const uglify = require('uglify-js');

function build(env) {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  if (!fs.existsSync('lib')) {
    fs.mkdirSync('lib');
  }
  for (var config of require('./rollup.config')(env)) {
    startRollup(config);
  }
}

function startRollup(config) {
  const isMinified = /min\.js$/.test(config.dest)
  return rollup.rollup(config).then(bundle => {
    const code = bundle.generate(config).code;
    if (isMinified) {
      const minified = (config.header ? config.header + '\n' : '') + uglify.minify(code, {
        fromString: true,
        output: {
          screw_ie8: true,
          ascii_only: true
        }
      }).code;
      return write(config.dest, minified, true);
    } else {
      return write(config.dest, code);
    }
  }).catch(function(e){
    console.error(e);
    process.exit(1);
  });
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(colors.yellow(path.relative(process.cwd(), dest) + ' ' + getSize(code) + (extra || '')))
      resolve();
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err);
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err);
          report(' (gzipped: ' + getSize(zipped) + ')');
        })
      } else {
        report();
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

module.exports = build;