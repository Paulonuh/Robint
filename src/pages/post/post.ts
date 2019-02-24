import { Component, ViewChild } from '@angular/core';
import { NavController, IonicPage, ActionSheetController, NavParams, Content, App, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
  providers: [AngularFireAuth],

})
export class PostPage {

  @ViewChild(Content) content: Content;

  post: any = {
    title: '',
    body: '',
    created_at: '',
    uid: ''

  };
  name: string;


  userdoc: AngularFirestoreDocument<any>;
  user: any = {};
  listbkp: any[] = [];
  list: Observable<any>;
  collection: AngularFirestoreCollection<any>;
  collection2: any

  isDone: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFirestore,
    public app: App,
    public afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController
  ) {

    this.collection = this.db.collection('posts', ref => ref.orderBy('created_at', 'desc').limit(5));
    this.list = this.collection.stateChanges(['added']).pipe(map(actions => {
      actions.map(action => {
        let data = action.payload.doc.data();
        let id = action.payload.doc.data();
        this.db.doc(`user/${data.uid}`).valueChanges().subscribe(doc => {
          data.user = doc;
        });
        if (this.isDone) {
          this.listbkp.unshift(data)
        } else {
          this.listbkp.push(data);
        }

      });

      this.isDone = true;
      return this.listbkp;

    }));

  }

  updatePost(postx) {

    this.app.getRootNav().push('UpdatepostPage', { id: postx.id, dados: postx })

  }
  detalhar(data) {
    this.app.getRootNav().push('DetailsPage', { id: data.id, dados: data })
  }
  delete(postx, index) {

    this.listbkp.splice(index, 1)
    this.db.collection('posts').doc(postx.id).delete().then(result => {

      let toast = this.toastCtrl.create({
        message: 'Excluido com sucesso',
        duration: 3000,
        position: 'bottom'

      })
      toast.present();

    })
  }

  ionViewDidLoad() {

  }

  goNewPost() {
    this.app.getRootNav().push('NewPostPage')
  }
  open(data, index) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your Post',
      buttons: [
        {
          text: 'Editar',
          icon: 'md-create',
          handler: () => {
            console.log('Editar clicked');
            this.updatePost(data);
          }
        },
        {
          text: 'Deletar',
          icon: 'md-trash',
          handler: () => {
            console.log('Deletar clicked');
            this.delete(data, index);
          }
        }
      ]
    });

    actionSheet.present();

  }
}
