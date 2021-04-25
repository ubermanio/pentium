import shelljs from "shelljs"

export const shell = async (command: string) => {
   await shelljs.exec(command) // todo: solve color shit
}
