import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { ModalModule } from 'ngx-bootstrap/modal';

import { ToastrModule } from 'ngx-toastr';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { NavComponent } from './components/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventoService } from 'src/services/EventoService.service';
import { DateTimeFormatPipe } from 'src/helpers/DateTimeFormat.pipe';
import { TituloComponent } from './components/titulo/titulo.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventosListaComponent } from './components/eventos/eventos-lista/eventos-lista.component';
import { EventosDetalheComponent } from './components/eventos/eventos-detalhe/eventos-detalhe.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { RegistrationFormComponent } from './components/user/registration/registration-form/registration-form.component';
import { PerfilFormComponent } from './components/user/perfil/perfil-form/perfil-form.component';
import { LoteComponent } from './components/lote/lote.component';
import { LoteFormComponent } from './components/lote/lote-form/lote-form.component';
import { EventosFormComponent } from './components/eventos/eventos-form/eventos-form.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { LoteService } from 'src/services/Lote.service';
import { NgxCurrencyModule } from 'ngx-currency';
import { customCurrencyMaskConfig } from 'src/utils/CurrencyMaskConfig';
import { JwtInterceptor } from 'src/interceptors/jwt.interceptor';
import { HomeComponent } from './components/home/home.component';

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
    DashboardComponent,
    EventosListaComponent,
    EventosDetalheComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    RegistrationFormComponent,
    PerfilFormComponent,
    LoteComponent,
    LoteFormComponent,
    EventosFormComponent,
    HomeComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      progressBar: true,
      preventDuplicates: true,
      positionClass: 'toast-bottom-right',
      timeOut: 3000
    }),
    NgxSpinnerModule,
    BsDatepickerModule.forRoot(),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    PaginationModule.forRoot()
  ],
  providers: [
    EventoService, 
    LoteService,
    BsLocaleService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
