# Periodic Tables - Restaurant Reservations by Johnathan Villa Castruita

Live deployment link: https://villacodes-reservations-client.herokuapp.com/dashboard

#### Johnny is a software developer originally based in Concord, CA. He has been active in web development since 2021.

## Periodic Tables is a restaurant reservations scheduling and seating tool.

##### Create tables.
##### Create, edit, seat, and cancel reservations.
##### Keep a record of all reservations, whether booked, canceled, or seated.

### Languages and Frameworks - JavaScript, React.js, HTML5, PostgreSQL, Express.js, Knex.js

# Project Map

### URL Path: / or /dashboard

##### The main page will route to the dashboard where any tables that exist and any reservations that are on today's date will be rendered by default. Today's date is rendered and can be cycled forward or backward to view future and past reservations that are booked or seated. If a reservation is seated, a finish button is rendered on the table that was selected for this reservation. A 'seat', 'edit' and 'cancel' button are on each reservation. Selecting 'seat' follows the "/:reservationId/seat" route. Selecting 'edit' follows the "/edit" route. Selecting 'cancel' will render a conirmation popup asking the user to confirm the cancelling and informing them this cannot be undone. After confirmation, the record will no longer render, but will remain available in the API for reference maintaining a status of "cancelled".

### URL Path: /search

##### Selecting the 'Search' option from the navigation bar will open a form for searching by telephone number. Selecting 'search' on the form will render each currently booked or seated reservation under the submitted phone number.

### URL Path: /reservations/new

##### Selecting 'Create New Reservation' from the navigation bar will follow the "/new" route. A form is rendered requesting the necessary information to secure a reservation. A submit button will send a POST request to the API. The create method is validated by a large set of validation conditions. Any validations that do not match the inputed info will abort the POST and render an error at the top of the page for the user to easily see what info the need to add or change in the form. Cancel button returns to the previous page.

### URL Path: /tables/new

##### Selecting the 'New Table' option from the navigation bar will render an input form to utilize the create method and render a new table on at "/", or the "/dashboard" route. If no reservations are found, a message will render to notify the user. Cancel button returns to the previous page.

# Running Locally

### If you would like to use the app locally to see it in action, follow this setup guide:

| 1. Clone Repo or download .zip

| 2. Open terminal and navigate to root folder for project 

|   a. Enter command: npm install

|   b. Enter command: cd front-end && npm install

|   c. Enter command: cd ../back-end && npm install

| 3. Create two PostgreSQL databases to test and run app, one designated 'developmment', the other 'test'

| 4. Open project in your code editor (ie, VS Code) and create the appropriate .env files in the front-end and back-end folders

|   a. *FRONT-END* file:

|     DATABASE_URL_DEVELOPMENT=*enter url for development database inside asterisks, remove asterisks*

|     DATABASE_URL_TEST=*enter url for test database inside asterisks, remove asterisks*

|   b. *BACK-END* file:

|     REACT_APP_API_BASE_URL=http://localhost:5000

| 5. Open terminal and navigate to back-end folder:

|   a. Enter command: npx knex migrate:latest

|   b. Enter command: npx knex seed:run

| 6. Navigate to parent folder:

|      Enter command: npm run start:dev

| 7. To run tests, enter commands from root folder:

|   a. Enter command: npm run test:frontend
OR
|   b. Enter command: npm run test:backend
OR
|   c. Enter command: npm run test

#### You will now be able to use the app in your browser at local host 3000 (preferrably Chrome), updating your development database with entries you submit through the forms.

#### If you want to manually POST, PUT, or DELETE entries, run your DBeaver or equivilent software connected to the databases to monitor changes you request and use Postman to send HTTP requests.
