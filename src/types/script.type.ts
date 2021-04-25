import { Question } from "./question.type"

export type Args = Record<string, unknown>
export type TemplateFunction = (args?: Args) => Record<string, unknown> | string

export type Script = {
   name: string
   slug?: string
   description?: string
   tags: string[]
   questions: Question[]
   // fileTemplates?: Record<string, string>
   templates?: Record<
      string,
      TemplateFunction | string | Record<string, unknown>
   >
   handler: (args: Args) => void
}
