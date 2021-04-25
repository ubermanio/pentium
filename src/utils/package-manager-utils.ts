import shelljs from 'shelljs'
import { shell } from './shell-utils'
import fs from 'fs/promises'
import { join } from 'path'

export const hasYarn = async (): Promise<boolean> => {
   return !!shelljs.which('yarn')
}

export const install = async (
   packages: string[],
   options?: { dev: boolean; flags: string }
) => {
   options = Object.assign({ dev: false, flags: '' }, options)
   if (await hasYarn())
      return shell(
         `yarn add ${options.dev ? '-D' : ''} ${packages.join(' ')} ${
            options.flags || ''
         }`
      )
   else
      return shell(
         `npm install ${options.dev ? '--save-dev' : ''} ${packages.join(
            ' '
         )} ${options.flags || ''}`
      )
}

export const addScript = async (name: string, command: string) => {
   const path = join(process.cwd(), 'package.json')
   const packageJson = require(path)
   if (!packageJson.scripts) packageJson.scripts = {}
   packageJson.scripts[name] = command
   await fs.writeFile(path, JSON.stringify(packageJson, null, 4), 'utf8')
}

export const runScript = async (name: string) => {
   if (await hasYarn()) return shell(`yarn ${name}`)
   else return shell(`npm run ${name}`)
}
