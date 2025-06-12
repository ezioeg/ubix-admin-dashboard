## 🛠️ Ubix Admin Dashboard  
Web application for administrators to manage general information, products, orders, and payments of affiliated restaurants. Designed to simplify administration and optimize service management.

### Features  
- **Product Management**: Add, edit, and delete products for affiliated restaurants.  
- **Order Management**: View and manage customer orders.  
- **Payment Management**: Oversee transactions and payments for restaurants.  
- **Web Notifications**: Receive real-time notifications of important events.  
- **PWA Installation**: Supports installation as a Progressive Web App for easy access.

## Technologies Used
### Core
- [React](https://www.npmjs.com/package/react) `v16.13`  
- [React Router](https://www.npmjs.com/package/react-router) `v6 (alpha)`  

### UI / Styling
- [Tailwind CSS](https://www.npmjs.com/package/tailwindcss) `v1.4.6`  
- [React Toastify](https://www.npmjs.com/package/react-toastify) `v7.0`  
- [React Datepicker](https://www.npmjs.com/package/react-datepicker) `v4.2`  
- [Rodal](https://www.npmjs.com/package/rodal) `v1.8`  
- [FontAwesome React](https://www.npmjs.com/package/@fortawesome/react-fontawesome) `v0.1` (icons `v5.15`)  

### Forms & Validation
- [Formik](https://www.npmjs.com/package/formik) `v2.1`  
- [Yup](https://www.npmjs.com/package/yup) `v0.29`  

### State Management
- [Context API](https://reactjs.org/docs/context.html)  

### Maps
- [Google Maps React](https://www.npmjs.com/package/google-maps-react) `v2.0`  

### Backend as a Service
- [Firebase](https://www.npmjs.com/package/firebase) `v7.19`  
  - Módulos usados: Auth, Firestore, Storage, Cloud Messaging, Cloud Functions  
- [Geofirestore](https://www.npmjs.com/package/geofirestore) `v4.3`  
- [React Firebase File Uploader](https://www.npmjs.com/package/react-firebase-file-uploader) `v2.4.3`  

## Setup
1. Install the dependencies:

   ```bash
   npm install
   ```
2. Set up Firebase:

  * Create a project in Firebase and obtain the credentials.
  * Create a .env file in the root of the project and add your Firebase credentials.

## Run
To start the application in development mode, run:

   ```bash
   npm start
   ```
This will open the application in your default browser at http://localhost:3000.

## Contributions
Contributions are welcome. If you wish to improve the project, please fork it and submit a pull request.

## Contact
For questions or suggestions, you can contact me at [ezioeg@gmail.com].
