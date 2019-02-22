import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the ForgottenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotten',
  templateUrl: 'forgotten.html',
  providers: [AngularFireAuth]
})
export class ForgottenPage {


  useremail:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,    
    public toastCtrl: ToastController,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgottenPage');
  }

  alert(title: string, message: string) {
    let alertBox = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alertBox.present();
  }
  sendUser(){
    this.afAuth.auth.sendPasswordResetEmail(this.useremail).then(result=>{
      this.alert('Email enviado para: ', this.useremail);
      this.navCtrl.setRoot('LoginPage');
  
    }).catch(error => {
      console.log("esse é o catch", error)
      if (error.code === 'auth/user-not-found') {

        let toast = this.toastCtrl.create({
          message: 'Email não encontrado, verifique o email novamente',
          duration: 3000,
          position: 'bottom'
        })
        toast.present();
    } else if (error.code === 'auth/invalid-email') {
      let toast = this.toastCtrl.create({
        message: 'formato de email inválido',
        duration: 3000,
        position: 'bottom'
      })
      toast.present();
    }else {
      let toast = this.toastCtrl.create({
        message: 'Verifique sua conexão com a internet',
        duration: 3000,
        position: 'bottom'
      })
      toast.present();
    }
  });
  }

  back() {

    this.navCtrl.setRoot('LoginPage');
  }
}
