import * as hemlo from './hemlo/hemlo.js';

import * as homeObject from './component/home/index.js';
import * as notFoundObject from './component/not-found/index.js';

const routes = [
    { path: '/', view: 'home', spec: homeObject },
    { path: '/404', view: '**', spec: notFoundObject } // not found
];

hemlo.router.routes = routes;
hemlo.init();