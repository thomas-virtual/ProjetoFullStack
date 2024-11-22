import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs/operators';
import { Palestrante } from 'src/models/Palestrante';
import { PalestranteService } from 'src/services/PalestranteService.service';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.scss']
})
export class PalestranteDetalheComponent implements OnInit {

  public palestranteForm: FormGroup;
  public situacaoDoForm = '';
  public corDoFormulario = '';

  constructor(
    private fb: FormBuilder,
    private palestranteService: PalestranteService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation()
    this.verficaForm()
    this.carregarPalestrante();
  }

  public get f(): any {
    return this.palestranteForm.controls
  }

  public validation(): void {
    this.palestranteForm = this.fb.group({
      miniCurriculo: ['']
    })
  }

  public verficaForm(): void {
    this.palestranteForm.valueChanges
          .pipe(
            map(
              () => {
                this.situacaoDoForm = 'O formulário está sendo atualizado'
                this.corDoFormulario = 'text-warning'
              }
            ),
            debounceTime(1000),
            tap(() => this.spinner.show())
          )
          .subscribe(
            () => {
              this.palestranteService.updatePalestrante({...this.palestranteForm.value})
                .subscribe(
                  () => {
                    this.situacaoDoForm = 'Formulário atualizado!'
                    this.corDoFormulario = 'text-success'

                    setTimeout(() => {
                      this.situacaoDoForm = 'O mini curriculo foi carregado!'
                      this.corDoFormulario = 'text-muted'
                    }, 1000)
                  },
                  (error) => {
                    console.error(error)
                    this.toastr.error("Erro ao atualizar mini curriculo", "Erro")
                  }
                ).add(() => this.spinner.hide())
            },
          )
  }

  carregarPalestrante(): void {
    this.palestranteService
      .getPalestrantes()
      .subscribe(
        (palestrante: Palestrante) => {
          this.palestranteForm.patchValue(palestrante)
        }
      )
  }
}
