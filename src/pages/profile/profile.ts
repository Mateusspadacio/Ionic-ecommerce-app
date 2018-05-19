import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { LoadingControllerHelper } from '../../controllers/loading.controller';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  cliente: ClienteDTO = {
    email: '', nome: '', id: ''
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public loading: LoadingControllerHelper) {
  }

  ionViewDidLoad() {
    this.loading.showLoading();
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
        (error: any) => { 
          this.loading.hideLoadingWithTime(1000);
        })
    }

  }

  private getImageProfile(): void {
    this.clienteService.findImageUserProfile(this.cliente.id)
      .then((url: string) => {
        this.cliente.imageUrl = url;
        this.loading.hideLoadingWithTime(1000);
      })
      .catch((error: any) => {
        this.loading.hideLoadingWithTime(1000);
      })
  }

}
