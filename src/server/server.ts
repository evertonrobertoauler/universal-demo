import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import * as express from 'express';

enableProdMode();

const { AppServerModuleNgFactory } = require('../app/app.server.module.ngfactory');

const PORT = 4000;
const HOST = `http://localhost:${PORT}`
const PUBLIC_PATH = join(process.cwd(), 'dist', 'public');
const TEMPLATE_PATH = join(PUBLIC_PATH, 'index.html');

async function startServer() {

  if (!existsSync(TEMPLATE_PATH)) return;

  const app = express();

  const template = readFileSync(TEMPLATE_PATH).toString();

  app.get('*.*', express.static(PUBLIC_PATH));

  app.get('*', (req, res) => {
    const opts = { document: template, url: req.url };

    renderModuleFactory(AppServerModuleNgFactory, opts)
      .then(html => res.send(html));
  });

  return new Promise(resolve => app.listen(PORT, resolve));
};

startServer().then(() => console.log(`Listening on ${HOST}`));
