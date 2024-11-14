import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorHelp } from 'src/helpers/ValidatorHelp';
import { UserUpdate } from 'src/models/identity/UserUpdate';
import { AccountService } from 'src/services/AccountService.service';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss']
})
export class PerfilFormComponent implements OnInit {
  public perfilForm: FormGroup = new FormGroup({});
  public userUpdate = {} as UserUpdate;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.validation()
    this.carregarUsuario();
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        this.userUpdate = userRetorno;
        this.perfilForm.patchValue(this.userUpdate)
        this.toastr.success("Usuário carregado com sucesso", "Sucesso")
      },
      (error) => {
        console.error(error)
        this.toastr.error("Erro ao carregar usuário")
        this.router.navigateByUrl('dashboard')
      },
    ).add(() => this.spinner.hide());
  }

  public atualizarUsuario(): void {
    this.spinner.show()
    var userUpdate = {...this.perfilForm.value};
    this.accountService.updateUser(userUpdate).subscribe(
      () => {
        this.toastr.success("Usuário atualizado com sucesso", "Sucesso")
        this.carregarUsuario();
      },
      (error) => {
        console.error(error)
        this.toastr.error("Erro ao tentar atualizar usuário", "Erro")
      },
    ).add(() => this.spinner.hide())
  }
  
  validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorHelp.mustMatch('password', 'confirmPassword')
    }

    this.perfilForm = new FormGroup({
      username: new FormControl(''),
      titulo: new FormControl('NaoInformado', [Validators.required, ]),
      primeiroNome: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
      ultimoNome: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*\@[a-z]*\.com?/)]),
      phoneNumber: new FormControl('', [Validators.required, ]),
      funcao: new FormControl('NaoInformado', [Validators.required, ]),
      descricao: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, formOptions)
  }
}
