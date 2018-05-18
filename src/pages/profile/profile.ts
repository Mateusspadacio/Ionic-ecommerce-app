import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO = {
    email: '', nome: '', id: ''
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService) {
  }

  ionViewDidLoad() {
    this.loadingProfile();
  }

  private loadingProfile(): void {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe((cliente: ClienteDTO) => {
          this.cliente = cliente;
          this.getImageProfile();
        },
          (error: any) => { })
    }

  }

  private getImageProfile(): void {
    this.clienteService.findImageUserProfile(this.cliente.id)
      .then((url: string) => {
        this.cliente.imageUrl = url;
      })
      .catch((error: any) => { })
  }

}
