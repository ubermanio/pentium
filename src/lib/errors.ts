import chalk from "chalk"

export class PentiumBaseError extends Error {
   constructor(
      message: string,
      public name: string,
      private colorFunc: Function
   ) {
      super(message)
   }

   toString(): string {
      return `${this.prefix} ${chalk.white(this.message)}`
   }

   get prefix(): string {
      return this.colorFunc(` ${this.name}:`)
   }
}

export class PentiumError extends PentiumBaseError {
   constructor(message: string) {
      super(message, "Error", chalk.bgRedBright.white.bold)
   }
}

export class PentiumWarning extends PentiumBaseError {
   constructor(message: string) {
      super(message, "Warning", chalk.magenta.bold)
   }
}
