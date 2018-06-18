import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { trigger, animate, style, transition, state } from "@angular/animations";
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { PedidoService } from '../../services/domain/pedido.service';
import { ToastControllerHelper } from '../../controllers/toast.controller';
import { ToastConfig } from '../../config/toast.config';


@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
  animations: [
    trigger('mail-sent', [
      state('active', style({
        transform: 'rotate(20deg)'
      })),
      state('inactive', style({
        transform: 'rotate(-20deg)'
      })),
      transition('active => inactive', [
        animate('500ms 0s ease-in')
      ]),
      transition('inactive => active', [
        animate('500ms 0s ease-in')
      ])
    ])
  ]
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[] = [];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codpedido: string;
  state: string = 'inactive';
  timeOutId: number;
  isButtonClicked: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService,
    public toast: ToastControllerHelper) {
    this.pedido = this.navParams.get('pedido');

  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;
    this.loadingInfos();
  }

  ionViewWillLeave() {
    clearTimeout(this.timeOutId);
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

 confirmOrder(): void {
  this.isButtonClicked = true;
  this.pedidoService.insert(this.pedido)
  .subscribe((response) => {
    this.codpedido = this.extractId(response.headers.get('location'));
    this.cartService.createOrClearCart();
    this.isButtonClicked = false;
    this.startEffect();
  },
  error => {
    if (error.status == 403) {
      this.toast.showToast(new ToastConfig('Falha na autenticação', undefined, "bottom", ['error'], true));
      this.navCtrl.setRoot('HomePage');
    }
    this.isButtonClicked = false;
  })
 }

 back(): void {
   this.navCtrl.setRoot('CartPage');
 }

 backCategorias(): void {
  this.navCtrl.setRoot('CategoriasPage');
 }

 private extractId(location: string): string {
   return location.substring(location.lastIndexOf('/') + 1, location.length);
 }

 private startEffect(): void {
  this.timeOutId = setTimeout(() => {
    this.state = this.state == "active" ? "inactive" : "active";
    this.startEffect();
  }, 510);
 }

}
