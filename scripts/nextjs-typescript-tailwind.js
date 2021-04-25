const { shell, install, addScript, createFile, createDir } = require("..")

module.exports = {
   name: "NextJS TypeScript TailwindCSS Setup",
   tags: ["react", "next", "typescript", " tailwind"],
   questions: [
      {
         title: "Use atomic design",
         type: "boolean",
         name: "atomicDesign",
         default: false,
      },
   ],
   templates: {
      tailwindConfig: () => ({
         purge: ["pages/**/*.tsx", "components/**/*.tsx"],
         darkMode: false,
         theme: {},
         variants: {
            extend: {},
         },
         plugins: [],
      }),
      postcssConfig: () => ({
         plugins: {
            tailwindcss: {},
            autoprefixer: {},
         },
      }),
      tailwindCss: `
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
      exampleIndex: `const Home = () => <div className='bg-red-400 text-white p-10'>hi</div>

export default Home`,
      example_App: `import { AppProps } from 'next/app'

import '../tailwind.css'

const _App = ({ Component, pageProps }: AppProps) => {
   return (
      <Component {...pageProps} />
   )
}

export default _App
`,
   },
   handler: async function (args) {
      await install([
         "react",
         "react-dom",
         "next",
         "postcss",
         "autoprefixer",
         "tailwindcss",
      ])
      await install(["@types/react", "typescript"], { dev: true })
      await addScript("dev", "next dev")
      await addScript("build", "next build")
      await addScript("start", "next start")
      await createFile("tailwind.config.js", this.templates.tailwindConfig)
      await createFile("postcss.config.js", this.templates.postcssConfig)
      await createFile("tailwind.css", this.templates.tailwindCss)
      await createDir("pages")
      await createDir("components")
      if (args.atomDesign) {
         await createDir("components/atoms")
         await createDir("components/molecules")
         await createDir("components/organisms")
      }
      await createFile("pages/_app.tsx", this.templates.example_App)
      await createFile("pages/index.tsx", this.templates.exampleIndex)
   },
}
