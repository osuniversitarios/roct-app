import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/controllers/user/user.service';
import { SessionService } from 'src/app/controllers/session/session.service';

@Component({
  selector: 'app-consulta-anuncio',
  templateUrl: './consulta-anuncio.component.html',
  styleUrls: ['./consulta-anuncio.component.scss']
})
export class ConsultaAnuncioComponent implements OnInit {

  public page: number;
  public type: string;
  public id: number;
  public data: any = {};
  public status = { loaded: true, message: "", error: false, show: false };

  constructor(
    private route: ActivatedRoute,
    private ctrlUser: UserService,
    private ctrlSession: SessionService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = parseInt(params.id);
      this.type = params.type;
      this.page = parseInt(params.page);
    });
    this.getItem();
  }

  private getItem(): void {
    this.status = {...this.status, error: false};
    const body = {
      page: this.page,
      per_page: 100,
      id: this.ctrlSession.getUserId()
    }

    if (this.type === "sales") {
      this.ctrlUser.getMySales(body).then(res => {
        this.data = res.data.data.filter(item => this.id === item.uuid)[0];
        this.status = {...this.status, loaded: false};
      })

    }
    else {
      this.ctrlUser.getMyPurshases(body).then(res => {
        this.data = res.data.data.filter(item => this.id === item.uuid)[0];
        this.status = {...this.status, loaded: false};
      })
    }
  }

  public confirmDelivery(): void {
    this.ctrlUser.confirmDelivery(this.data.uuid).then(() => {
      this.status = { loaded: false, error: false, message: this.type === "sales" ? "Entrega confirmada" : "Recebimento confirmado", show: true };
      this.getItem();
    }).catch(() => {
      this.status = { loaded: false, error: true, message: "Houve um problema, tente mais tarde.", show: true };
    });
  }

  //Se o usuário vendedor confirmar entrega, o status deve ir para Item entregue, aguardando confirmação
  //Se o usuário comprador confirmar recebimento, o status da compra deve ir direto para Finalizada e 
  //o vendedor não precisa confirmar nada.
  public renderConfirmationButton(): boolean {   
    if(this.data.status === 'Finalizada') {
      return false;
    }
    else if(this.type === 'sales' && this.data.salesman_delivery_confirmation) {
      return false;
    }
    else if(this.type === 'sales' && this.data.buyer_delivery_confirmation) {
      return false;
    }
    else if(this.type === 'sales' && this.data.status === 'Item entregue, aguardando confirmação') {
      return false;
    }
    else if(this.type === 'purchases' && this.data.buyer_delivery_confirmation) {
      return false;
    }

    return true;
  }
  
}
