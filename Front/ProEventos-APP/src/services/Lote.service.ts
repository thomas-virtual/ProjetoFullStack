import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { take as tk } from 'rxjs/operators'
import { Lote } from 'src/models/Lote';

@Injectable()
export class LoteService {

    baseURL = 'https://localhost:5001/api/lotes';
    constructor(private http: HttpClient) { }
  
    public getLotesByEventoId(eventoId: number): Observable<Lote[]> {
      return this.http
      .get<Lote[]>(`${this.baseURL}/${eventoId}`)
      .pipe(tk(2));
    }
    public getLoteByIds(eventoId: number, loteId: number): Observable<Lote> {
      return this.http
      .get<Lote>(`${this.baseURL}/${eventoId}/${loteId}`)
      .pipe(tk(2));;
    }
    public saveLotes(eventoId: number, lotes: Lote[]): Observable<Lote[]> {
      return this.http
      .put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes)
      .pipe(tk(2));
    }
    public deleteLote(eventoId: number, loteId: number): Observable<any> {
      return this.http
      .delete<boolean>(`${this.baseURL}/${eventoId}/${loteId}`)
      .pipe(tk(2));
    }
}

