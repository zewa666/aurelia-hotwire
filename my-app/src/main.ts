import Aurelia from 'aurelia';

import { MyApp } from './my-app';
import { MyMessage } from './my-message';

Aurelia
  .register(MyMessage)
  .app(MyApp)
  .start();
