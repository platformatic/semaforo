import semver from 'semver'
import commist from 'commist'
import helpMe from 'help-me'
import { join } from 'desm'
import { setFlag, unsetFlag, view, clean, list } from './src/flags.mjs'

const currentVersion = process.versions.node
const minimumVersion = 'v18.11.0'

if (semver.lt(currentVersion, minimumVersion)) {
  console.error(`Node.js v${currentVersion} unsupported!`)
  console.error(`Please use Node.js ${minimumVersion} or higher.`)
  process.exit(1)
}

const help = helpMe({
  dir: join(import.meta.url, 'help'),
  ext: '.txt'
})

const program = commist({ maxDistance: 2 })
program.register('help', help.toStdout)
program.register('set', setFlag)
program.register('unset', unsetFlag)
program.register('view', view)
program.register('clean', clean)
program.register('list', list)

await program.parseAsync((process.argv.splice(2)))
