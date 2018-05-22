import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import * as firebase from 'firebase';
import { ProdutoDTO } from "../../models/produto.dto";
import { API_CONFIG } from "../../config/api.config";

@Injectable()
export class ProdutoService {

    constructor(public http: HttpClient) { }

    public findByCategoria(id: string, page: number = 0, linesPerPage: number = 24): Observable<Object> {
        return this.http.get<Object>(`${API_CONFIG.baseUrl}/produtos?categorias=${id}&page=${page}&linesPerPage=${linesPerPage}`).retry(20);
    }

    public findImages(produtos: ProdutoDTO[], startIndex: number = 0): Promise<ProdutoDTO[]> {
        console.log(startIndex + " - " + produtos.length)
        return new Promise((resolve, reject) => {
            for (let i = startIndex; i < produtos.length; i++) {
                this.getImage(produtos[i], true);
            }
            
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