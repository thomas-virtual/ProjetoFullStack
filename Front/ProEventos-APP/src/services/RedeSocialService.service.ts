import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RedeSocial } from 'src/models/RedeSocial';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialService {
  private baseURL = environment.apiURL + '/api/redesocial'

  constructor(
    private http: HttpClient
  ) { }

  public getRedesSociais(origem: string, id: number): Observable<RedeSocial[]> {
    let url = id === 0 
                ? this.baseURL + `/${origem}`
                : this.baseURL + `/${origem}/${id}`

    return this.http.get<RedeSocial[]>(url)
  }

  public saveRedesSociais(origem: string, id: number, redeSociais: RedeSocial[]): Observable<RedeSocial[]> {
    let url = id === 0 
                ? this.baseURL + `/${origem}`
                : this.baseURL + `/${origem}/${id}`

    return this.http.put<RedeSocial[]>(url, redeSociais)
  }

  public deleteRedesSociais(origem: string, id: number, redeSocialId: number): Observable<any> {
    let url = id === 0 
                ? this.baseURL + `/${origem}/${redeSocialId}`
                : this.baseURL + `/${origem}/${id}/${redeSocialId}`

    return this.http.delete<any>(url)
  }

}
