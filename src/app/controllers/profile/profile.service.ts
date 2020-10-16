import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  compras = [
    { id: 1, item: { nome: 'Sedenta', valor: '3200' }, dt: '01/01/2020', vendedor: { username: 'Sylas' } },
    { id: 2, item: { nome: 'Sombras gêmeas', valor: '1800' }, dt: '01/01/2020', vendedor: { username: 'Morgana' } }
  ];

  constructor() { }

  getCompras() {
    return this.compras;
  }
}
