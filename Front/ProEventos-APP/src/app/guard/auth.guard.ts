import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from 'src/services/AccountService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router, 
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  canActivate(): boolean {
    if(localStorage.getItem('user') !== null ) {
      return true;
    }

    this.toastr.info("Usuário não autenticado!")
    this.router.navigateByUrl('user/registration')
    return false;
  }
  
}
