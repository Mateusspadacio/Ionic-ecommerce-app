import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EstadoDTO } from "../../models/estado.dto";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { CidadeDTO } from "../../models/cidade.dto";

@Injectable()
export class EstadoService {

    constructor(private http: HttpClient){}

    public findAll(): Observable<EstadoDTO[]> {
        return this.http.get<EstadoDTO[]>(`${API_CONFIG.baseUrl}/estados`).retry(20);
    }

    public findCidadesByEstado(id: string): Observable<CidadeDTO[]> {
        return this.http.get<CidadeDTO[]>(`${API_CONFIG.baseUrl}/estados/${id}/cidades`).retry(20);
    }
}