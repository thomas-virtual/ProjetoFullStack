import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { add } from 'ngx-bootstrap/chronos';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RedeSocial } from 'src/models/RedeSocial';
import { RedeSocialService } from 'src/services/RedeSocialService.service';

@Component({
  selector: 'app-redeSocial-detalhe',
  templateUrl: './redeSocial-detalhe.component.html',
  styleUrls: ['./redeSocial-detalhe.component.scss']
})
export class RedeSocialDetalheComponent implements OnInit {
  public modalRef: BsModalRef
  public formRS: FormGroup;
  @Input() public eventoId = 0;
  public redeSocialAtual = {id: 0, nome: '', index: 0}


  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private redeSocialService: RedeSocialService
  ) { }

  public get redesSociais(): FormArray {
    return this.formRS.get('redesSociais') as FormArray
  }

  ngOnInit() {
    this.validation()
    this.carregarRedesSociais()
  }
  
  cssValidator(campoForm: FormControl | AbstractControl): any {
    return {'is-invalid': campoForm.errors && campoForm.touched}
  }

  validation(): void {
    this.formRS = this.fb.group({
      redesSociais: this.fb.array([])
    })
  }

  retornaTitulo(nomeRedeSocial: string): string {
    return nomeRedeSocial === null || nomeRedeSocial === '' ? "Nome da Rede Social" : nomeRedeSocial
  }

  carregarRedesSociais(): void {
    let origem = 'palestrante'

    if(this.eventoId !== 0) origem = 'eventos'

    this.spinner.show()
    this.redeSocialService.getRedesSociais(origem, this.eventoId)
      .subscribe(
        (redesSociais: RedeSocial[]) => {
          console.log(redesSociais)
          redesSociais.forEach(rs => {
            this.redesSociais.push(this.criarRedesSociais(rs))
            this.toastr.success("Sucesso ao carregar redes sociais", "Sucesso")
          })
        },
        (error) => {
          console.error(error)
          this.toastr.error("Error ao carregar redes sociais", "Erro")
        }
      ).add(() => this.spinner.hide())
  }
  
  adicionarRedeSocial(): void {
    this.redesSociais.push(
      this.criarRedesSociais({id: 0} as RedeSocial)
    )
  }

  public criarRedesSociais(redeSocial: RedeSocial): FormGroup {
    return this.fb.group({
      id: [redeSocial.id], 
      nome: [redeSocial.nome], 
      url: [redeSocial.url], 
    })
  }

  removerRedeSocial(template: TemplateRef<any>, index: number): void {

    this.redeSocialAtual.id = this.redesSociais.get(index + '.id').value
    this.redeSocialAtual.nome = this.redesSociais.get(index + '.nome').value
    this.redeSocialAtual.index = index

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }

  salvarRedesSociais(): void {
    let origem = 'palestrante'

    if(this.eventoId !== 0) origem = 'eventos'

    if(this.formRS.controls.redesSociais.valid){
      this.spinner.show()
      this.redeSocialService.saveRedesSociais(origem, this.eventoId, this.formRS.value.redesSociais)
        .subscribe(
          (res) => {
            console.log(res)
            this.toastr.success("Sucesso ao adicionar rede social", "Sucesso")
          },
          (error) => {
            console.error(error)
            this.toastr.error("Erro ao salvar rede social", "Erro")
          },
        ).add(() => this.spinner.hide())
    }
  }

  confirmDeleteRedeSocial(): void {
    let origem = 'palestrante'

    if(this.eventoId !== 0) origem = 'eventos'

    this.spinner.show()
    this.redeSocialService.deleteRedesSociais(origem, this.eventoId , this.redeSocialAtual.id)
      .subscribe(
        () => {
          this.toastr.success("Sucesso ao deletar rede social", "Sucesso")
          this.redesSociais.removeAt(this.redeSocialAtual.index)
          this.modalRef.hide()
        },
        (error) => {
          console.error(error)
          this.toastr.error("Erro ao deletar rede social", "Erro")
        },
      ).add(() => this.spinner.hide())
  }

  declineDeleteRedeSocial(): void {
    this.modalRef.hide()
  }
}
