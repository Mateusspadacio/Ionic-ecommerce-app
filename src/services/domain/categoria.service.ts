import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";

import { API_CONFIG } from "../../config/api.config";
import { CategoriaDTO } from "../../models/categoria.dto";
import * as firebase from 'firebase';

@Injectable()
export class CategoriaService {

    constructor(public http: HttpClient) {
    }

    findAll(): Promise<CategoriaDTO[]> {
        return new Promise((resolve, reject) => {
            this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`).toPromise()
                .then((categoriasDTO: CategoriaDTO[]) => {

                    categoriasDTO.forEach(c => {
                        let fileName = `cat${c.id}.jpg`;
                        firebase.storage().ref()
                            .child(`categories/${fileName}`)
                            .getDownloadURL()
                            .then((url: string) => {
                                c.urlImage = url;
                            })
                            .catch((error: any) => {})
                    });
                    resolve(categoriasDTO);
                }).catch((error) => {
                    reject(error);
                })
        })
    }
}