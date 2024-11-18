import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Evento } from 'src/models/Evento';
import { PaginatedResult, Pagination } from 'src/models/Pagination';

@Injectable(/*{
  providedIn: 'root'
}*/)
export class EventoService {
  baseURL = 'https://localhost:5001/api/Eventos';
  constructor(private http: HttpClient) { }

  public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Evento[]>> {
    const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();

    let params = new HttpParams;

    if(page != null && itemsPerPage != null){
      params = params.append('pagenumber', page.toString());
      params = params.append('pagesize', itemsPerPage.toString());
    }

    if(term != null && term != ''){
      params = params.append('term', term)
    }

    return this.http
      .get<Evento[]>(`${this.baseURL}`, {observe: 'response', params})
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body;
          if(response.headers.has('Pagination')){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          console.log(paginatedResult)
          return paginatedResult;
        })
      );
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

  public postUpload(eventoId: number, file: File): Observable<Evento> {
    var fileToUpload = file[0] as File;
    var formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
  }
}
