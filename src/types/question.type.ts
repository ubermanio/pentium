export type Choice = {
   name: string
   checked?: boolean
}

export type Question = {
   title: string
   type: "boolean" | "checkbox" | "optionalGroup" | "number" | "input"
   name: string
   default?: unknown
   choices?: Choice[]
   questions?: Question[]
}
