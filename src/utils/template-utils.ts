export const replaceVariables = async (
   template: string,
   variables?: Record<string, string>
): Promise<string> => {
   if (variables)
      Object.keys(variables).forEach(
         (variableName) =>
            (template = template.replace(
               new RegExp(`{{\\s*${variableName}\\s*}}`, "g"),
               variables[variableName]
            ))
      )

   return template
}
