import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { LoadingControllerHelper } from '../../controllers/loading.controller';

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {

  produto: ProdutoDTO;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loading: LoadingControllerHelper,
    public cartService: CartService) {
  }

  ionViewDidLoad() {
    this.loading.showLoading();
    this.produto = this.navParams.get('produto');
    this.produtoService.getImage(this.produto, false)
    .then(() => {
      this.loading.hideLoadingWithTime(1000);
    })
    .catch((error) => {this.loading.hideLoading()});
  }

  addingProduto(): void {
    if (this.produto) {
      this.cartService.addProduto(this.produto);
      this.navCtrl.setRoot('CartPage');
    }
  }

}
