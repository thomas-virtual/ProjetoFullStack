import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/identity/User';
import { UserLogin } from 'src/models/identity/UserLogin';
import { UserUpdate } from 'src/models/identity/UserUpdate';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseURL = environment.apiURL + '/api/account'
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  public login(model: UserLogin): Observable<void> {
    return this.http.post<User>(this.baseURL + '/login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response
        if(user) {
          this.setCurrentUser(user) 
        }
      })
    )
  }

  public register(model: User): Observable<void> {
    return this.http.post<User>(this.baseURL + '/register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response
        if(user) {
          this.setCurrentUser(user) 
        }
      })
    )
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null)
    this.currentUserSource.complete();
  }

  public getUser(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(this.baseURL + '/getuser').pipe(take(1));
  }

  public updateUser(model: UserUpdate): Observable<void> {
    return this.http.put(this.baseURL + '/updateuser', model).pipe(
      take(1),
      map((user: UserUpdate) => {
        this.setCurrentUser(user);
      })
    )
  }

}
