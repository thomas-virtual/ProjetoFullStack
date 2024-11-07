import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-redes-sociais-form',
  templateUrl: './redes-sociais-form.component.html',
  styleUrls: ['./redes-sociais-form.component.scss']
})
export class RedesSociaisFormComponent implements OnInit {
  @Input() adaptivePosition: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
