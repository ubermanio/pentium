import fs from "fs/promises"
import { existsSync } from "fs"
import { join } from "path"
import { PentiumError } from "../lib/errors"
import { TemplateFunction, Args } from "src/types/script.type"

export const createFile = async (
   filename: string,
   content: string | TemplateFunction,
   args: Args
): Promise<void> => {
   const path = join(process.cwd(), filename)
   if (await existsSync(path))
      throw new PentiumError(`${filename} already existing`)

   let string: string

   if (typeof content === "function") {
      string = JSON.stringify(content(args), null, 4)
      if (filename.endsWith(".js") && !string.startsWith("module.exports")) {
         string = `module.exports = ${string}`
      }
   } else {
      string = content
   }
   await fs.writeFile(path, string)
}

export const createDir = async (path: string) => {
   await fs.mkdir(join(process.cwd(), path), { recursive: true })
}
