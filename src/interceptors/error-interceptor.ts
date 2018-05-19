import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { StorageService } from "../services/storage.service";
import { ToastConfig } from "../config/toast.config";
import { ToastController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private storage: StorageService,
        private toastCtrl: ToastController) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch((error, caught) => {
                let errorObj = error;

                if (errorObj.error) {
                    errorObj = errorObj.error;
                }
    
                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }

                console.log(errorObj.status)
                if (errorObj.status == undefined) {
                    this.handleNoConection();
                }

                switch (errorObj.status) {
                    case 401:
                        this.handle401(errorObj);
                        break;
                    case 403:
                        this.handle403();
                        break;
                    default:
                        this.handleDefaultError(errorObj);
                        break;
                }

                console.log("Erro detectado no interceptor: ", errorObj);
                return Observable.throw(errorObj);
            }) as any;
    }

    private handle403(): void {
        this.storage.setLocalUser(null);
    }

    private handle401(errorObj: any): void {
        this.showToast('E-mail ou senha inválidos');
    }

    private handleNoConection(): void {
        this.showToast('Ocorreu um erro ao tentar comunicar com o servidor, verifique sua conexão com a internet');
    }

    private handleDefaultError(objError: any): void {
        this.showToast(objError.message);
    }

    private showToast(message: string): void {
        let toast = this.toastCtrl.create({
            message: message,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: "Fechar",
            cssClass: "error"
        });

        toast.present();
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};