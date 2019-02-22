import { AngularFireModule } from 'angularfire2';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { MyApp } from './app.component';
//native
import { Camera } from '@ionic-native/camera';


var config = {
  apiKey: "AIzaSyBGrH2VnEEJ2xo9KkSxpAOHDDoiR_lCJl4",
  authDomain: "robintagent.firebaseapp.com",
  databaseURL: "https://robintagent.firebaseio.com",
  projectId: "robintagent",
  storageBucket: "robintagent.appspot.com",
  messagingSenderId: "53738825477"
};
@NgModule({
  declarations: [
    MyApp,
    
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera
  ]
})
export class AppModule {}
