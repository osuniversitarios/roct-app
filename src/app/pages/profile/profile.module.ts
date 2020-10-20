import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { ProfileComponent } from './profile.component';
import { MinhaContaComponent } from './components/minha-conta/minha-conta.component';
import { AlterarSenhaComponent } from './components/alterar-senha/alterar-senha.component';
import { TransformaContaComponent } from './components/transforma-conta/transforma-conta.component';
import { ProfileRoutingModule } from './profile.routing.module';
import { MinhasComprasComponent } from './components/minhas-compras/minhas-compras/minhas-compras.component';

@NgModule({
  declarations: [
    ProfileComponent,
    MinhaContaComponent,
    AlterarSenhaComponent,
    TransformaContaComponent,
    MinhasComprasComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    ProfileRoutingModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }