import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult, Pagination } from 'src/models/Pagination';
import { Palestrante } from 'src/models/Palestrante';
import { PalestranteService } from 'src/services/PalestranteService.service';

@Component({
  selector: 'app-palestrante-lista',
  templateUrl: './palestrante-lista.component.html',
  styleUrls: ['./palestrante-lista.component.scss']
})
export class PalestranteListaComponent implements OnInit {

  constructor(
    private palestranteService: PalestranteService, 
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPalestrantes()
  }

  pagination = {} as Pagination
  palestrantes: Palestrante[]
  termoBuscaChanged: Subject<string> = new Subject<string>();

  public getPalestrantes(): void {
    this.palestranteService.getAll(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe({
      next: (response) => {
        this.palestrantes = response.result
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

  public getImagemURL(imageName: string): string {
    if(imageName)
      return environment.apiURL + `/resources/perfil/${imageName}`
    else
      return '../../../../assets/semImagem.png'
  }

  public filtrarPalestrantes(evt): void {
    if(this.termoBuscaChanged.observers.length === 0) {
      this.termoBuscaChanged
      .pipe(debounceTime(1500))
      .subscribe(
        (filtraPor: string) => {
          this.palestranteService
          .getAll(
            this.pagination.currentPage, 
            this.pagination.itemsPerPage,
            filtraPor
          )
          .subscribe(
            (paginatedResult: PaginatedResult<Palestrante[]>) => {
              this.palestrantes = paginatedResult.result
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
}
