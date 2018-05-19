import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import * as firebase from 'firebase';

@Injectable()
export class ClienteService {

    constructor(public http: HttpClient,
                public storage: StorageService){}

    findByEmail(email: string): Observable<ClienteDTO> {
        return this.http.get<ClienteDTO>(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`)
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
            .catch((error: any) => {});
        });
    }


}