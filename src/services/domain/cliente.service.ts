import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import * as firebase from 'firebase';
import { ClienteDTO } from "../../models/cliente.dto";
import { StorageService } from "../storage.service";
import { API_CONFIG } from "../../config/api.config";

@Injectable()
export class ClienteService {

    constructor(public http: HttpClient,
        public storage: StorageService) { }

    findByEmail(email: string) {
        return this.http.get(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`)
    }

    findById(id: string) {
        return this.http.get(
            `${API_CONFIG.baseUrl}/clientes/${id}`)
    }

    findImageUserProfile(id: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let imageProfile = `cp${id}.jpg`;
            firebase.storage().ref()
                .child(`profiles/${imageProfile}`)
                .getDownloadURL()
                .then((url: string) => {
                    resolve(url);
                })
                .catch((error: any) => {
                    resolve("");
                });
        });
    }

    save(cliente: ClienteDTO): Observable<any> {
        return this.http.post(`${API_CONFIG.baseUrl}/clientes`, cliente,
            { observe: 'response', responseType: 'text' });
    }

    uploadPicture(picture, id: string) {
        let imageProfile = `cp${id}.jpg`;
        return firebase.storage().ref()
            .child(`profiles/${imageProfile}`)
            .put(picture);
    }

}
