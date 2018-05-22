import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { LoadingControllerHelper } from '../../controllers/loading.controller';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  categoria: CategoriaDTO = { id: '', nome: '', urlImage: '' };
  refresher: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loading: LoadingControllerHelper) {
  }

  ionViewDidLoad() {
    this.loading.showLoading();
    this.loadingProdutos();
  }

  private loadingProdutos(): void {
    this.categoria = this.navParams.get('categoria');
    if (this.categoria == undefined) {
      this.redirectIfUndefined();
      return;
    }

    this.produtoService.findByCategoria(this.categoria.id)
      .subscribe((items: any) => {
        this.items = items.content;
        this.produtoService.findImages(this.items)
          .then((items) => {
            this.items = items;
            this.loading.hideLoadingWithTime(1000);
            this.completeRefresher();
          })
          .catch((error) => {
            this.loading.hideLoading();
            this.completeRefresher();
          })
      })
  }

  openProdutoDetail(item: ProdutoDTO): void {
    this.navCtrl.push('ProdutoDetailPage', { produto: item });
  }

  private redirectIfUndefined(): void {
    this.loading.hideLoading();
    this.navCtrl.setRoot('CategoriasPage');
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.loadingProdutos();
  }

  private completeRefresher(): void {
    if (this.refresher != undefined) {
      this.refresher.complete();
    } 
  }

}
