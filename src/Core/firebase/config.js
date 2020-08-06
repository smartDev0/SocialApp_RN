import { decode, encode } from 'base-64';
import './timerConfig';
global.addEventListener = (x) => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKq72lwofTtRDNK370dTFLHMkVt20FIQM",
  authDomain: "squeaks-af52f.firebaseapp.com",
  databaseURL: "https://squeaks-af52f.firebaseio.com",
  projectId: "squeaks-af52f",
  storageBucket: "squeaks-af52f.appspot.com",
  messagingSenderId: "792132611797",
  appId: "1:792132611797:web:db20cd4c64879f5f1ffc5c",
  measurementId: "G-41KHJZ7ZW9"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };
