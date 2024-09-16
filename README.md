
# <img src="public/images/logo2.png" alt="logo" width="300">
### Your Gateway to Unique Stays: Experience Travel Differently!

Nestquest is a full-stack web application inspired by Airbnb that allows users to sign up, log in, and explore unique accommodations worldwide. Users can list their properties, add reviews, and view precise locations on a map. The platform is built using modern web technologies like Node.js, Express.js, MongoDB, and integrates with Cloudinary for image storage and Mapbox for map functionality.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Demo

Check out the live demo: [NestQuest Demo](https://nestquest-4ik5.onrender.com/)

## Features

- **User Authentication**: Secure sign up and log in using Passport.js.
- **Listings Management**: Users can add, edit, and delete their property listings.
- **Reviews System**: Users can leave reviews and rate properties they have visited.
- **Map Integration**: Precise location plotting for each listing using Mapbox SDK for forward geocoding.
- **Image Storage**: Images are stored and managed securely with Cloudinary.
- **Responsive Design**: Fully responsive design using Bootstrap for seamless experience across devices.

## Tech Stack

- **Front-End**: HTML, CSS, Bootstrap, EJS
- **Back-End**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Cloud Storage**: Cloudinary
- **Map Integration**: Mapbox SDK
- **Authentication**: Passport.js

## Dependencies

The following dependencies are used in this project:

```json
{
  "@mapbox/mapbox-sdk": "^0.16.0",
  "cloudinary": "^1.21.0",
  "connect-flash": "^0.1.1",
  "connect-mongo": "^5.1.0",
  "dotenv": "^16.4.5",
  "ejs": "^3.1.10",
  "ejs-mate": "^4.0.0",
  "express": "^4.19.2",
  "express-session": "^1.18.0",
  "joi": "^17.13.3",
  "method-override": "^3.0.0",
  "mongoose": "^8.5.2",
  "multer": "^1.4.5-lts.1",
  "multer-storage-cloudinary": "^4.0.0",
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "passport-local-mongoose": "^8.0.0"

}
```

## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/nestquest.git
    cd nestquest
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Environment Variables**

   Create a `.env` file in the root directory and add your credentials:
    ```
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_KEY=your_cloudinary_key
    CLOUDINARY_SECRET=your_cloudinary_secret
    MAPBOX_TOKEN=your_mapbox_token
    DATABASE_URL=your_mongodb_atlas_url
    ```

4. **Run the application**
    ```bash
    node app.js
    ```

5. **Visit the app**
   Open your browser and go to `http://localhost:<port number>`.


## Usage

- **Sign Up / Log In**: Users can create an account or log in to an existing one.
- **Explore Listings**: Browse through available property listings.
- **Add New Listing**: Add your property with detailed information and images.
- **View & Edit Listings**: Edit or remove your listings.
- **Leave Reviews**: Share your experience by leaving reviews on properties.


## Folder Structure

```
nestquest/
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   ├── users.js
├── models/
│   ├── listing.js
│   ├── review.js
│   ├── user.js
├── public/
│   ├── css/
│   ├── images/
│   ├── js/
├── routes/
│   ├── index.js
│   ├── listings.js
│   ├── reviews.js
├── views/
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   ├── reviews/
├── app.js
├── .env
├── package.json
└── README.md
```


## Contributing

Contributions are welcome! Feel free to submit a Pull Request or open an Issue to discuss what you would like to change.

## Creators

- **Suvadip Sana** - *Full Stack Developer* - [Linked IN](https://www.linkedin.com/in/suvadip-sana-b07a14243/)
