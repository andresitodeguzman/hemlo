import * as hemlo from './hemlo/hemlo.js';

import * as homeObject from './views/home/index.js';
import * as notFoundObject from './views/not-found/index.js';
import * as aboutUsObject from './views/about-us/index.js';

const theme = {
    color: '#4682b4'
};

const routes = [
    { path: '/', view: 'home', spec: homeObject },
    { path: '/about-us', view: 'about-us', spec: aboutUsObject },
    { path: '/404', view: '**', spec: notFoundObject } // not found
];

hemlo.app.name = "My Application";
hemlo.app.theme = theme;
hemlo.router.routes = routes;
hemlo.init();