import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PaginatedResult } from 'src/models/Pagination';
import { Palestrante } from 'src/models/Palestrante';

@Injectable({
  providedIn: 'root'
})
export class PalestranteService {
  baseURL = 'https://localhost:5001/api/Palestrantes';
  constructor(private http: HttpClient) { }

  public getAll(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Palestrante[]>> {
    const paginatedResult: PaginatedResult<Palestrante[]> = new PaginatedResult<Palestrante[]>();

    let params = new HttpParams;

    if(page != null && itemsPerPage != null){
      params = params.append('pagenumber', page.toString());
      params = params.append('pagesize', itemsPerPage.toString());
    }

    if(term != null && term != ''){
      params = params.append('term', term)
    }

    return this.http
      .get<Palestrante[]>(`${this.baseURL}/all`, {observe: 'response', params})
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body;
          if(response.headers.has('Pagination')){
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        })
      );
  }
  public getPalestrantes(): Observable<Palestrante> {
    return this.http.get<Palestrante>(`${this.baseURL}`);
  }
  public addPalestrante(): Observable<Palestrante> {
    return this.http.post<Palestrante>(`${this.baseURL}`, {} as Palestrante)
  }
  public updatePalestrante(novoPalestrante: Palestrante): Observable<Palestrante> {
    return this.http.put<Palestrante>(`${this.baseURL}`, novoPalestrante);
  }
}
