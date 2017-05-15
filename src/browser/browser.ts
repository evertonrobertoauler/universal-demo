import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import './styles.scss';

import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
const { AppModuleNgFactory } = require('../app/app.module.ngfactory');

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);

