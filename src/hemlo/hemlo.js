import { parseCSS } from './css-parser.js';
class HemloApp extends HTMLElement { constructor() { super(); } }
class HemloRouter extends HTMLElement { constructor() { super(); } }
class HemloView extends HTMLElement { constructor() { super(); } }
class HemloBar extends HTMLElement { constructor() { super(); } }


let viewStyle = `hemlo-view { display:none; }`;
let barStyle = ` hemlo-bar { display: block; width: 100%; background-color: steelblue; position: fixed; top: 0; min-height: 65px; color: white; padding-left: 5%; padding-right: 5%; box-shadow: 0px 7px 10px 3px rgba(181,181,181,1); }
@media (prefers-color-scheme: dark) { hemlo-bar { background-color: #1e2c3a; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; } }`;

export const init = () => {

    const hemloElements = [
        { name: 'hemlo-app', constructor: HemloApp },
        { name: 'hemlo-router', constructor: HemloRouter },
        { name: 'hemlo-view', constructor: HemloView, style: viewStyle },
        { name: 'hemlo-bar', constructor: HemloBar, style: barStyle }
    ];

    // Create style elem in head
    let hemloStyle = document.createElement('style');
    hemloStyle.id = "hemlo-root-styles";
    hemloStyle.appendChild(document.createTextNode(`:root { font-family: Arial, Helvetica, sans-serif; }\nbody { display: block; margin: 0; padding: 0; }\n@media (prefers-color-scheme: dark) { body { background-color: #3f4a57; color: white; } a { color: white; } }`));
    document.head.appendChild(hemloStyle);

    hemloElements.forEach(elem => {
        try {
            customElements.define(elem.name, elem.constructor);
            if(!elem.style) { hemloStyle.appendChild(document.createTextNode(`${elem.name} { display: block; }`)); }
            else { hemloStyle.appendChild(document.createTextNode(`${elem.style}`)); }
        } catch(e) {
            console.error(`Root: [Error] Failed in registering <${elem.name}> as a Custom Element`);
        }
    });


    app.init();
    router.init();

    window.addEventListener('hashchange', () => {
        router.handle();
    });

    window.hemlo = {
        app, effects, router
    };

};

export const app = {
    name: null,
    theme: {
        name: null,
        color: null
    },
    init() {
        this.setAppName(this.name || 'Hemlo Application');
        this.setThemeColor(this.theme.color || 'black');
    },
    setThemeColor(color) {
        if (app.theme.color !== color) app.theme.color = color;
        let dtm = document.head.querySelector(`meta[name='theme-color']`);
        if (dtm !== null) {
            dtm.setAttribute('content', color || 'black');
        } else {
            let tc = document.createElement('meta');
            tc.name = 'theme-color';
            tc.content = color || '';
            document.head.appendChild(tc);
        }
        return true;
    },

    setAppName(name) {
        (document.head.querySelector('title')).innerText = name;
        this.name = name;
        return true;
    },

    bar: {
        show() {
            (document.querySelector(`hemlo-bar`)).style.display = 'block';
            return true;
        },
        hide() {
            (document.querySelector(`hemlo-bar`)).style.display = 'none';
            return true;
        },
        fadeIn() {
            effects.fadeIn(document.querySelector(`hemlo-bar`));
        },
        fadeOut() {
            effects.fadeOut(document.querySelector(`hemlo-bar`));
        },
        toggle() {
            let el = document.querySelector(`hemlo-bar`);
            if(el.style.display == 'none') {
                this.show();
            } else {
                this.hide();
            }
        },
        toggleFade() {
            let el = document.querySelector(`hemlo-bar`);
            if(el.style.display == 'none') {
                this.fadeIn();
            } else {
                this.fadeOut();
            }
        }

    }
}

