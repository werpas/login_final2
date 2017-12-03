import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  logoutUser(): Promise<void> {
    this.navCtrl.setRoot(LoginPage);
    return firebase.auth().signOut();
  }    

}
