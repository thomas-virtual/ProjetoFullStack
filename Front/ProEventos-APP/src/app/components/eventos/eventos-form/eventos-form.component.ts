import { Component, OnInit, TemplateRef } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale, updateLocale } from 'ngx-bootstrap/chronos';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/services/EventoService.service';
import { Evento } from 'src/models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Lote } from 'src/models/Lote';
import { LoteService } from 'src/services/Lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

defineLocale('pt-br', ptBrLocale);
@Component({
  selector: 'app-eventos-form',
  templateUrl: './eventos-form.component.html',
  styleUrls: ['./eventos-form.component.scss']
})
export class EventosFormComponent implements OnInit {
  public evento = {} as Evento
  public eventoId: number;
  public imagemURL = 'assets/foto.png'
  public loteAtual = {id: 0, nome: '', index: 0}
  public modalRef: BsModalRef
  public estadoSalvar = 'post'
  public form: FormGroup = new FormGroup({});
  public file: File;
  
  public bsConfig: any =  {
    isAnimeted: true,
    containerClass: 'theme-default',
    showWeekNumbers: false,
    dataInputFormat: 'DD/MM/YYYY hh:mm a'
  }

  public bsConfigLote: any =  {
    isAnimeted: true,
    containerClass: 'theme-default',
    showWeekNumbers: false,
    dataInputFormat: 'DD/MM/YYYY'
  }
  
  constructor(
    private localeService: BsLocaleService,
    private activeRoute: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private loteService: LoteService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService
  ) 
  { 
    localeService.use('pt-br');
  }
  
  public ngOnInit(): void {
    this.validation()
    this.carregarEvento()
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray
  }
  
  get modoEditar(): boolean {
    return this.estadoSalvar === 'put'
  }

  public retornaTitulo(nomeLote: string): string {
    return nomeLote === null || nomeLote === '' ? "Nome do Lote" : nomeLote
  }

  public mudarValorData(event: Date, index: number, tipo: string): void {
    this.lotes.value[index][tipo] = event;
  }

  public validation():void {
    this.form = new FormGroup({
      tema: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      local: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      dataEvento: new FormControl('', [Validators.required, Validators.minLength(6)]),
      qtdPessoas: new FormControl('', [Validators.required, Validators.min(50)]),
      telefone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*\@[a-z]*\.com?/)]),
      imagemURL: new FormControl(''),
      lotes: this.fb.array([])
    })
  }

  public resetForm(): void {
    this.form.reset()
  }

  public carregarEvento(): void {
    this.eventoId = +this.activeRoute.snapshot.paramMap.get('id');

    if(this.eventoId !== null && this.eventoId !== 0) {
      this.estadoSalvar = 'put' 
      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (response) => {
          this.evento = {...response}
          this.form.patchValue(this.evento);
          if(this.evento.imagemURL !== ''){
            this.imagemURL = `${environment.apiURL}/resources/images/${this.evento.imagemURL}`
          }
          this.carregarLotes()
          this.spinner.show()
        },
        error: (error: any) => {
          console.error(error)
          this.spinner.hide()
        },
        complete: () => this.spinner.hide()
      })
    }
  }

  public salvarAlteracao(): void {
    this.eventoId = +this.activeRoute.snapshot.paramMap.get('id')
    if(this.eventoId !== null && this.eventoId === 0) {
      this.adicionarEvento();
    } else {
      this.atualizarEvento(+this.eventoId);
    }
  }
  
  public adicionarEvento(): void {
    this.spinner.show()
    
    if(this.form.valid) {
      
      this.evento = {...this.form.value}
      
      this.eventoService.addEvento(this.evento).subscribe({
        next: (response: Evento) => {
          this.toastr.success("Evento adicionado com sucesso", "Sucesso!")
          this.router.navigate([`eventos/detalhe/${response.eventoId}`])
        },
        error: (error) => {
          console.log(error)
          this.toastr.error("Erro ao adicionar evento", "Erro")
          this.spinner.hide()
        },
        complete: () => {
          this.spinner.hide()
          this.resetForm()
        },
      })
    }
  }

  public atualizarEvento(id: number): void {
    this.spinner.show()
    
    if(this.form.valid) {
      
      this.evento = {eventoId: id, ...this.form.value}
      
      this.eventoService.updateEvento(this.evento.eventoId, this.evento).subscribe({
        next: () => this.toastr.success("Evento atualizado com sucesso", "Sucesso!"),
        error: (error) => {
          console.log(error)
          this.toastr.error("Erro ao atualizar evento", "Erro")
          this.spinner.hide()
        },
        complete: () => {
          this.spinner.hide()
        },
      })
    }
  }
  
  public adicionarLotes(): void {
    this.lotes.push(
      this.criarLotes({id: 0} as Lote)
    )
  }

  public criarLotes(lote: Lote): FormGroup {
    return this.fb.group({
        id: [lote.id],
        nome: [lote.nome, Validators.required],
        quantidade: [lote.quantidade, Validators.required],
        preco: [lote.preco, Validators.required],
        dataInicio: [lote.dataInicio],
        dataFim: [lote.dataFim],
        eventoId: [this.eventoId]
    })
  }

  public salvarLotes(): void {
    this.spinner.show()
    if(this.form.controls.lotes.valid) {
      this.loteService.saveLotes(this.eventoId, this.form.value.lotes).subscribe(
        (response) => {
          this.toastr.success("Sucesso ao salvar lote!", "Sucesso")
        },
        (error) => {
          console.error(error);
          console.log(error)
          this.toastr.error("Erro ao salvar lote!", "Erro")
        },
      ).add(() => this.spinner.hide())
    }
  }

  public carregarLotes(): void {
    this.spinner.show()
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (response) => {
        response.forEach(lote => {
          this.lotes.push(this.criarLotes(lote))
        })
      },
      (error) => {
        console.error(error)
      },
    ).add(() => this.spinner.hide())
  }

  public removerLote(template: TemplateRef<any>, index: number): void {

    this.loteAtual.id = this.lotes.get(index + '.id').value
    this.loteAtual.nome = this.lotes.get(index + '.nome').value
    this.loteAtual.index = index

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'})
  }

  public confirmDeleteLote(): void {
    this.spinner.show()
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toastr.success(`${this.loteAtual.nome} deletado com sucesso.`, "Sucesso!")
        this.lotes.removeAt(this.loteAtual.index)
        this.modalRef.hide()
      },
      () => {
        this.toastr.error(`Erro ao tentar deletar o ${this.loteAtual.nome}`)
      },
    ).add(() => this.spinner.hide())
  }

  public declineDeleteLote(): void {
    this.modalRef.hide()
  }

  onFileChange(event: any): void {
    var reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = event.target.files;
    reader.readAsDataURL(this.file[0]);
    console.log(this.file, event)
    this.uploadImage();
  }

  uploadImage(): void {
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      (response) => {
        this.toastr.success("Imagem atualizada com sucesso", "Sucesso")
        this.carregarEvento();
      },
      (error) => {
        console.log(error)
        this.toastr.error("Erro ao tentar atualizar imagem", "Erro")
      },
    ).add(() => this.spinner.hide())
  }
}
