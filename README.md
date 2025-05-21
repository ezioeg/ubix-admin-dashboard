# Ubix Admin Dashboard

Ubix Admin Dashboard is a web application that allows administrators to manage general information, products, orders, and payments for affiliated restaurants. The application is designed to simplify administration and optimize the management of restaurant services.

## Features

- **Product Management**: Add, edit, and delete products from affiliated restaurants.
- **Order Management**: View and manage orders placed by customers.
- **Payment Management**: Manage transactions and payments for restaurants.
- **Web Notifications**: Receive real-time notifications about relevant events.
- **PWA Installation**: The application can be installed as a Progressive Web App for easier access.

## Technologies Used

### Frontend
- React v16.13
- React Router DOM v6 (alpha)
- Context API
- Tailwind CSS v1.4.6
- React Toastify v7.0
- React Datepicker v4.2
- Rodal (modals) v1.8
- FontAwesome React v0.1 (icons v5.15)

### Forms
- Formik v2.1
- Yup v0.29

### Backend-as-a-Service
- Firebase v7.19 (Auth, Firestore, Storage, Cloud Messaging, Cloud Functions)
- Geofirestore v4.3

### Maps
- Google Maps React v2.0

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/tu-usuario/ubix-admin-dashboard.git

2. Navigate to the project directory:

   ```bash
   cd ubix-admin-dashboard

3. Install the dependencies:

   ```bash
   npm install

4. Set up Firebase:

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
