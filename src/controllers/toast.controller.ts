import { Injectable } from "@angular/core";
import { ToastController } from "ionic-angular";
import { ToastConfig } from "../config/toast.config";

@Injectable()
export class ToastControllerHelper {

    private toastConfig: ToastConfig;

    constructor(private toastCtrl: ToastController) { }

    public showToast(toastConfiguration: ToastConfig = new ToastConfig()): void {
        this.toastConfig = toastConfiguration;

        if (this.toastConfig.message == "") {
            return;
        }

        if (this.toastConfig.hasCloseButtom) {
            this.toastConfig.duration = undefined;
        }

        let toast = this.toastCtrl.create({
            message: this.toastConfig.message,
            duration: this.toastConfig.duration,
            position: this.toastConfig.position,
            cssClass: this.toastConfig.classes.join(' '),
            showCloseButton: this.toastConfig.hasCloseButtom
        });

        toast.present();
    }

}