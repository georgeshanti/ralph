const { Ralph } = require('./ralph.js')

const args = process.argv.slice(2);

const config = require(args[0])
ralph = new Ralph(config)

ralph.start();