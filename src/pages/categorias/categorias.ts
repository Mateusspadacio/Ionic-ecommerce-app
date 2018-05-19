import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { LoadingControllerHelper } from '../../controllers/loading.controller';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html'
})
export class CategoriasPage {

  public categoriasDTO: CategoriaDTO[] = [];
  public semImagem: string = "/assets/imgs/white.jpg";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public categoriaService: CategoriaService,
    public loading: LoadingControllerHelper) {
  }

  ionViewDidLoad() {
    this.loading.showLoading();
    this.loadingCategories();
  }

  private loadingCategories(): void {
    this.categoriaService.findAll()
      .then((categorias: CategoriaDTO[]) => {
        this.categoriasDTO = categorias;
        this.loading.hideLoadingWithTime(1000);
      },
        (error: Error) => {
          this.loading.hideLoadingWithTime(1000);
        });
  }

}
