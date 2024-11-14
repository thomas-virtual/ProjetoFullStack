import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ValidatorHelp } from 'src/helpers/ValidatorHelp';
import { AccountService } from 'src/services/AccountService.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup = new FormGroup({});
  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.validation()
  }

  validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorHelp.mustMatch('password', 'confirmPassword')
    }

    this.registrationForm = new FormGroup({
      primeiroNome: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      ultimoNome: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*\@[a-z]*\.com?/)]),
      username: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    }, formOptions)
  }

  register(): void {
    var user = {...this.registrationForm.value}
    this.accountService.register(user).subscribe(
      (response) => {
        this.toastr.success("Sucesso ao registrar usuário", "Usuário cadastrado")
        this.router.navigateByUrl('/dashboard')
      },
      (error) => {
        this.toastr.error("Erro ao cadastrar usuário", "Erro")
        console.error(error)
      },
    )
  }

}
