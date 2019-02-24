import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
/**
 * Generated class for the UpdatepostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updatepost',
  templateUrl: 'updatepost.html',
  providers: [AngularFireAuth]
})
export class UpdatepostPage {

  data: any = {};
  form: FormGroup;
  colletction: AngularFirestoreCollection<any>;
  list: Observable<any>;
  postdoc: AngularFirestoreDocument<any>;
  nameaux: any = {}

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public toastCtrl: ToastController,
    public app: App,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController) {

    this.data = this.navParams.get('dados');
    this.postdoc = this.db.doc(`posts/${navParams.get('id')}`);


    this.form = formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(6)]]
    })


  }

  ionViewDidLoad() {



  }

  update() {

    this.viewCtrl.showBackButton(false);

    this.postdoc.set(this.data).then(() => {

      let toast = this.toastCtrl.create({
        message: 'Alterado com sucesso',
        duration: 3000,
        position: 'bottom'

      })
      toast.present();
      toast.onDidDismiss(() => {
        this.app.getRootNav().pop();

      });


    }).catch(() => {
      this.viewCtrl.showBackButton(true);
    })


  }
}
