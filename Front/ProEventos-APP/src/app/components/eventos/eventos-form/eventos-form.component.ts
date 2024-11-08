import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-eventos-form',
  templateUrl: './eventos-form.component.html',
  styleUrls: ['./eventos-form.component.scss']
})
export class EventosFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  
  constructor() { }
  
  ngOnInit(): void {
    this.validation()
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
}
