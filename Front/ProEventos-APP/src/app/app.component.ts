import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/identity/User';
import { AccountService } from 'src/services/AccountService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ProEventos Site';

  constructor(private accountService: AccountService){}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(): void {
    let user = {} as User;
    if(localStorage.getItem('user'))
      user = JSON.parse(localStorage.getItem('user') ?? '{}')
    else 
      user = null;

    this.accountService.setCurrentUser(user);
  }
}
