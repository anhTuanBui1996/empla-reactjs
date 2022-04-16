This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Prequisite

### Change some infomation of the app arcording to your option

The default Applicaton name is `empla`, you can change it in `package.json` and `package-lock.json` (search the text "name" and change the value)<br />
The Application icon is the `favicon.ico`, you can change it with other icon (format must be `.ico`)
There an image file use for `apple-touch`, you can store an image with name `logo192.png` and store in public directory, we do not use the apple-touch icon by default.

### .env: private app and data info

This store all private key and some sensity data for the app.<br />
See [dotenv](https://www.npmjs.com/package/dotenv) for more information.<br />
The infomation must provide in .env file:

> REACT_APP_AIRTABLE_BASE_ID (your `Airtable` base ID)<br />
> REACT_APP_AIRTABLE_API_KEY (your `Airtable` api key)<br />
> REACT_APP_FILESTACK_API_KEY (your `Filestack` api key)<br />
> REACT_APP_GOOGLE_MAP_API_KEY (your `Google Map Javascript API` api key)

Read more: [Airtable](https://www.airtable.com/), [Filestack](https://www.filestack.com/), [Google Map Javascript](https://developers.google.com/maps/documentation/javascript/overview)

### Firebase Hosting

This application use Firebase Hosting for deployment, you have to create a project an an Web-app for
that one. Then go to `Project Settings`, scroll to Your apps section, in the `SDK setup and configuration`, copy the firebaseConfig code file and paste it in the `firebase.js` file. Store the file in `src` folder. [Read more](https://firebase.google.com/docs/hosting)

## Available Scripts

In the project directory, you can run (in the CLI):

### `npm install`

Install all the package used to run this app.
Open `package.json` to see the pakage list is going to install.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `firebase init`

Initialization for Firebase Hosting, some inportant step during processing:

> Set this app as Single-Page Application (SPA)<br />
> Only using Firebase Hosting<br />
> Do not re-write the index.html<br />
> Use the `build` directory for deployment

### `firebase deploy`

Can be used after initialize firebase and activate theh Firebase Hosting on the [console](https://console.firebase.google.com/). Must run `npm run build` first to build a optimize build before deloyment.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
