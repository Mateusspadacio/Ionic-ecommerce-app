import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Platform } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { LoadingControllerHelper } from '../../controllers/loading.controller';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ToastControllerHelper } from '../../controllers/toast.controller';
import { ToastConfig } from '../../config/toast.config';
import { ImageUtilService } from '../../services/image-util.service';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  animations: [
    trigger('picture-opc', [
      state('active',
        style({
          height: '30%'
        })),
      state('inactive',
        style({
          height: '0%'
        })),
      transition('inactive => active', animate('400ms 0s ease-in')),
      transition('active => inactive', animate('400ms 0s ease-in'))
    ])
  ]
})
export class ProfilePage {

  @ViewChild('fileInput') fileInput: ElementRef;
  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE
  }

  picture: any;
  pictureOpc: string = 'inactive';
  over: string = "none";

  cliente: ClienteDTO = {
    email: '', nome: '', id: ''
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public loading: LoadingControllerHelper,
    public camera: Camera,
    public ng2Img: Ng2ImgMaxService,
    public toast: ToastControllerHelper,
    public imgUtilService: ImageUtilService,
    public platform: Platform) {

    //this.options.destinationType = this.platform.is('android') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.NATIVE_URI;

  }

  ionViewCanEnter(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loading.showLoading();
      this.loadingProfile();
      resolve();
    });
  }

  ionViewDidLoad() {
  }

  showOrHideOver() {
    this.over = this.over == "none" ? "block" : "none";
    document.getElementById('over').style.display = this.over;
  }

  openOptions() {
    this.showOrHideOver();
    this.pictureOpc = this.pictureOpc == 'active' ? 'inactive' : 'active';
  }

  getCameraPicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      this.picture = this.imgUtilService.dataUriToBlob(imageData);
      this.fileUpload();
    }, (err) => {
    });
  }

  openGaleria() {
    this.fileInput.nativeElement.click();
  }

  getInputFile(event) {
    this.picture = (<HTMLInputElement>event.target).files[0];
    this.fileUpload();
  }

  fileUpload() {
    this.loading.initSimpleLoading();
    this.loading.showSimpleLoading();
    this.ng2Img.resizeImage(this.picture, 250, 250)
      .subscribe((result) => {
        this.clienteService.uploadPicture(result, this.cliente.id)
          .then((response) => {
            this.loadingProfile();
            this.openOptions();
            this.loading.hideSimpleLoading();
          })
          .catch((e) => {
            this.toast.showToast(new ToastConfig('Não foi possível fazer o upload da imagem', undefined, "bottom", ['error'], true));
            this.loading.hideSimpleLoading();
          });
      },
        error => {
          this.loading.hideSimpleLoading();
        })
  }

  private loadingProfile(): void {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe((cliente) => {
          this.cliente = cliente as ClienteDTO;
          this.getImageProfile();
        },
          (error: any) => {

            if (error.status == 403) {
              this.redirectIfInvalid();
            } else {
              this.loading.hideLoadingWithTime(1000);
            }

          })
    } else {
      this.redirectIfInvalid();
    }

  }

  private getImageProfile(): void {
    this.clienteService.findImageUserProfile(this.cliente.id)
      .then((url: string) => {
        this.cliente.imageUrl = url;
        this.loading.hideLoadingWithTime(1000);
      })
      .catch((error: any) => {
        this.loading.hideLoadingWithTime(1000);
      })
  }

  private redirectIfInvalid(): void {
    this.loading.hideLoading();
    this.navCtrl.setRoot('HomePage');
  }

}
