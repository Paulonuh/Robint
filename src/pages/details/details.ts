import { Component, ViewChild} from '@angular/core';
import { NavController, IonicPage, ActionSheetController, NavParams, Content, App, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';


@IonicPage({
  segment:'post/:id'
})
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
  providers: [AngularFireAuth],
 
})
export class DetailsPage {

  @ViewChild(Content) content: Content;

  post: any = {
    title: '',
    body: '',
    created_at: '',
    uid: ''

  };
  teste: string = 'x1' || 'x2';
  commentbol:boolean= false;
  name: string;
  comment:string;
  postdoc:AngularFirestoreDocument<any>;
  data:any = {};
  data2:any={};
  userdoc: AngularFirestoreDocument<any>;
  user: any = {};
  listbkp: any[] = [];
  list: Observable<any>;
  collection: AngularFirestoreCollection<any>;
  isDone: boolean = false;
  
  postcomment: any = {
    comment: '',
    created_at: '',
    uid: '',
    id:'',
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFirestore,
    public app: App,
    public afAuth:AngularFireAuth,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController
    
  ) {
    
    this.data = this.navParams.get('dados');
    this.collection = this.db.doc(`posts/${navParams.get('id')}`).collection('comments', ref => ref.orderBy('created_at','desc').limit(3));
    
    

    this.list = this.collection.stateChanges(['added']).pipe(map(actions => {
      actions.map(action => {
        
        console.log('ACC', action);
        let data2 = action.payload.doc.data();
        let id = action.payload.doc.data();
        this.db.doc(`user/${data2.uid}`).valueChanges().subscribe(doc => {
          data2.user = doc;
          
        });
        if (this.isDone) {
          this.listbkp.unshift(data2)
        } else {
          this.listbkp.push(data2);
        }

      });

      this.isDone = true;
      return this.listbkp;

    }));
  }

  updatePost(postx) {

    this.app.getRootNav().push('UpdatepostPage', { id: postx.id, dados: postx })

  }
  commentControl(){
    this.commentbol = !this.commentbol;
    this.content.scrollToBottom(300);
    
    
  }

  comentar(comment){
    
    this.postcomment.created_at = Date.now();
    this.postcomment.uid = this.afAuth.auth.currentUser.uid
    this.postcomment.comment = comment;

    console.log(this.postcomment);
    this.collection.add(this.postcomment).then(result => {
      console.log(result);
      this.db.doc(`posts/${this.navParams.get('id')}/comments/${result.id}`).update({ id: result.id });
      this.comment = '';
    })
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
  deleteComment(data, index,postcomment){

    this.listbkp.splice(index, 1)
    this.db.collection(`posts/${data.id}/comments`).doc(postcomment.id).delete().then(result => {
      
      
      let toast = this.toastCtrl.create({
        message: 'Excluido com sucesso',
        duration: 3000,
        position: 'bottom'

      })
      toast.present();

    })
  }
  ionViewDidLoad() {
    console.log('doc ->', this.data2);


  }

  goNewPost() {
    this.app.getRootNav().push('NewPostPage')
  }
  openComment(data,index,postcomment){

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your Post',
      buttons: [
        {
          text: 'Deletar',
          icon: 'md-trash',
          handler: () => {
            console.log('Deletar clicked');
            this.deleteComment(data, index,postcomment);
          }
        }
      ]
    });

    actionSheet.present();
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
