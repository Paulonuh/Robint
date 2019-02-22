import { ForgottenPage } from './../forgotten/forgotten';
import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AngularFireAuth]
})
export class LoginPage {

  username: string = "";
  password: string = "";

  inputType:string='password';

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    public db: AngularFirestore,

  ) {

  }

  forgotten(){
  this.navCtrl.setRoot("ForgottenPage");
}
  alert(title: string, message: string) {
    let alertBox = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alertBox.present();
  }

  loginUser() {

    this.autenticar(this.username, this.password);

  }

  autenticar(email, password) {

    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(result => {
      console.log('Esse é o result: ', result);

      localStorage.setItem('user_uid', result.user.uid)
      localStorage.setItem('user_email', result.user.email)
      this.db.doc(`user/${result.user.uid}`).valueChanges().subscribe(doc => {
        if (doc) {

          localStorage.setItem('user_picture', doc['picture'])
          localStorage.setItem('user_name', doc['name'])
          this.navCtrl.setRoot('TabsPage');
        } else {
          this.navCtrl.setRoot('TabsPage');
        }
      });


    }).catch(error => {
      console.log('esse é o erro: ', error);

      if (error.code === 'auth/invalid-email') {

        let toast = this.toastCtrl.create({
          message: 'Email inválido',
          duration: 3000,
          position: 'bottom'
        })
        toast.present();

      } else if (error.code === 'auth/wrong-password') {
        let toast = this.toastCtrl.create({
          message: 'Senha inválida, ou em branco',
          duration: 3000,
          position: 'bottom'
        })
        toast.present();
      } else if (error.code === 'auth/user-not-found') {
        let toast = this.toastCtrl.create({
          message: 'Usuario não encontrado',
          duration: 3000,
          position: 'bottom'
        })
        toast.present();
      } else {
        let toast = this.toastCtrl.create({
          message: 'Verifique sua conexão com a internet',
          duration: 3000,
          position: 'bottom'
        })
        toast.present();
      }
    });
  }

  criarConta() {
    this.navCtrl.setRoot('NewuserPage');
  }
  esqueceuSenha(){
    this.navCtrl.setRoot('ForgottenPage')
  }
  changeType(){
   
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }
}
