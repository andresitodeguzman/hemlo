export const  views = {
    get(elem) {
        return (document.getElementsByTagName('hemlo-app')).querySelector(elem);
    },
    getAll() {
        return (document.getElementsByTagName('hemlo-app')).querySelectorAll(elem);
    }
};

export const forms = {
    get(name) {
        return (document.querySelector(`input[name='${name}']`)).value;
    }
};

export const router = {
    navigate(view) {
        window.location.hash = `!/${view}`;
    },

    clear() {
        for (let h of document.getElementsByTagName('hemlo-view')) h.style.display = 'none';
    }
};

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