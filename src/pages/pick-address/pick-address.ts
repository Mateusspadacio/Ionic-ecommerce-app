import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { LoadingControllerHelper } from '../../controllers/loading.controller';


@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[] = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public loading: LoadingControllerHelper) {
  }

  ionViewCanEnter() {
    this.loadingProfile();
  }

  ionViewDidLoad() {
  }

  private loadingProfile(): void {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe((response) => {
          this.items = response['enderecos'];
        },
          (error: any) => {
            if (error.status == 403) {
              this.redirectIfInvalid();
            } else {
              this.loading.hideLoadingWithTime(1000);
            }

          })
    } else {
      this.redirectIfInvalid();
    }

  }

  private redirectIfInvalid(): void {
    this.loading.hideLoading();
    this.navCtrl.setRoot('HomePage');
  }

}
