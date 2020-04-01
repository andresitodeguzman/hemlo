import { forms } from '../../hemlo/hemlo-utils.js';
export const view = "views/home/home.view.html";
export const controller = {
    a: 1,
    greetMe() {
        const first_name = forms.get('first_name');
        if(!first_name) {
            window.alert('Please input your name');
        } else {
            window.alert(`Hello, ${first_name}!`);
        }
    },
    inputKeyup(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.greetMe();
        }
    }
};
