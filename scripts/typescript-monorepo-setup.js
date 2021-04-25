const { createFile, createDir, install, hasYarn, PentiumError } = require("..")

module.exports = {
   name: "TypeScript monorepo setup",
   tags: ["typescript", "monorepo"],
   questions: [
      {
         title: "Features",
         type: "checkbox",
         name: "features",
         choices: [
            {
               name: "Node",
               checked: true,
            },
            {
               name: "React",
               checked: false,
            },
         ],
      },
      {
         title: "Set up testing",
         type: "boolean",
         name: "testing",
         default: true,
      },
      {
         title: "Packages directory",
         type: "input",
         name: "packagesDir",
         default: "packages",
      },
   ],
   templates: {
      package: (args) => ({
         private: true,
         workspaces: [`${args.packagesDir}/*`],
         scripts: {
            build: "wsrun --stages --report build",
            dev: "wsrun --skip-missing -c dev",
         },
      }),
      tsconfigBase: (args) => ({
         compilerOptions: {
            target: "ESNext",
            module: "CommonJS",
            moduleResolution: "node",
            lib: args.features.includes("React")
               ? ["ESNext", "DOM"]
               : ["ESNext"],
            sourceMap: true,
            removeComments: false,
            strict: true,
            noImplicitAny: true,
            noImplicitReturns: true,
            noImplicitThis: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            esModuleInterop: true,
            declaration: true,
            resolveJsonModule: true,
         },
      }),
   },
   handler: async function (args) {
      console.log(args)
      if (!(await hasYarn()))
         throw new PentiumError("Yarn is required for monorepos")
      await createFile("package.json", this.templates.package, args)
      await createFile("tsconfig.base.json", this.templates.tsconfigBase, args)
      await createDir(args.packagesDir)
      await install(["typescript", "wsrun"], { dev: true, flags: "-W" })
   },
}
