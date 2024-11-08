import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorHelp } from 'src/helpers/ValidatorHelp';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss']
})
export class PerfilFormComponent implements OnInit {
  public perfilForm: FormGroup = new FormGroup({})
  constructor() { }

  ngOnInit(): void {
    this.validation()
  }
  
  validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorHelp.mustMatch('senha', 'confirmaSenha')
    }

    this.perfilForm = new FormGroup({
      titulo: new FormControl('', [Validators.required, ]),
      nome: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
      ultimoNome: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*\@[a-z]*\.com?/)]),
      telefone: new FormControl('', [Validators.required, ]),
      funcao: new FormControl('', [Validators.required, ]),
      senha: new FormControl('', [Validators.required, Validators.minLength(10)]),
      confirmaSenha: new FormControl('', [Validators.required, Validators.minLength(10)]),
    }, formOptions)
  }

}
