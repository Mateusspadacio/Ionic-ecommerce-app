import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingControllerHelper {

    private loading: any;
    private simpleLoading: any;

    constructor(private loadingCtrl: LoadingController){
        this.initComponent();
    }

    private initComponent(): void {
        this.loading = this.loadingCtrl.create({
            content: ``,
            cssClass: "my-loading",
            showBackdrop: false
          });
    }

    public showLoading(): void {
        this.initComponent();
        this.loading.present();
    }

    public hideLoading(): void {
        this.loading.dismiss();
    }

    public hideLoadingWithTime(time: number): void {
        setTimeout(() => this.hideLoading(), time);
    }

    public showLoadingWithTime(time: number): void {
        setTimeout(() => this.showLoading(), time);
    }

    public initSimpleLoading(): void {
        this.simpleLoading = this.loadingCtrl.create({
            content: ''
          });
    }

    public showSimpleLoading(): void {
        this.simpleLoading.present();
    }

    public hideSimpleLoading(): void {
        this.simpleLoading.dismiss();
    }

}
