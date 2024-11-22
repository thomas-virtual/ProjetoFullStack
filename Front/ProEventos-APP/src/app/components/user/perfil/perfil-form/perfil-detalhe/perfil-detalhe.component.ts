import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorHelp } from 'src/helpers/ValidatorHelp';
import { UserUpdate } from 'src/models/identity/UserUpdate';
import { AccountService } from 'src/services/AccountService.service';
import { PalestranteService } from 'src/services/PalestranteService.service';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss']
})
export class PerfilDetalheComponent implements OnInit {

  public perfilDetalheForm: FormGroup = new FormGroup({});
  public userUpdate = {} as UserUpdate;

  @Output() changeFormValue = new EventEmitter();

  constructor(
    private toastr: ToastrService, 
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private palestranteService: PalestranteService,
    private router: Router
  ) { }

  ngOnInit() {
    this.validation()
    this.carregarUsuarioDetalhe()
    this.verificaForm();
  }

  verificaForm(): void {
    this.perfilDetalheForm.valueChanges
      .subscribe(() => this.changeFormValue.emit({...this.perfilDetalheForm.value}))
  }

  validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorHelp.mustMatch('password', 'confirmPassword')
    }

    this.perfilDetalheForm = new FormGroup({
      username: new FormControl(''),
      imagemURL: new FormControl(''),
      titulo: new FormControl('NaoInformado', [Validators.required, ]),
      primeiroNome: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20) ]),
      ultimoNome: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*\@[a-z]*\.com?/)]),
      phoneNumber: new FormControl('', [Validators.required, ]),
      funcao: new FormControl('NaoInformado', [Validators.required, ]),
      descricao: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, formOptions)
  }

  private carregarUsuarioDetalhe(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno: UserUpdate) => {
        this.userUpdate = userRetorno;
        this.perfilDetalheForm.patchValue(this.userUpdate)
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
    var userUpdate = {...this.perfilDetalheForm.value};

    if(this.perfilDetalheForm.controls.funcao.value == 'Palestrante'){
      this.palestranteService.addPalestrante().subscribe(
        () => this.toastr.success("Sucesso ao adicionar palestrante", "Sucesso"),
        (error) => {
          console.error(error)
          this.toastr.error("Erro ao adicionar palestrante", "Erro")
        }
      )
    }

    this.accountService.updateUser(userUpdate).subscribe(
      () => {
        this.toastr.success("Usuário atualizado com sucesso", "Sucesso")
        this.carregarUsuarioDetalhe();
      },
      (error) => {
        console.error(error)
        this.toastr.error("Erro ao tentar atualizar usuário", "Erro")
      },
    ).add(() => this.spinner.hide())
  }
}
