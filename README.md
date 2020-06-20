# Hemlo
A mini-framework for creating web driven apps.

## Getting started
Create a javascript file which will serve as the entrypoint of the application. Typically we'll use `app.js`. In the file, add the following.

```javascript
// Import the hemlo js module
import * as hemlo from './hemlo/hemlo.js';

// Create an object to specify theme
const theme = { color: '#4682b4' };

// Specify the name of the application
const appName = "My Application";

// Create an object for the routes
const routes = [];

// Set the values
hemlo.app.name = appName;
hemlo.app.theme = theme;
hemlo.router.routes = routes;

// Initialize Hemlo JS
hemlo.init();
```

Finally create an index.html file with the following contents.

```html
<!doctype html>
<html>
    <head>
        <title>Loading...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- set this to prevent showing unfinished page render -->
        <style>body { display: none }</style>
    </head>
    <body>
        <!-- The main part of the app -->
        <hemlo-app>
            <hemlo-bar></hemlo-bar>
            <hemlo-router></hemlo-router>
        </hemlo-app>
    </body>
</html>
<!-- Import the entrypoint script as module -->
<script type="module" src="./app.js"></script>
```

## Views and Routing
To create views, you must create a spec file where the meta-data of the views are contained. For example we'll create the not-found page.

First, create a `views` folder and inside create a `not-found` folder. Once done, create an `index.js` and `notfound.view.html` files inside the folder.

The index.js should contain the following:

```javascript
// Defines the html file containing the view of the page/activity
export const view = "views/not-found/notfound.view.html";

// The controller to which we'll add the interactivity.
export const controller = {
    // Triggered when the page is shown
    onInit() {

    },

    // Triggered on load of the entire page (once the views are loaded)
    onCreate() {

    }
};
```

Next is add a content to the html file you just created.

```html
<style>
    .not-found-container {
        margin-left: 5%;
        margin-right: 5%;
    }
</style>

<div class="not-found-container">
    <h4>Page Not Found</h4>
    <p>The Page you were looking for was not found.</p>
</div>
```

Once done, import that into the `app.js` file.
```javascript
// Import the hemlo js module
import * as hemlo from './hemlo/hemlo.js';

import * as notFoundObject from './views/not-found/index.js';

// Create an object for the routes
const routes = [
    // Add the route here
    { path: "/404", view: "**", spec: notFoundObject }
];

// Set the values
hemlo.router.routes = routes;

// Initialize Hemlo JS
hemlo.init();
```

And there! You have added the first view.

Now we'll set-up a basic home view. For that we'll repeat the creation of the folder inside `views` and we'll name it `home` with the same `index.js` and `home.view.html` files.

In the `home.view.html` let's try to add the following:

```html
<style scoped>
    .home.container {
        margin-left: 5%;
        margin-right: 5%;
    }
</style>

<div class="home container">
    <h4>Welcome!</h4>
    <p>
        What is your name?<br>
        <input type="text" name="first_name"><br>
        <button onclick="greetMe();">Greet Me!</button>
    </p>
</div>
```

And in the `index.js`

```javascript
import { form } from '../../hemlo/hemlo-utils.js';

export const view = "views/home/home.view.html";

export const controller = {
    onInit() {},

    onCreate() {},

    greetMe() {
        const first_name = form.get('first_name');
        if(!first_name) {
            window.alert('Please input your name');
        } else {
            window.alert(`Hello, ${first_name}!`);
        }
    }
};
```

Let's add this to the `app.js` file

```javascript
import * as homeObject from './views/home/index.js';

const routes = [
    // Add the route here
    { path: "/", view:"home", spec: homeObject },
    { path: "/404", view:"**", spec: notFoundObject }
];

```

As for styling, you can add a `scoped` attribute to the `style` tag when you want to have the style applied only to the view.

As you can see we have imported `hemlo-utils.js` in our `index.js` script. Hemlo utils contains the basic view manipulation methods we can use to make our app interactive. In this example we used `form.get()` to get the data from the text input.

We can access the methods of our controller globally by using the 'view' name we have declared on our router. In this case it's `home`. But in complicated cases, like a two-word view, we need to use a dash to separate them, for example:

```javascript
{ path: "/about-me", view: "about-me", spec: aboutMeComponent }
```
```javascript
export const controller = {
    handleClick() {
        alert('Clicked');
    }
};
```

In order for me to access handleClick() in any view, I will convert the `view` name into camel case, of which in this example is `aboutMe`. Here's the example in the html.

```html
<button onclick="aboutMe.handleClick()">Click Me!</button>
```

### Navigation
In order to navigate through views, you can use the provided `router.navigate()` method of Hemlo utils if you're navigating through a method. Also, you can simply use the traditional href in anchor tags, ex: `<a href="#!/sample-page">Sample Page</a>`. Just always remember to add a `#!` when using href.

