import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';


@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[] = [];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService) {
    this.pedido = this.navParams.get('pedido');
    console.log(this.pedido)
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;
    this.loadingInfos();
  }

  private loadingInfos(): void {
    this.clienteService.findById(this.pedido.cliente.id)
    .subscribe((response) => {
      this.cliente = response as ClienteDTO;
      this.endereco = this.findEndereco(response['enderecos']);
    },
    error => {
      this.navCtrl.setRoot('HomePage');
    });
  }

  private findEndereco(list: EnderecoDTO[]): EnderecoDTO {
    return list.find(i => {return i.id == this.pedido.enderecoDeEntrega.id});
 }

 total(): number {
   return this.cartService.total();
 }
}
