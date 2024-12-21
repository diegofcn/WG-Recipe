# Recipe Page for Our Shared Apartment
This project is a fully developed recipe platform designed specifically for our shared apartment. From conceptualization and design to coding the frontend, backend, and database integration—every step of this project has been executed end-to-end as a complete demonstration of modern web application development. The goal is to offer a user-friendly interface that allows users to store recipes, manage them, and easily convert the required ingredients into shopping lists.

## Table of Contents
1. About the Project
2. Features
3. Technologies
4. Architecture & Structure
5. Installation & Setup
6. Usage
7. Database Structure
8. User Management & Authentication
9. Shopping List Feature & QR Code Generation
10.Example Workflows
11. Roadmap & Future Development
12. License
    
## About the Project
In a shared apartment, good organization when planning meals and shopping is essential. This web application allows every apartment member to save, add, edit, and delete recipes. On top of that, it can dynamically create shopping lists based on the needed ingredients and even offers the ability to download the list as an image or transfer it quickly to a mobile device via QR code.

<b>All steps—from conceptualizing the user experience, designing the interface, and implementing the frontend and backend, to structuring and populating the database—have been carried out independently.</b>

##Features
- <b>User-Friendly Frontend:</b>
    - A clean, intuitive, and appealing design makes it easy for anyone to navigate and use.

- <b>User Registration & Login:</b>
    - A secure authentication system that lets new users create accounts and existing users log in.

- <b>Database for Recipes & Users:</b>
    - A MongoDB database stores all recipe, ingredient, and user information.

- <b>Recipe Management:</b>
    - Add new recipes with ingredients, categories, and notes.
    - Edit or delete existing recipes.

- <b>Shopping List:</b>
    - Dynamically create a shopping list based on the selected recipe’s ingredients.
    - Download the shopping list as an image.
    - Generate a QR code to quickly transfer the shopping list to mobile devices.

## Technologies
<b>Frontend:</b>
- ReactJS
- TypeScript
- Tailwind CSS

<b>Backend:</b>
- Node.js
- Express.js
  
<b>Database:</b>
- MongoDB
  
Additional NPM packages and tools were used for various functionalities, build processes, and deployments (see package.json for details).

## Architecture & Structure
The application follows a clearly defined architecture:

- <b>Client (Frontend):</b>
The React frontend ensures a responsive and user-friendly interface. Using TypeScript improves code maintainability and reduces errors.

- <b>Server (Backend):</b>
An Express.js server acts as an intermediary between the frontend and the database. It defines all REST API endpoints for user authentication, recipe management, shopping list generation, and more.

- <b>Database (MongoDB):</b>
MongoDB stores all user and recipe data. Mongoose schemas ensure a clean structure and validation of the data.

## Installation & Setup

1. Clone the Repository:
   ```
   git clone https://github.com/your_username/your_recipe_project.git
   ```
2. Navigate to Project Directory:
```
cd your_recipe_project
```

3. Install Dependencies:
For the backend:
```
cd backend
npm install
```

For the frontend:
```
cd ../frontend
npm install
```

4. Configure the Database & Environment Variables:
Make sure you have a running MongoDB instance. Create a .env file in the backend folder and add your database connection URL (e.g., MONGODB_URI) and other environment variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.yourhost/yourdb
JWT_SECRET=yourSecretKey
PORT=4000
```

5. Start the Server:
From the backend folder:
```
npm run start
```

From the frontend folder:
```
npm run dev
```

6. Access the Application:
The frontend will usually be available at http://localhost:3000.


## Usage

<b>Register & Log In:</b>
- Create a new user account or log in with existing credentials.

<b>Browse & Manage Recipes:</b>
- Add new recipes, edit existing ones, or delete those no longer needed. Each recipe includes ingredients, instructions, and optional notes.

<b>Generate Shopping Lists:</b>
- Select a recipe to automatically create a shopping list based on its ingredients. Download it as an image or use the QR code to open it on your phone.

## Database Structure
A rough overview of the MongoDB collections:

- <b>Users:</b>
  - Fields: username, email, passwordHash, createdAt, updatedAt

- <b>Recipes:</b>
  - Fields: title, ingredients, instructions, image, authorId, createdAt, updatedAt

  - ingredients is an array of objects containing fields like name and quantity.
Mongoose models are used for data consistency and validation.

## User Management & Authentication
- <b>Registration:</b>
    - Users sign up with a username, email, and password. Passwords are securely hashed (with bcrypt).

- <b>Login:</b>
    - Credentials are verified, and a JWT (JSON Web Token) is issued for authenticated requests.

- <b>Protected Endpoints:</b>
    - Creating, editing, deleting recipes and generating a qr code is only available to authenticated users. The JWT must be sent in the Authorization header of each request.

## Shopping List Feature & QR Code Generation
After selecting a recipe, users can:

1. <b>Generate a Shopping List:</b>
Based on the required ingredients, just by clicking on them.

2. <b>Download as Image:</b>
Download the generated shopping list as a PNG image for printing or sharing.

3. <b>QR Code Generation:</b>
A QR code can be created, enabling quick transfer of the shopping list to a mobile device.

## Example Workflows
- <b>Adding a New Recipe:</b>
1. Log in as a registered user.
2. Navigate to "Add New Recipe".
3. Fill in the recipe details (title, ingredients, instructions, optional image).
4. Save the recipe; it will appear in the main recipe list.
- <b>Creating a Shopping List:</b>
1. Select a recipe from the list.
2. Click on any ingredient.
3. The list is displayed and can be downloaded as an image or shared via QR code.

## Roadmap & Future Development
<b>Optimizations:</b>
- Frontend performance improvements
- Better form Validation
- More robust backend error handling
- Further responsive design enhancements for mobile devices

## License
This project is licensed under the MIT License.

Thank you for checking out this project! For questions, feedback, or suggestions, please open an issue or submit a pull request.
