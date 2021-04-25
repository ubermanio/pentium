#!/usr/bin/env node

import minimist from "minimist"
import inquirer from "inquirer"
import glob from "fast-glob"
import Fuse from "fuse.js"
import { join } from "path"
import { Script } from "src/types/script.type"
import slugify from "slugify"
// import { highlight } from "cli-highlight"
// import { Question } from "src/types/question.type"

inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"))

let scripts: Script[]

const main = async () => {
   scripts = (await glob(join(__dirname, "..", "..", "scripts/*")))
      .map((scriptFile) => require(scriptFile) as Script)
      .map((script) => ({ ...script, slug: slugify(script.name) } as Script))
      .sort((a, b) => a.name.localeCompare(b.name))

   const argv = minimist(process.argv.slice(2))

   const fuse = new Fuse(scripts, {
      includeScore: true,
      keys: ["name", "tags"],
   })

   const { Search: search } = await inquirer.prompt({
      type: "autocomplete",
      name: "Search",
      message: "Search for names or keywords of scripts",
      source: (_matches: string[], input: string) => {
         if (!input && !argv._[0]) return scripts
         return fuse
            .search(input || argv._[0] || "")
            .map((match) => match.item.name)
      },
   } as Omit<inquirer.QuestionCollection<any>, "type">)

   const script = scripts.find((script) => script.name === search)!

   // console.log(
   //    highlight(script.handler.toString(), {
   //       language: "JavaScript",
   //       theme: ''
   //    })
   // )

   const args: Record<string, any> = {}

   for (const question of script.questions) {
      let resolver = (obj: Record<string, unknown>) => {
         console.log(obj)
         return obj[Object.keys(obj)[0]]
      }

      const prompt: Record<string, unknown> = {
         name: question.title,
         default: question.default,
      }

      switch (question.type) {
         case "boolean":
            prompt.type = "confirm"
            // resolver = (arg: Record<string, boolean>) => arg[question.title]
            break
         case "checkbox":
            prompt.type = "checkbox"
            prompt.choices = question.choices!
            // resolver = (obj: Record<string, unknown>) =>
            //    obj[Object.keys(obj)[0]]
            break
         case "number":
            prompt.type = "number"
            // resolver = (obj: Record<string, unknown>) =>
            //    obj[Object.keys(obj)[0]]
            break
         default:
            prompt.type = "input"
            // resolver = (obj: Record<string, unknown>) =>
            //    obj[Object.keys(obj)[0]]
            break
      }

      args[question.name] = resolver(await inquirer.prompt(prompt))
      console.log("setting arg", question.name, "to", args[question.name])
   }

   try {
      await script.handler(args)
   } catch (error) {
      console.log(error.toString())
   }
}

main()
