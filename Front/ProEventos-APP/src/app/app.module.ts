import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { ModalModule } from 'ngx-bootstrap/modal';

import { ToastrModule } from 'ngx-toastr';

import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule } from '@angular/forms';
import { EventoService } from 'src/services/EventoService.service';
import { DateTimeFormatPipe } from 'src/helpers/DateTimeFormat.pipe';
import { TituloComponent } from './components/titulo/titulo.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [	
    AppComponent,
    EventosComponent,
    NavComponent,
    DateTimeFormatPipe,
    TituloComponent,
    PalestrantesComponent,
    ContatosComponent,
    PerfilComponent,
    DashboardComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    FormsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      progressBar: true,
      preventDuplicates: true,
      positionClass: 'toast-bottom-right',
      timeOut: 3000
    }),
    NgxSpinnerModule
  ],
  providers: [EventoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
