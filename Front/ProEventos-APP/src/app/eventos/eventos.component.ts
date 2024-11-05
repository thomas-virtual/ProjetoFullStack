import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any = [];
  public filteredEvents: any = [];
  private _listFilter: string = '';

  public isToggled: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos()
  }

  public get listFilter(): string {
    return this._listFilter
  }

  public set listFilter(filter: string) {
    this._listFilter = filter
    this.filteredEvents = this.listFilter ? this.filterEvents(this.listFilter) : this.eventos
  }

  filterEvents(filterFor: string): any {
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
    this.http.get('https://localhost:5001/api/Eventos').subscribe(
      response => {
        this.eventos = response
        this.filteredEvents = this.eventos
      },
      error => console.log(error),
    )
  }

}
