import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Cart } from '../../models/cart';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoDTO } from '../../models/produto.dto';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cart: Cart = {items: []};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public cartService: CartService) {
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  ionViewDidLoad() {
    this.loadingCart();
  }

  private loadingCart(): void {
    this.cart = this.cartService.getCart();
  }

  removeProduto(produto: ProdutoDTO): void {
    this.cart = this.cartService.removeProduto(produto);
  }

  increaseQuantity(produto: ProdutoDTO): void {
    this.cart = this.cartService.increaseQuantity(produto);
  }

  decreaseQuantity(produto: ProdutoDTO): void {
    this.cart = this.cartService.decreaseQuantity(produto);
  }

  total(): number {
    return this.cartService.total();
  }

  goOn(): void {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout(): void {
    this.navCtrl.push('PickAddressPage');
  }

}
