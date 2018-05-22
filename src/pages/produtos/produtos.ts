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
  infiniteScroll: any;
  page: number = 0;
  totalPages: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loading: LoadingControllerHelper) {
  }

  ionViewDidLoad() {
    this.loading.showLoading();
    this.loadingProdutos();
  }

  openProdutoDetail(item: ProdutoDTO) {
    this.navCtrl.push('ProdutoDetailPage', { produto: item });
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.refresher = refresher;
    this.loadingProdutos();
  }

  doInfinite(infiniteScroll) {
    if (this.page < this.totalPages) {
      this.page++;
      this.infiniteScroll = infiniteScroll;
      this.loadingProdutos();
    }
  }

  private loadingProdutos(): void {
    this.categoria = this.navParams.get('categoria');
    if (this.categoria == undefined) {
      this.redirectIfUndefined();
      return;
    }

    this.produtoService.findByCategoria(this.categoria.id, this.page, 10)
      .subscribe((items: any) => {
        this.totalPages = items.totalPages;
        let startIndex = this.items.length;
        this.items = this.items.concat(items.content);
        this.produtoService.findImages(this.items, startIndex)
          .then((items) => {
            this.items = items;
            this.loading.hideLoadingWithTime(1000);
            this.completeRefresher();
            this.completeInfinityScroll();
          })
          .catch((error) => {
            this.loading.hideLoading();
            this.completeRefresher();
            this.completeInfinityScroll();
          })
      },
      error => {
        this.loading.hideLoading();
      });
  }

  private completeRefresher(): void {
    if (this.refresher != undefined) {
      this.refresher.complete();
    }
  }

  private completeInfinityScroll(): void {
    if (this.infiniteScroll != undefined) {
      this.infiniteScroll.complete();
    }
  }

  private redirectIfUndefined(): void {
    this.loading.hideLoading();
    this.navCtrl.setRoot('CategoriasPage');
  }

}
