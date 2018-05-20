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
                this.getImage(p);
            });
            resolve(produtos);
        });
    }

    private getImage(produto: ProdutoDTO): void {
        firebase.storage().ref()
            .child(`products/prod${produto.id}.jpg`)
            .getDownloadURL()
            .then((url: string) => {
                produto.imageUrl = url;
            })
            .catch((error: any) => {
                produto.imageUrl = '';
            });
    }
}