import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/services/AccountService.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public isCollapsed: boolean = false;
  
  constructor(
    private router: Router,
    public accountService: AccountService
  ) { }

  public ngOnInit(): void {
  }

  mostrarNavbar():boolean {
    return this.router.url !== '/user/login' ? true : false
  }

  logout(): void {
    this.accountService.logout()
    this.router.navigateByUrl('/user/registration')
  }
}
