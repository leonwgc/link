const path = require('path');
const buble = require('rollup-plugin-buble');
const cleanup = require('rollup-plugin-cleanup');
const version = require('../package.json').version;

const banner =
  '/*!\n' +
  ' * link.js v' + version + '\n' +
  ' * (c) 2016.10-' + new Date().getFullYear() + ' leonwgc\n' +
  ' * Released under the MIT License.\n' +
  ' */';

const configs = {
  'link.lib': {
    entry: path.resolve(__dirname, '../src/modules/link.js'),
    dest: path.resolve(__dirname, '../lib/link.js'),
    format: 'umd',
    header: banner,
    env: 'prod'
  },
  'link.lib.min': {
    entry: path.resolve(__dirname, '../src/modules/link.js'),
    dest: path.resolve(__dirname, '../lib/link.min.js'),
    format: 'umd',
    header: banner,
    env: 'prod'
  },
  'link.dev': {
    entry: path.resolve(__dirname, '../src/modules/link.js'),
    dest: path.resolve(__dirname, '../dist/link.js'),
    format: 'umd',
    header: banner,
    env: 'dev'
  }
};

function getConfig(opts) {
  const config = {
    entry: opts.entry,
    dest: opts.dest,
    external: opts.external,
    format: opts.format,
    banner: opts.header,
    moduleName: 'link',
    plugins: [
      buble(),
      cleanup()
    ]
  }
  return config;
}

module.exports = (env) => Object.keys(configs).filter(key => configs[key].env === env).map(key => getConfig(configs[key]));