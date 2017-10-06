const firebase = require('firebase');
// Initialize Firebase
const config = {
  apiKey: process.env.FIREBASEAPIKEY,
  databaseURL: process.env.FIREBASEDATABASEURL,
  projectId: process.env.FIREBASEPROJECTID,
};

firebase.initializeApp(config);
