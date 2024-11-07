import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/models/Evento';
import { EventoService } from 'src/services/EventoService.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  public modalRef?: BsModalRef;
  public eventos: Evento[] = [];
  public filteredEvents: Evento[] = [];
  public isToggled: boolean = false;
  private _listFilter: string = '';
  
  constructor(
    private eventoService: EventoService, 
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
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
      },
      error: (error: any) => {
        this.spinner.hide()
        this.toastr.error("Erro ao tentar carregar Eventos", "Erro!")
        console.log(error)
      },
      complete: () => this.spinner.hide()
    })
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success("O evento foi deletado com sucesso", "Deletado!")
  }
 
  decline(): void {
    this.modalRef?.hide();
  }

}
