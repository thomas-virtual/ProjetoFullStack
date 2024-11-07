import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public isCollapsed: boolean = false;
  
  constructor(private router: Router) { }

  public ngOnInit(): void {
  }

  mostrarNavbar():boolean {
    return this.router.url !== '/user/login' ? true : false
  }
}
