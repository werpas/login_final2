import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from "angularfire2/auth";
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { Loading } from 'ionic-angular/components/loading/loading';
import { LoginPage } from '../login/login';
/**
 * Generated class for the ResetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {
  public resetPasswordForm: FormGroup;
  loading: Loading;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private loginAuth: AngularFireAuth,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public formBuilder: FormBuilder) {
    this.resetPasswordForm = formBuilder.group({
      email: ['', 
      Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }

  resetPassword(){
    this.showLoading();
    if(this.resetPasswordForm.valid){
      this.loginAuth.auth.sendPasswordResetEmail(this.resetPasswordForm.value.email).then( (user) => {
        let alert = this.alertCtrl.create({
          message: "We sent you a reset link to your email",
          buttons: [
            {
              text: "Ok",
              role: 'cancel',
              handler: () => { this.navCtrl.pop(); }
            }
          ]
        });
        this.loading.dismiss();
        alert.present();        
      }, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [{ text: "Ok", role: 'cancel' }]
        });
        this.loading.dismiss();
        errorAlert.present();
      });
    }else{
      this.loading.dismiss();
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Sending password reset link...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }  
}
