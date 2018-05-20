import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  formGroup: FormGroup;

  private estadosList: EstadoDTO[] = [];
  private cidadesList: CidadeDTO[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    private menu: MenuController,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService) {

      this.formGroup = this.formBuilder.group({
        nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['', [Validators.required, Validators.email]],
        tipo: ['1', [Validators.required]],
        cpfOuCnpj: ['', [Validators.required, Validators.min(11), Validators.max(14)]],
        senha: ['', [Validators.required]],
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: ['', []],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        telefone1: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
        telefone2: ['', []],
        telefone3: ['', []],
        estadoId: [null, [Validators.required]],
        cidadeId: [null, [Validators.required]]
      });
  }

  ionViewDidLoad() {
    this.loadingEstados();
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  signupUser() {
    console.log(this.formGroup)
  }

  updateCidades(): void {
    this.estadoService.findCidadesByEstado(this.formGroup.value.estadoId)
    .subscribe((cidades: CidadeDTO[]) => {
      this.cidadesList = cidades;
      this.formGroup.controls.cidadeId.setValue(this.cidadesList[0].id);
    },
    error => {})
  }

  private loadingEstados(): void {
    this.estadoService.findAll()
    .subscribe((estados: EstadoDTO[]) => {
      this.estadosList = estados;
      this.formGroup.controls.estadoId.setValue(this.estadosList[0].id);
      this.updateCidades();
    },
    error => {})
  }

  preventCharacters(evt: any) {
    let k = evt.keyCode;

    if (k == 189 || k == 69 || k == 188 || k == 190) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

}
