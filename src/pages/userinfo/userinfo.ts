import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the UserinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userinfo',
  templateUrl: 'userinfo.html',
  providers: [AngularFireAuth]
})
export class UserinfoPage {


  colletction: AngularFirestoreCollection<any>;
  perfil: any = {};
  user_name: string = localStorage.getItem('user_name') ? localStorage.getItem('user_name') : '';
  user: any = {};
  user_email: string = localStorage.getItem('user_email') ? localStorage.getItem('user_email') : '';

  isRequest: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public toastCtrl: ToastController,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController
  ) {

    this.colletction = this.db.collection('user', ref => ref.where('uid', '==', this.afAuth.auth.currentUser.uid));
    this.user.name = localStorage.getItem('user_name') ? localStorage.getItem('user_name') : 'n/a';
    this.user.email = localStorage.getItem('user_email') ? localStorage.getItem('user_email') : 'n/a';
    this.user.picture = localStorage.getItem('user_picture') ? localStorage.getItem('user_picture') : 'assets/imgs/no-img.png';
    console.log('deixa eu ver esse maluco', this.user.picture);


  }

  ionViewDidLoad() {

  }

  save(name: string) {
    this.isRequest = true;

    this.colletction.doc(this.afAuth.auth.currentUser.uid).update({ name }).then(() => {
      this.isRequest = false;
    }).catch(() => {
      this.isRequest = false;
    });



    localStorage.setItem('user_name', name);
    this.user.name = name ? name : localStorage.getItem('user_name') ? localStorage.getItem('user_name') : 'n/a';

  }

  open() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Tirar Foto',
          icon: 'ios-camera',
          handler: () => {

            this.takePicture(1);
          }
        },
        {
          text: 'Galeria',
          icon: 'md-images',
          handler: () => {

            this.takePicture(0);
          }
        }
      ]
    });

    actionSheet.present();

  }
  takePicture(type) {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      targetWidth: 300,
      targetHeight: 300,
      sourceType: type

    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.user.picture = base64Image;
      this.colletction.doc(this.afAuth.auth.currentUser.uid).update({ picture: base64Image }).then(() => { })

    }, (err) => {
      console.log("erroIMG", err);

    });
  }
}
