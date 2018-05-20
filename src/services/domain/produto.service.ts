import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import * as firebase from 'firebase';
import { ProdutoDTO } from "../../models/produto.dto";
import { API_CONFIG } from "../../config/api.config";

@Injectable()
export class ProdutoService {

    constructor(public http: HttpClient) { }

    public findByCategoria(id: string): Observable<Object> {
        return this.http.get<Object>(`${API_CONFIG.baseUrl}/produtos?categorias=${id}`).retry(20);
    }

    public findImages(produtos: ProdutoDTO[]): Promise<ProdutoDTO[]> {
        return new Promise((resolve, reject) => {
            produtos.forEach(p => {
                this.getImage(p, true);
            });
            resolve(produtos);
        });
    }

    public getImage(produto: ProdutoDTO, isSmall: boolean = true): Promise<any> {
        let img = `prod${produto.id}${isSmall ? "-small" : ""}.jpg`
        return firebase.storage().ref()
            .child(`products/${img}`)
            .getDownloadURL()
            .then((url: string) => {
                produto.imageUrl = url;
            })
            .catch((error: any) => {
                produto.imageUrl = '';
            });
    }
}