import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { UserLogin } from 'src/models/identity/UserLogin';
import { AccountService } from 'src/services/AccountService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public model = {} as UserLogin;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  public login(): void {
    
    this.spinner.show()
    this.accountService.login(this.model).subscribe(
      () => {
        this.toastr.success("Usuário autenticado com sucesso", "Sucesso")
        this.router.navigate(['/dashboard'], {skipLocationChange: false})
      },
      (error) => {
        this.toastr.error("Erro ao tentar autenticar usuário.", "Erro de Login")
        if(error.status == 401) 
          console.error("Usuário ou senha inválidos")
        else 
          console.error(error)
      }
    ).add(() => this.spinner.hide())
  }

}
