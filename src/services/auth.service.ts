import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthService {

    constructor(public http: HttpClient){}

    // observe: retornar as resposta do cabeçalho
    // responseType: no caso desta URL, ela ira retornar um corpo vazio
    // quando esse corpo é retornado o angular tenta fazer o parse para json
    // e não consegue e acaba dando erro, por isso é necessario especificar que
    // o retorno do arquivo é do tipo texto, dessa forma desabilita o parse do angular

    authenticate(creds: CredenciaisDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/login`, 
        creds,
        {
            observe: 'response',
            responseType: 'text'
        })
    }

}