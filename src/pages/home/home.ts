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

  ionViewCanEnter(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.refreshToken().toPromise()
      .then(response => {
        this.redirect(response);
        resolve();
      })
      .catch(error => {
        resolve();
      });
    })
  }
  
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidEnter() {
  }

  login() {
    this.buttomLoginClicked = true;
    this.auth.authenticate(this.creds)
      .subscribe(response => {
        this.redirect(response);
      },
        error => {
          this.buttomLoginClicked = false;
        });
  }

  private redirect(response: any): void {
    this.auth.successfulLogin(response.headers.get("authorization"));
    this.buttomLoginClicked = false;
    this.navCtrl.setRoot('CategoriasPage');
  }

  signup(): void {
    this.navCtrl.push('SignupPage');
  }

}
