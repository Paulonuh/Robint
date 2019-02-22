import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

/**
 * Generated class for the NewPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-post',
  templateUrl: 'new-post.html',
  providers: [AngularFireAuth]
})
export class NewPostPage {

  post: any = {};
  form: FormGroup;
  colletction: AngularFirestoreCollection<any>;
  list: Observable<any>;
  userdoc: AngularFirestoreDocument<any>;
  nameaux: any = {}

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public toastCtrl: ToastController,
    public app: App,
    public formBuilder: FormBuilder) {

    this.colletction = this.db.collection('posts');
    this.form = formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(6)]]


    })

    this.userdoc = this.db.doc(`user/${this.afAuth.auth.currentUser.uid}`);

    this.userdoc.snapshotChanges().subscribe(result => {
      this.nameaux = result.payload.data()
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewPostPage');
  }
  create() {

    this.post.created_at = Date.now();
    this.post.uid = this.afAuth.auth.currentUser.uid

    console.log(this.post);
    this.colletction.add(this.post).then(result => {
      console.log(result);
      this.db.doc(`posts/${result.id}`).update({ id: result.id });

      this.navCtrl.setRoot('TabsPage');

    });

  }

}