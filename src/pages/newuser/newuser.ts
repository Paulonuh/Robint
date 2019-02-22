import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
/**
 * Generated class for the NewuserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newuser',
  templateUrl: 'newuser.html',
  providers: [AngularFireAuth]
})
export class NewuserPage {

  form: FormGroup;


  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public db: AngularFirestore, ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required, Validators.minLength(3)]]


    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewuserPage');
  }

  alert(title: string, message: string) {
    let alertBox = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alertBox.present();
  }
  novoRegistro(email: string, password: string, username: string) {


    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        console.log('Esse e o result', result)
        localStorage.setItem('user_uid', result.user.uid)
        localStorage.setItem('user_email', result.user.email)
        this.db.doc(`user/${result.user.uid}`).set({ name: username, uid: result.user.uid, picture: 'assets/imgs/no-img.png' }).then(doc => {

          localStorage.setItem('user_picture', 'assets/imgs/no-img.png')
          localStorage.setItem('user_name', username)
          this.alert('Conta Criada com sucesso', result.user.email)
          this.navCtrl.setRoot('TabsPage')

        })
      }).catch(error => {
        console.log("esse é o catch", error)
        if (error.code === 'auth/weak-password') {

          let toast = this.toastCtrl.create({
            message: 'Senha muito curta',
            duration: 3000,
            position: 'bottom'
          })
          toast.present();

        } else if (error.code === 'auth/email-already-in-use') {
          let toast = this.toastCtrl.create({
            message: 'Email não disponivel para cadastro',
            duration: 3000,
            position: 'bottom'
          })
          toast.present();
        } else if (error.code === 'auth/argument-error') {
          let toast = this.toastCtrl.create({
            message: 'Insira seu email',
            duration: 3000,
            position: 'bottom'
          })
          toast.present();
        } else if (error.code === 'auth/invalid-email') {
          let toast = this.toastCtrl.create({
            message: 'Email inválido',
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
  back() {

    this.navCtrl.setRoot('LoginPage');
  }
}