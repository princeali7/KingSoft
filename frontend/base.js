import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

var app = firebase.initializeApp({
     apiKey: "",
    authDomain: "",
    databaseURL: '',
    projectId: "",





});



var db = firebase.database(app);
var base = Rebase.createClass(db);

export default base;