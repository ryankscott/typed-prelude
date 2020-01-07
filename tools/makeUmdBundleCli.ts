import { isAbsolute, join } from 'path'
import yargs from 'yargs'
import { makeUmdBundle } from './makeUmdBundle'

const options = yargs
  .option('directory', {
    alias: 'd',
    demandOption: true,
    describe: 'Root Directory of bundled package. Used to find package.json & tsconfig.json',
    type: 'string',
  })
  .option('external', {
    alias: 'e',
    type: 'array',
    describe: 'External Packages to exclude. Perfect for peer deps',
  })
  .option('commonJs', {
    describe: 'Configure how commonjs lookups a performed',
    type: 'string',
  }).argv

const cwd = process.cwd()
const directory = isAbsolute(options.directory) ? options.directory : join(cwd, options.directory)

process.chdir(directory)

makeUmdBundle({
  directory,
  entry: options._[0],
  external: options.external ? options.external.map(x => x.toString()) : void 0,
  commonJs: options.commonJs ? JSON.parse(options.commonJs) : void 0,
}).catch(error => {
  console.error(error)

  process.exit(1)
})
