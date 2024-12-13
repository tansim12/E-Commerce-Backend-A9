

# E-Commerce

## Project Description
The **E-Commerce** Application is designed to provide a complete online shopping experience for users, vendors, and administrators. It serves as a platform where users can browse and purchase products, vendors can manage their shops and inventories, and administrators can control and monitor the entire system. The application focuses on being intuitive, responsive, and secure, providing a seamless experience for all user roles. The core of this project is to build a scalable, high-performance system using modern web development technologies. It leverages Node.js and Express.js for the backend, React.js (or Next.js) for the front end, and PostgreSQL for data storage. The application integrates with third-party services for payments and file storage, ensuring a professional, enterprise-grade solution.


## Live Demo / URL
You can access the live API at:

[Live URL](https://e-commerce-backend-virid-seven.vercel.app/)

## Technology Stack
This project is built with a robust technology stack to ensure high performance and maintainability:

- **Node.js**: JavaScript runtime environment for backend development.
- **Express.js**: Web framework for creating RESTful APIs.
- **Prisma ORM**: Object-Relational Mapper for seamless interaction with the PostgreSQL database.
- **PostgreSQL**: Relational database used for structured data storage.
- **TypeScript**: Superset of JavaScript that adds strong typing, improving code quality and maintainability.

<!-- ## Features
- **CRUD Operations**: Easily perform Create, Read, Update, and Delete operations on product and other fields.
- **Borrow and Return Management**: Smoothly handle borrowing and returning transactions, tracking due dates and book availability.
- **Overdue Notifications and Penalties**: Automatically calculate and apply penalties for overdue books.
- **Scalability**: Designed to scale and support libraries with a large volume of books and members.
- **Data Validation**: Built with TypeScript for robust type-checking, reducing runtime errors. -->



 **Clone the repository**

   ```sh
   git clone 

   cd A-9-Postgress-Prisma
  
```
📦 Install Dependencies

---
```bash

$ yarn install

```
# ⚙️ Configure Environment Variables
## Create a `.env` file in the root of the project and add the following environment variables:

```bash

NODE_ENV=
BASE_URL=
FRONTEND_URL=
DB_NAME=
DATABASE_URL=
PORT=5000
BCRYPT_NUMBER=12
SECRET_ACCESS_TOKEN=
SECRET_REFRESH_TOKEN=
SECRET_ACCESS_TOKEN_TIME=10d
SECRET_REFRESH_TOKEN_TIME=365d
AAMAR_PAY_SEARCH_TNX_BASE_URL=
AAMAR_PAY_STORE_ID=aamarpaytest,
AAMAR_PAY_SIGNATURE_KEY= 
AAMAR_PAY_HIT_API= https://sandbox.aamarpay.com/jsonpost.php
EMAIL_APP_PASSWORD=


DATABASE_URL=
NODE_ENV="development"
PORT=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

JWT_SECRET=
EXPIRES_IN=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=
RESET_PASS_TOKEN="YOUR TOKEN SECRET"
RESET_PASS_TOKEN_EXPIRES_IN=
RESET_PASS_LINK="http://localhost:5000/forget-password/"
EMAIL= "your email"
APP_PASS= 
STORE_ID="SSL STORE ID"
STORE_PASS= "SSL STORE PASSWORD"
FRONTEND_URL="http://localhost:3000"
SUCCESS_URL= "http://localhost:3000/success"
CANCEL_URL= "http://localhost:3000/cancel"
FAIL_URL= "http://localhost:3000/fail"
SSL_PAYMENT_API= "PAYMENT API"
SSL_VALIDATIOIN_API= "PAYMENT VALIDATION API"

BASE_URL=https://e-commerce-backend-virid-seven.vercel.app
FRONTEND_URL=https://e-commerce-next-a9.vercel.app

AAMAR_PAY_SEARCH_TNX_BASE_URL=https://sandbox.aamarpay.com/api/v1/trxcheck/request.php
AAMAR_PAY_STORE_ID=aamarpaytest
AAMAR_PAY_SIGNATURE_KEY=
AAMAR_PAY_HIT_API=https://sandbox.aamarpay.com/jsonpost.php



```
# Running the app

```TYPESCRIPT
# watch mode
$ yarn run start


```
The server should be running on http://localhost:5000.


<!-- . -->


## Setup Instructions
To set up and run this project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://e-commerce-backend-virid-seven.vercel.app/
   cd A-8-Prisma-SQL
