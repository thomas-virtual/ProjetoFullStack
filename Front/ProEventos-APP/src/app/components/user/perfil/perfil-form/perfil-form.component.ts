import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
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
  public usuario = {} as UserUpdate;
  public file: File;
  public imagemURL: string = '';

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    
  }

  setFormValue(usuario: UserUpdate): void {
    this.usuario = usuario;
    if(this.usuario.imagemURL)
      this.imagemURL = environment.apiURL + `/resources/perfil/${this.usuario.imagemURL}`
    else
      this.imagemURL = "../../../../../assets/semImagem.png"
  }

  isPalestrante(): boolean {
    return this.usuario.funcao === 'Palestrante';
  }

  onFileChange(evt: any): void {
    const reader: FileReader = new FileReader();

    reader.onload = (evt: any) => this.imagemURL = evt.target.result;

    console.log(evt.target.result)

    this.file = evt.target.files;
    reader.readAsDataURL(this.file[0]);

    this.upload()
  }

  upload(): void {
    this.spinner.show();
    this.accountService.postUpload(this.file).subscribe(
      (res) => {
        this.toastr.success("Imagem de usuário atualizada com sucesso!", "Sucesso")
      },
      () => {
        this.toastr.error("Ocorreu um erro ao atualizar imagem de usuário!", "Erro")
      }
    ).add(() => this.spinner.hide())
  }
}
