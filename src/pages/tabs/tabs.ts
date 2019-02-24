import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',

})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root = 'PostPage';
  tab2Root = 'ChatPage';
  tab3Root = 'UserinfoPage';

  constructor(public navCtrl: NavController, platform: Platform) {
    platform.registerBackButtonAction(() => this.logout());
  }

  logout() {


    this.navCtrl.setRoot('LoginPage');
    localStorage.clear();
  }
}