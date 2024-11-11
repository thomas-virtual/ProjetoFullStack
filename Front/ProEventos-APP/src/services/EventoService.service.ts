import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from 'src/models/Evento';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class EventoService {
  baseURL = 'https://localhost:5001/api/Eventos';
  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseURL);
  }
  public getEventosByTema(tema: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseURL}/tema/${tema}`);
  }
  public getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseURL}/${id}`);
  }
  public addEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseURL}`, evento)
  }
  public updateEvento(id: number, novoEvento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseURL}/${id}`, novoEvento);
  }
  public deleteEvento(id: number): Observable<any> {
    return this.http.delete<boolean>(`${this.baseURL}/${id}`)
  }
}
