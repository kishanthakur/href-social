# href social - All your social links at one place

## Overview

**href social** is a web application built with ReactJS, JavaScript, Tailwind CSS, Redux, Redux Toolkit, and react-hook-form that allows users to create personalized link pages with their various social media profiles and websites. The project utilizes `react-hash` to generate unique hashcodes for each user's page. This hashcode serves as a security key to enable users to edit their profiles securely.

## To create a profile : [href.social](https://href-social.vercel.app/) 
## To open a profile : [href.social/kishanthakur](https://href-social.vercel.app/kishanthakur) 

## Demo

![href-demo-2](https://github.com/kishanthakur/href-social/assets/49359184/fe7ba3c8-94e1-40f6-8f0d-5de933bea5e6)


## Features

- **User-Friendly Interface:** Enjoy an intuitive and user-friendly interface that simplifies the process of creating and customizing your link page.
- **Personalized Links:** Add, edit, and remove links to your social media profiles, websites, and other online platforms to present a personalized link collection.
- **Profile Security:** Users can securely edit their profiles by providing the correct `react-hash` security key associated with their page.
- **Responsive Design:** The website boasts a responsive design, adapting seamlessly to different devices, including desktops, tablets, and mobile phones.

## Installation

1. Clone the repository to your local machine.
2. Install the necessary dependencies using npm:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your web browser and navigate to `http://localhost:3000` to view the website.

## Usage

1. Upon visiting the website, you will be prompted with a form to create your personalized link page.
2. Input your desired username, profile picture URL, and social media links using the provided input fields and react-hook-form for efficient form handling.
3. Click on the "Add Link" button to include additional links as needed.
4. To edit or remove a link, hover over the link card and click on the corresponding buttons.
5. Once you are satisfied with your page, click the "Submit" button. A dialog box will pop up and ask you to enter a security question in case you forget your security code. On submission, you will receive a unique security code to save.
6. Your link page will be generated with a custom URL, which you can copy and share with others.
7. To edit your profile, navigate to the generated URL and provide the security key associated with your page. This ensures only you can make changes to your profile.

## Technologies Used

- ReactJS: A renowned JavaScript library for building user interfaces.
- JavaScript: The programming language used for the website's logic.
- Tailwind CSS: A utility-first CSS framework for streamlined UI development.
- Redux: A state management library for efficient handling of the application's state.
- Redux Toolkit: The official, opinionated way to use Redux for robust and maintainable state management.
- react-hash: A library used to generate unique hashcodes for custom URLs and as a security key for profile editing.
- react-hook-form: A library for efficient, flexible, and extensible form handling.
- MongoDB Atlas realm: Used for storing user data securely in the cloud.

## Contributing

Contributions are more than welcome! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## Special Thanks

A special shoutout to the team behind the react-hash open-source library. Your contribution to the community is invaluable.
To learn more about their work and maybe contribute or use react-hash in your projects, check out their [repository](https://github.com/Drazail/react-hash/).

Embrace the power of href socializing! 🌐
