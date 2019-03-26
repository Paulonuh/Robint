
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController, Platform } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';

declare var ApiAIPromises: any;

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [AngularFireAuth]
})
export class ChatPage {
  answers = [];
  questions = [];


  //------------------------------------
  @ViewChild(Content) content: Content;

  user: any = {};

  listbkp: any[] = [];
  username: string = '';
  message: string = '';
  collection: AngularFirestoreCollection<any>;
  list: Observable<any>;
  userdoc: AngularFirestoreDocument<any>;

  constructor(
    public platform: Platform,
    public ngZone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFirestore,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {



    platform.ready().then(() => {
      ApiAIPromises.init({
        //clientAccessToken: "YOUR DIALOGFLOW API TOKEN HERE",
        lang: "pt-BR"
      })


    })



    //---------------------------------------------
    this.username = this.navParams.get('user_name');
    this.collection = this.db.collection('messages', ref => ref.where('uid', '==', this.afAuth.auth.currentUser.uid).orderBy('created', 'asc'));
    this.list = this.collection.stateChanges(['added']).pipe(map(actions => {
      actions.map(action => {
        let data = action.payload.doc.data();
        this.db.doc(`user/${data.uid}`).valueChanges().subscribe(doc => {
          data.user = doc;
        });
        this.listbkp.push(data);
      });


      setTimeout(() => {
        this.content.scrollToBottom(300);
      }, 300);
      return this.listbkp;

    }));

    this.userdoc = this.db.doc(`user/${this.afAuth.auth.currentUser.uid}`);


    this.userdoc.valueChanges().subscribe(result => {
      this.user = result;

    });

    //--------------------------------------------------
  }

  ask(question) {
    this.questions.push(question);
    ApiAIPromises.requestText({
      query: question,

    })
      .then(({ result: { fulfillment: { speech } } }) => {
        this.ngZone.run(() => {
          this.answers.push(speech);

          let data = {
            message: this.message,
            created: Date.now(),
            uid: this.afAuth.auth.currentUser.uid,
            messagebot: speech,

          };
          this.sendMessage(data)
          this.message = '';
        });
        question = '';
      })

  }

  sendMessage(data) {

    this.collection.add(data).then(result => {
      this.content.scrollToBottom(300)
    })
  }

  logout() {
    this.navCtrl.setRoot('HomePage');
    localStorage.clear();
  }

  ionViewDidLoad() {


    this.content.scrollToBottom(300);

  }

}