export const effects = {
    hide(el) {
        el.style.display = 'none';
    },

    show(el, display) {
        el.style.display = display || 'block';
    },

    fadeOut(el) {
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    },

    fadeIn(el, display) {
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

export const router = {
    routes: [],

    init() {

        const elementDriller = (className, parent) => {
            return parent.childNodes.forEach(child => {
                if(child instanceof HTMLElement) {
                    if(child.tagName !== 'STYLE') {
                        child.classList.add(className);
                        elementDriller(className, child);    
                    }
                }
            });
        };

        const eventAppend = (className, element) => {
            if(element instanceof HTMLElement) {
                Object.keys(element.attributes).forEach(key => {
                    const attrb = element.attributes[key].nodeName;
                    if(attrb.substr(0,2) == 'on') {
                        let list = (element.attributes[key].nodeValue.replace('; ', ';')).split(';');
                        var ks = ["postMessage(","blur(","focus(","close(","frames(","self(","window(","parent(","opener(","top(","length(","closed(","location(","document(","origin(","name(","history(","locationbar(","menubar(","personalbar(","scrollbars(","statusbar(","toolbar(","status(","frameElement(","navigator(","customElements(","external(","screen(","innerWidth(","innerHeight(","scrollX(","pageXOffset(","scrollY(","pageYOffset(","screenX(","screenY(","outerWidth(","outerHeight(","devicePixelRatio(","clientInformation(","screenLeft(","screenTop(","defaultStatus(","defaultstatus(","styleMedia(","onanimationend(","onanimationiteration(","onanimationstart(","onsearch(","ontransitionend(","onwebkitanimationend(","onwebkitanimationiteration(","onwebkitanimationstart(","onwebkittransitionend(","isSecureContext(","onabort(","onblur(","oncancel(","oncanplay(","oncanplaythrough(","onchange(","onclick(","onclose(","oncontextmenu(","oncuechange(","ondblclick(","ondrag(","ondragend(","ondragenter(","ondragleave(","ondragover(","ondragstart(","ondrop(","ondurationchange(","onemptied(","onended(","onerror(","onfocus(","oninput(","oninvalid(","onkeydown(","onkeypress(","onkeyup(","onload(","onloadeddata(","onloadedmetadata(","onloadstart(","onmousedown(","onmouseenter(","onmouseleave(","onmousemove(","onmouseout(","onmouseover(","onmouseup(","onmousewheel(","onpause(","onplay(","onplaying(","onprogress(","onratechange(","onreset(","onresize(","onscroll(","onseeked(","onseeking(","onselect(","onstalled(","onsubmit(","onsuspend(","ontimeupdate(","ontoggle(","onvolumechange(","onwaiting(","onwheel(","onauxclick(","ongotpointercapture(","onlostpointercapture(","onpointerdown(","onpointermove(","onpointerup(","onpointercancel(","onpointerover(","onpointerout(","onpointerenter(","onpointerleave(","onafterprint(","onbeforeprint(","onbeforeunload(","onhashchange(","onlanguagechange(","onmessage(","onmessageerror(","onoffline(","ononline(","onpagehide(","onpageshow(","onpopstate(","onrejectionhandled(","onstorage(","onunhandledrejection(","onunload(","performance(","stop(","open(","alert(","confirm(","prompt(","print(","requestAnimationFrame(","cancelAnimationFrame(","requestIdleCallback(","cancelIdleCallback(","captureEvents(","releaseEvents(","getComputedStyle(","matchMedia(","moveTo(","moveBy(","resizeTo(","resizeBy(","getSelection(","find(","webkitRequestAnimationFrame(","webkitCancelAnimationFrame(","fetch(","btoa(","atob(","setTimeout(","clearTimeout(","setInterval(","clearInterval(","createImageBitmap(","scroll(","scrollTo(","scrollBy(","onappinstalled(","onbeforeinstallprompt(","crypto(","ondevicemotion(","ondeviceorientation(","ondeviceorientationabsolute(","indexedDB(","webkitStorageInfo(","sessionStorage(","localStorage(","chrome(","visualViewport(","speechSynthesis(","webkitRequestFileSystem(","webkitResolveLocalFileSystemURL(","addEventListener(", "removeEventListener(", "openDatabase(", "dispatchEvent("]
                        list = list.map(i => {
                            if(i !== '') {
                                const w = i.split('.');
                                if(ks.indexOf(w[0]) == -1) {
                                    return i = `${className}.${i}`;
                                }
                            }                            
                        });
                        element.setAttribute(attrb, list.join('; '));
                    }
                });
            }
        };

        const driller = (className, func, parent) => {
            if(parent instanceof HTMLElement) {
                parent.childNodes.forEach(child => {
                    func(className, child);
                    driller(className, func, child);
                });
            }
        };

        if (document.querySelector('hemlo-router')) {
            this.routes.forEach(r => {
                let spec = r.spec;
                if (spec) {
                    if (spec['view']) {
                        fetch(`${spec.view}`).then(res => res.text()).then(ob => {
                                let e = document.createElement('hemlo-view');
                                e.setAttribute('view', r.view);
                                e.innerHTML = ob;
                                const style = e.querySelector('style');
                                if(style) {
                                    if(style.getAttribute('scoped') !== null) {
                                        const styleRaw = parseCSS(style.innerHTML);
                                        style.remove();
                                        const newStyle = document.createElement('style');
                                        styleRaw.forEach(o => {
                                            const ruleArray = [];
                                            o.rules.forEach(r => ruleArray.push(`${r.key}: ${r.value}`));
                                            if(o.selector[0] == '.' || o.selector[0] == '#') {
                                                newStyle.innerHTML += `.${r.view}${o.selector} { ${ruleArray.join('; ')} }`;                                        
                                            } else {
                                                newStyle.innerHTML += `${o.selector} { ${ruleArray.join('; ')} }`;
                                            }
                                        });
                                        e.prepend(newStyle);    
                                    }
                                }
                                if(r.view !== '**') {
                                    elementDriller(r.view, e);
                                    driller(r.view, eventAppend, e);
                                }
                                document.querySelector(`hemlo-router`).appendChild(e);
                            })
                            .then(() => {
                                this.handle();
                                if (spec['controller'] !== false || undefined || null) {
                                    if(typeof spec['controller']['onCreate'] === 'function') {
                                        spec['controller']['onCreate']();
                                    }
                                    window[r['view'].replace(/-([a-z])/g, function (g) {
                                        return g[1].toUpperCase();
                                    })] = spec['controller'] || {};
                                } else {
                                    console.warn(`Router: [Error] '${r.view}' does not have a controller defined`);
                                }
                            })
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

    handle() {
        this.clear();
        let route = document.location.hash.substr(2);
        if(route == '') {
            window.location.replace('#!/');
        } else {
            let r = this.routes.filter(o => {
                if (o.path === route) return o;
            });
            if (r.length !== 0) {
                let el = document.querySelector(`hemlo-view[view='${r[0]['view']}']`);
                if (el){  effects.fadeIn(el); }                
                if (r[0]['spec']['controller'] !== false || undefined || null) {
                    if(typeof r[0]['spec']['controller']['onInit'] === 'function') {
                        r[0]['spec']['controller']['onInit']();
                    }
                }
            } else {
                console.log(r);
                let el = document.querySelector(`hemlo-view[view='**']`);
                if (el) effects.fadeIn(el);
            }
    
        }
    },

    navigate(view) {
        window.location.hash = `!/${view}`;
    },

    clear() {
        for (let h of document.getElementsByTagName('hemlo-view')) h.style.display = 'none';
    },

};