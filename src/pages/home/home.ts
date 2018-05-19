import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastConfig } from '../../config/toast.config';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public buttomLoginClicked: boolean = false;

  public creds: CredenciaisDTO = {
    email: "", senha: ""
  };

  constructor(public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService) {

  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  login() {
    this.buttomLoginClicked = true;
    this.auth.authenticate(this.creds)
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get("authorization"));
        this.buttomLoginClicked = false;
        this.navCtrl.setRoot('CategoriasPage');
      },
        error => {
          this.buttomLoginClicked = false;
        });
  }

}
