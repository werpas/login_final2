import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { User } from '../../models/user';
import { LoginStatus } from '../../models/loginstatus';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { AngularFireAuth } from "angularfire2/auth";
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { Loading } from 'ionic-angular/components/loading/loading';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ResetpasswordPage } from '../resetpassword/resetpassword';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loading: Loading;
  user = {} as User;
  loginStatus = {} as LoginStatus;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private loginAuth: AngularFireAuth,
              private toast: ToastController,
              private facebook: Facebook,
              private loadingCtrl: LoadingController,
              private formBuilder: FormBuilder) {

    this.loginForm = formBuilder.group({
      email: ['', 
      Validators.compose([Validators.required])],
      password: ['', 
      Validators.compose([Validators.minLength(6), Validators.required])]
    });                
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Signing in...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  async login(user: User){
    if (this.loginForm.valid) {
      this.showLoading();
      try {
        const result = this.loginAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(res => {
          this.navCtrl.setRoot(HomePage);
        }, err => {
          let msg;
          switch (err.code) {
            case "auth/wrong-password":
              msg = "Email or password is incorrect.";
              break;
            case "auth/user-not-found":
              msg = "User does not exists!";
              break;
          }
          this.loading.dismiss();
          this.loginStatus.message = msg;
        })

      } catch (e) {
        this.loading.dismiss();
        console.log("Catching from login.");
      }
    }
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  resetPassword(){
    this.navCtrl.push(ResetpasswordPage);
  }

  async loginWithFacebook(): Promise<any>{
    this.facebook.login(['email']).then(response => {
      const facebookCredentials = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredentials).then( success => {
        console.log("Firebase facebook integration successsful. " + JSON.stringify(success));
        this.navCtrl.push(HomePage);
      })


    }).catch((error) => {
      console.log(error)
    });
  }
}
