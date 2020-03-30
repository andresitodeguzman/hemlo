class HemloView extends HTMLElement {
    constructor() {
        super();
    }
}

class HemloRouter extends HTMLElement {
    constructor() {
        super();
    }
}

export const init = () => {
    customElements.define('hemlo-router', HemloRouter);
    customElements.define('hemlo-view', HemloView);
    
    let style = document.createElement('style');
    style.appendChild(document.createTextNode('hemlo-router { display: block; } hemlo-view { display: block; }'));
    document.head.appendChild(style);

    router.init();

    window.addEventListener('hashchange', () => {
        router.handle();
    });


};

export const router = {
    routes:  [],
    
    init() {
        if(document.querySelector('hemlo-router')) {
            this.routes.forEach(r => {
                let spec = r.spec;
                if(spec){
                    
                    if(spec['controller'] !== false || undefined || null) {
                        window[r['view']] = spec['controller'] || {};
                    } else {
                        console.warn(`Router: [Error] '${r.view}' does not have a controller defined`);
                    }

                    if(spec['view']) {
                        fetch(`${spec.view}`).then(res => res.text()).then(ob => { 
                            let e = document.createElement('hemlo-view');
                            e.setAttribute('view', r.view);
                            e.innerHTML = ob;
                            document.querySelector(`hemlo-router`).appendChild(e);
                        })
                            .then(() => this.handle())
                            .catch(e => {
                                console.error(`Router: [Error] Failed in getting view of '${r.view}'`, e);
                            });
                    } else {
                        console.error(`Router: [Error] '${r.view}' does not have a view defined`);
                    }
                } else {
                    console.error(`Router: [Error] Cannot render '${r.view}', it does not have a spec object`);
                }
            });
        } else {
            console.error(`Router: [Error] <hemlo-router> is not declared`);
        }
    },

    handle () {
        this.clear();
        let route = document.location.hash.substr(2);
        if(route == '') {
            window.location.hash = '!/';
        } else {
            let r = this.routes.filter(o => {
                if(o.path === route) return o;
            });
            if(r.length !== 0) {
                let el = document.querySelector(`hemlo-view[view='${r[0]['view']}']`);
                if(el) this.fadeIn(el);
            } else {
                let el = document.querySelector(`hemlo-view[view='**']`);
                if(el) this.fadeIn(el);
            }
        }
    },

    navigate(view) {
        window.location.hash = `!/${view}`;
    },

    clear () {
        for (let h of document.getElementsByTagName('hemlo-view')) h.style.display = 'none';
    },

    fadeOut(el){
        el.style.opacity = 1;
    
        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
            } else {
            requestAnimationFrame(fade);
            }
        })();
    },

    fadeIn(el, display){
        el.style.opacity = 0;
        el.style.display = display || "block";
        
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
            }
        })();
    }

};