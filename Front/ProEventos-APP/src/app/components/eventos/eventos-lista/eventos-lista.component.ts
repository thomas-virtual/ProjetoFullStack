import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Evento } from 'src/models/Evento';
import { PaginatedResult, Pagination } from 'src/models/Pagination';
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
  public isToggled: boolean = false;
  public pagination = {} as Pagination;
  
  constructor(
    private eventoService: EventoService, 
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.pagination = {currentPage: 1, itemsPerPage: 3, totalItems: 1} as Pagination;
    this.getEventos()
    this.spinner.show()
  }

  termoBuscaChanged: Subject<string> = new Subject<string>()

  public filterEvents(evt): void {
    if(this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
      .pipe(debounceTime(1500))
      .subscribe(
        (filtraPor: string) => {
          this.eventoService
          .getEventos(
            this.pagination.currentPage, 
            this.pagination.itemsPerPage,
            filtraPor
          )
          .subscribe(
            (paginatedResult: PaginatedResult<Evento[]>) => {
              this.eventos = paginatedResult.result
              this.pagination = paginatedResult.pagination
            },
            (error) => {
              this.toastr.error("Erro ao carregar eventos", "Erro")
              console.error(error)
            }
          )
        }
      )
    }

    this.termoBuscaChanged.next(evt.value)
  }

  mostraImagem(imagemURL: string): string {
    return imagemURL !== '' 
           ? `${environment.apiURL}/resources/images/${imagemURL}` 
           : '../../../../assets/semImagem.png'
  }

  public alterarImagem(): void {
    this.isToggled = !this.isToggled;
  }

  public getEventos(): void {
    this.eventoService.getEventos(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe({
      next: (response) => {
        this.eventos = response.result
        this.pagination = response.pagination;
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

  pageChanged(event):void {
    this.pagination.currentPage = event.page;
    this.getEventos()
  }
}
