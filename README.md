# Vite React SSR with FeathersJS

This is a template for Vite React SSR with FeathersJS.

In this template, the Vite React SSR project is deployed to the FeathersJS project's `app`, with the client in `public`, and the server in `src/ssr/server.js`.

## Key Components in This Template

- Vite: The framework for frontend that handles compilation, bundling, and development server with hot reloading out of the box.
- React: The framework for frontend that handles UI.
- React Router: The framework for frontend that handles routing.
- FeathersJS: The framework for backend that handles API and database.

## Try It Out

### Build Vite React SSR Project

```bash
cd vite-project
npm install && npm run build
```

This will deploy the Vite React SSR project to the FeathersJS project's `app`, with the client in `public`, and the server in `src/ssr/server`.

### Run FeathersJS Project

```bash
cd app
npm install && npm run dev
```

You will have a FeathersJS project running on `localhost:3030`.

The index page is rendered by Vite React SSR. Navigate to `/about` to see the page rendered by React Router's BrowserRouter. If you load the index page by requesting the HTML file from the server, and then navigate to `/about`, you will see the page rendered entirely client-side in your browser by React Router's BrowserRouter. This is the way of React SSR and Hydration.

## How is This Template Created

### Create Vite React SSR Project

1. Create a Vite React project according to [Vite's documentation](https://vitejs.dev/guide/) with the TypeScript template.
2. Configure Vite to support SSR according to [Vite's documentation](https://vitejs.dev/guide/ssr.html) and [Vite's official example](https://github.com/vitejs/vite-plugin-react/tree/main/playground/ssr-react).
3. Add [react-router-dom](https://reactrouter.com/en/main) to the project to build the project for [browser routing](https://reactrouter.com/en/main/routers/create-browser-router) and [server static routing](https://reactrouter.com/en/main/routers/create-static-router):
   1. [routes.ts](/vite-project/src/routes.ts): Define routes for browser routing and server static routing.
   2. [client.tsx](/vite-project/src/client.tsx): 
      1. Entry for browser routing. 
      2. To use it for hydration, point the script to this tsx file by adding `<script type="module" src="/src/client.tsx"></script>` to the template HTML file.
   3. [server.tsx](/vite-project/src/server.tsx): 
      1. Entry for server static routing that exports a `renderHtml` function to render the app HTML.
      2. Add `<!--app-html-->` inside the template HTML's `root` div as a placeholder for the app HTML. It will be replaced by the app HTML during server-side rendering.
   4. [index.html](/vite-project/index.html): The template HTML file for both browser routing and server static routing.
4. Enable SSR in [vite.config.ts](/vite-project/vite.config.ts), and set external dependencies for SSR:
    ```diff
    export default defineConfig({
      plugins: [react()],
    +  ssr: {
    +    noExternal: ['react-router-dom','node']
    +  },
    })
    ```
5. Build the project for server-side assets by modifying the `build:client` script to output to the FeathersJS app's `public` folder:
    ```diff
    "scripts": {
    -  "build:client": "vite build",
    +  "build:client": "vite build --outDir ../app/public",
    }
    ```
6. Build the project for server-side rendering by modifying the `build:server` script to output the `renderHtml` function to the FeathersJS app's `src/ssr/` folder (`src/ssr/server.js`):
    ```diff
    "scripts": {
    -  "build:server": "vite build --ssr src/server.tsx",
    +  "build:server": "vite build --ssr src/server.tsx --outDir ../app/src/ssr",
    }
    ```
Now, the Vite React SSR project is fully set up.

### Create a FeathersJS Project

1. Create a [FeathersJS project](https://feathersjs.com/guides/basics/starting.html) with the TypeScript template.
   1. Install FeathersJS CLI: `npm create feathers@latest <Project Name>`
   2. My options: Express, No schema, and Another database.
2. Install `react` and `react router` to the project:
    ```bash
    npm install react react-dom react-router-dom
    npm install -D @types/react @types/react-dom
    ```
3. To enable `ESM` support in a TypeScript FeathersJS project, please DO NOT add `"type": "module"` in your package.json. Instead, tweak the `compilerOptions` in your `tsconfig.json` by setting `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`:
    ```json5
    {
      "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "allowJs": true // enable JavaScript files to be compiled
      }
    }
    ```
4. Mount middleware to handle SSR before serving public statics in [app.ts](/app/src/app.ts):
    ```ts
    import * as ssr from './ssr/server.js'
    const template = fs.readFileSync(path.resolve('public/index.html'), 'utf-8');

    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const url = req.originalUrl;
        const appHtml = await ssr.renderHtml(url);
        if (appHtml === undefined) {
          return next();
        }
        const html = template.replace(`<!--app-html-->`, appHtml);
        return res.send(html);
      } catch (err) {
        console.error(err);
        return next();
      }
    })
    ```

## Simple Express App Example

In the server folder, there is an even simpler Express app example of SSR with Vite React SSR.
