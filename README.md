# Thomann co-ordering app Aurelia frontend
This web application allows you to order from Thomann to Estonia cheaper. It combines the orders of many user into one, allowing to save on delivery fees (To be more precise, starting from orders over 298 euros, the delivery is free, otherwise it's 20 euros)
 > The future plan would be to rewrite the app in Firebase and React, to take a break from the C# madness and relational database paradigms. And of course, also, to learn new technologies 🤼

Check out the deployed version [here](https://thorder-aurelia-client.vercel.app/#/). Or click the link on the right.

The back-end API is written in C# (ASP NET core) and the Docker image is deployed on Azure.

---

This project is bootstrapped by [aurelia-cli](https://github.com/aurelia/cli).

For more information, go to https://aurelia.io/docs/cli/webpack

## Run dev app locally

Clone the repository.

Run `npm install`, `au run` (alias for `npm start`), then open `http://localhost:8080`.

You can change the standard webpack configurations from CLI easily with something like this: `npm start -- --open --port 8888`. However, it is better to change the respective npm scripts or `webpack.config.js` with these options, as per your need.

To enable Webpack Bundle Analyzer, do `npm run analyze` (production build).

To enable hot module reload, do `npm start -- --hmr`.

To change dev server port, do `npm start -- --port 8888`.

To change dev server host, do `npm start -- --host 127.0.0.1`

**PS:** You could mix all the flags as well, `npm start -- --host 127.0.0.1 --port 7070 --open --hmr`

For long time aurelia-cli user, you can still use `au run` with those arguments like `au run --env prod --open --hmr`. But `au run` now simply executes `npm start` command.

## Build for production

Run `npm run build`, or the old way `au build --env prod`.

## Unit tests

Run `au test` (or `au jest`).

To run in watch mode, `au test --watch` or `au jest --watch`.
