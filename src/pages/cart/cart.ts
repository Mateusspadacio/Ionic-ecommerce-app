import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    this.loadingCart();
  }

  private loadingCart(): void {
    this.cart = this.cartService.getCart();
  }

}
