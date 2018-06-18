import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { LoadingControllerHelper } from '../../controllers/loading.controller';
import { StorageService } from '../../services/storage.service';


@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[] = [];

  pedido: PedidoDTO;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public loading: LoadingControllerHelper,
    public cartService: CartService) {
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

          this.pedido = {
            cliente: {id: response['id']},
            enderecoDeEntrega: {id: ''},
            pagamento: {numeroParcelas: 0, "@type": ''},
            itens: this.cartService.cartItemsToItemPedido()
          }
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

  goFormOfPayment(id: string): void {
    this.pedido.enderecoDeEntrega.id = id;
    this.navCtrl.push('PaymentPage', {pedido: this.pedido});
  }

}
