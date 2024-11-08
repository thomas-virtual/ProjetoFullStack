import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorHelp } from 'src/helpers/ValidatorHelp';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup = new FormGroup({});
  constructor() { }

  ngOnInit(): void {
    this.validation()
  }

  validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorHelp.mustMatch('senha', 'confirmaSenha')
    }

    this.registrationForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      ultimoNome: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*\@[a-z]*\.com?/)]),
      user: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      senha: new FormControl('', [Validators.required, Validators.minLength(10)]),
      confirmaSenha: new FormControl('', [Validators.required, Validators.minLength(10)])
    }, formOptions)
  }

}
