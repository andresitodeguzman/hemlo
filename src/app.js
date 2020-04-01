import * as hemlo from './hemlo/hemlo.js';

import * as notFoundObject from './views/not-found/index.js';

const theme = {
    color: '#4682b4'
};

const routes = [
    { path: '/404', view: '**', spec: notFoundObject } // not found
];

hemlo.app.name = "My Application";
hemlo.app.theme = theme;
hemlo.router.routes = routes;
hemlo.init();