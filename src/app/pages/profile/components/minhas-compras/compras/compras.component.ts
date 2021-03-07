import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  @Input() compras: any[];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public setCommand(value: string, id: number, type: string): void {
    this.router.navigate([], { queryParams: { command: value, id, type}, queryParamsHandling: 'merge' });
  }

  public mapeiaStatus(status: string): string {
    debugger;
    let mapeado = '';
    switch(status) {
      case 'Iniciada':
        mapeado = 'Iniciada';
        break;
      case 'Item pago, aguardando entrega':
        mapeado = 'Paga';
        break;
      case 'Item entregue, aguardando confirmação':
        mapeado = 'Entregue';
        break;
      case 'Finalizada':
        mapeado = 'Finalizada';
        break;
    }

    return mapeado;
  }

}
