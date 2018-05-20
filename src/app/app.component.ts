import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  pages: Array<{ title: string, component: string, icon: string }>;

  private email: string;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Perfil', component: 'ProfilePage', icon: 'person' },
      { title: 'Categorias', component: 'CategoriasPage', icon: 'list-box' },
      { title: 'Carrinho', component: 'CartPage', icon: 'cart'},
      { title: 'Logout', component: '', icon: 'arrow-back' }
    ];

  }

  ngOnInit() {
    var config = {
      apiKey: "AIzaSyBVw76-lxWss8OfdOGHAhH6EphbzbkZT5Y",
      authDomain: "jta-ecommerce-spring-boot.firebaseapp.com",
      databaseURL: "https://jta-ecommerce-spring-boot.firebaseio.com",
      projectId: "jta-ecommerce-spring-boot",
      storageBucket: "jta-ecommerce-spring-boot.appspot.com",
      messagingSenderId: "136498232235"
    };
    firebase.initializeApp(config);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page: { title: string, component: string }) {

    switch (page.title) {
      case 'Logout':
        this.auth.logout();
        this.nav.setRoot('HomePage');
        break;
      default:
        this.nav.setRoot(page.component);
    }

  }

}
