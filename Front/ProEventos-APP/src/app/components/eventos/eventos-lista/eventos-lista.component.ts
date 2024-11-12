import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/models/Evento';
import { EventoService } from 'src/services/EventoService.service';

@Component({
  selector: 'app-eventos-lista',
  templateUrl: './eventos-lista.component.html',
  styleUrls: ['./eventos-lista.component.scss']
})
export class EventosListaComponent implements OnInit {

  public modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public eventoId = 0;
  public filteredEvents: Evento[] = [];
  public isToggled: boolean = false;
  private _listFilter: string = '';
  
  constructor(
    private eventoService: EventoService, 
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.getEventos()
    this.spinner.show()
  }

  public get listFilter(): string {
    return this._listFilter
  }

  public set listFilter(filter: string) {
    this._listFilter = filter
    this.filteredEvents = this.listFilter ? this.filterEvents(this.listFilter) : this.eventos
  }

  public filterEvents(filterFor: string): Evento[] {
    filterFor = filterFor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: {tema: string, local: string}) => {
        return evento.tema.toLocaleLowerCase().indexOf(filterFor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filterFor) !== -1
      }
    )
  }

  public alterarImagem(): void {
    this.isToggled = !this.isToggled;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (response: Evento[]) => {
        this.eventos = response
        this.filteredEvents = this.eventos
        console.log(this.eventos)
      },
      error: (error: any) => {
        this.spinner.hide()
        this.toastr.error("Erro ao tentar carregar Eventos", "Erro!")
        console.log(error)
      },
      complete: () => this.spinner.hide()
    })
  }

  openModal(event: any, template: TemplateRef<void>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show()
    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (response) => {
        this.toastr.success("O evento foi deletado com sucesso", "Deletado!")
        this.spinner.hide()
        this.getEventos();
      },
      error: (error) => {
        console.error(error)
        this.toastr.error("Erro ao tentar deletar evento!", "Erro")
        this.spinner.hide()
      },
      complete: () => this.spinner.hide(),
    });
  }
 
  decline(): void {
    this.modalRef?.hide();
  }

  novoEvento():void {
    this.router.navigate([`eventos/detalhe/`])
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`])
  }
}
