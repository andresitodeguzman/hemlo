export const forms = {
    get(name) {
        return (document.querySelector(`input[name='${name}']`)).value;
    }
};