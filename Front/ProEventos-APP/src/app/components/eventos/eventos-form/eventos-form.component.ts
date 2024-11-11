import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale, updateLocale } from 'ngx-bootstrap/chronos';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/services/EventoService.service';
import { Evento } from 'src/models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);
@Component({
  selector: 'app-eventos-form',
  templateUrl: './eventos-form.component.html',
  styleUrls: ['./eventos-form.component.scss']
})
export class EventosFormComponent implements OnInit {
  evento = {} as Evento
  estadoSalvar = 'post'
  form: FormGroup = new FormGroup({});
  bsConfig: any =  {
    isAnimeted: true,
    containerClass: 'theme-default',
    showWeekNumbers: false,
    dataInputFormat: 'DD/MM/YYYY hh:mm a'
  }
  
  constructor(
    private localeService: BsLocaleService,
    private activeRoute: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) 
  { 
    localeService.use('pt-br');
  }
  
  ngOnInit(): void {
    this.validation()
    this.carregarEvento()
  }
  
  salvarAlteracao(): void {
    var eventoParamId = this.activeRoute.snapshot.paramMap.get('id')
    console.log(eventoParamId)
    if(eventoParamId == null) {
      this.adicionarEvento();
    } else {
      this.atualizarEvento(+eventoParamId);
    }
  }
  
  carregarEvento(): void {
    var eventoParamId = this.activeRoute.snapshot.paramMap.get('id')
    
    if(eventoParamId !== null) {
      this.eventoService.getEventoById(+eventoParamId).subscribe({
        next: (response) => {
          this.evento = {...response}
          this.form.patchValue(this.evento);
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
  
  adicionarEvento(): void {
    this.spinner.show()
    
    if(this.form.valid) {
      
      this.evento = {...this.form.value}
      
      this.eventoService.addEvento(this.evento).subscribe({
        next: () => this.toastr.success("Evento adicionado com sucesso", "Sucesso!"),
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

  atualizarEvento(id: number): void {
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
          this.resetForm()
        },
      })
    }
  }

  validation():void {
    this.form = new FormGroup({
      tema: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      local: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      dataEvento: new FormControl('', [Validators.required, Validators.minLength(6)]),
      qtdPessoas: new FormControl('', [Validators.required, Validators.min(50)]),
      telefone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]*\@[a-z]*\.com?/)]),
      imagemURL: new FormControl('', [Validators.required]),
    })
  }
  
  resetForm(): void {
    this.form.reset()
  }
}
