# Vite React SSR with FeathersJS

This is a template for Vite React SSR with FeathersJS.

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

This will deploy the Vite React SSR project to the feathers project `app`, client in `public`, server in `src/ssr/server`.

### Run FeathersJS Project

```bash
cd app
npm install && npm run dev
```

You will have a FeathersJS project running on `localhost:3030`.

The index page is rendered by Vite React SSR, and you can navigate to `/about` to see the page rendered by React Router's BrowserRouter.