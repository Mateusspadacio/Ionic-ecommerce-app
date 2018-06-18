import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CidadeDTO } from '../../models/cidade.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { FieldMessage } from '../../models/field.message';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  formGroup: FormGroup;

  private estadosList: EstadoDTO[] = [];
  private cidadesList: CidadeDTO[] = [];
  private isButtonClicked: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private menu: MenuController,
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    public clienteService: ClienteService,
    public auth: AuthService) {

      this.formGroup = this.formBuilder.group({
        nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['', [Validators.required, Validators.email]],
        tipo: ['1', [Validators.required]],
        cpfOuCnpj: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
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

  signupUser(): void {
    this.isButtonClicked = true;
    let cliente: ClienteDTO = this.formGroup.value;

    this.clienteService.save(cliente)
    .subscribe(() => {
      let creds: CredenciaisDTO = {email: this.formGroup.value.email, senha: this.formGroup.value.senha}
      this.auth.authenticate(creds)
      .subscribe((response: any) => {
        this.redirect(response);
      },
      error => {
        this.isButtonClicked = false;
      });
    },
    error => {
      this.isButtonClicked = false;
      this.showErrors(error.errors);
    });
  }

  private redirect(response: any): void {
    this.isButtonClicked = false;
    this.auth.successfulLogin(response.headers.get('authorization'));
    this.navCtrl.setRoot('CategoriasPage');
  }

  updateCidades(): void {
    this.estadoService.findCidadesByEstado(this.formGroup.value.estadoId)
    .subscribe((cidades: CidadeDTO[]) => {
      this.cidadesList = cidades;
      this.formGroup.controls.cidadeId.setValue(null);
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

  preventCharacters(evt: any): void {
    let k = evt.keyCode;

    if (k == 189 || k == 69 || k == 188 || k == 190) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  private showErrors(fieldMessage: FieldMessage[]): void {
    console.log(fieldMessage)
    fieldMessage.forEach(fm => {
      this.formGroup.controls[fm.fieldName].markAsPending();
    })
  }

}
