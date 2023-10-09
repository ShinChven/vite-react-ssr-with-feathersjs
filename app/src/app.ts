// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import configuration from '@feathersjs/configuration'
import express, {
  cors,
  errorHandler,
  json,
  notFound,
  rest,
  serveStatic,
  urlencoded
} from '@feathersjs/express'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio'

import type { Application } from './declarations'

import { NextFunction, Request, Response } from 'express'
import * as ssr from './ssr/server.js'
import { channels } from './channels'
import { logError } from './hooks/log-error'
import { logger } from './logger'
import { services } from './services/index'

import fs from 'fs'
import path from 'path'

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration())
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

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

// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
