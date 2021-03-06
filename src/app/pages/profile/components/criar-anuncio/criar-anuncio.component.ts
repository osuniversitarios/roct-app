import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/controllers/items/items.service';
import { animate, style, transition, trigger } from '@angular/animations';

import { translateValue } from 'src/utils';
import { ProfileService } from 'src/app/controllers/profile/profile.service';
import { SessionService } from 'src/app/controllers/session/session.service';

@Component({
  selector: 'app-criar-anuncio',
  templateUrl: './criar-anuncio.component.html',
  styleUrls: ['./criar-anuncio.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({}),
        animate('250ms', style({})),
      ]),
      transition(':leave', [
        animate('250ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CriarAnuncioComponent implements OnInit {

  // Data
  public data: any;
  public status: any;
  public dataSelect: {
    typeItem: [],
    server: [],
    games: [],
    loaded: boolean
  };
  public errors: any;

  constructor(
    private router: Router,
    private ctrlItems: ItemsService,
    private ctrlSession: SessionService,
  ) {
    this.data = {
      ads: {
        server: '',
        game: '',
        name: '',
        description: '',
        price: undefined,
        type_: '',
        image: '',
        salesman_uuid: undefined,
      },
    };
    this.dataSelect = { typeItem: [], server: [], games: [], loaded: false };
    this.status = { loading: false, type: '', show: false, message: '' };
  }

  ngOnInit() {
    this.initiateErrors();
    Promise.all([
      this.ctrlItems.getItemsServers(),
      this.ctrlItems.getItemsTypes(),
      this.ctrlItems.getItemsGames()
    ]).then(res => {
      this.dataSelect.loaded = true;
      this.dataSelect.server = res[0].data.map(item => {
        return { value: item, label: item };
      });
      this.dataSelect.typeItem = res[1].data.map(item => {
        return { value: item, label: translateValue(item) };
      });
      this.dataSelect.games = res[2].data;
    });
  }

  public resetStatus(): void {
    this.status = {
      loading: false,
      show: false,
      type: '',
      message: ''
    };
  }

  public showAlert(type: string, show: boolean, message: string): void {
    this.status = {
      loading: false,
      show,
      type,
      message
    };
    setTimeout(() => {
      this.resetStatus();
    }, 3500);
  }

  // TEMPORARIO
  public extractAdd() {
    const add = Object.assign({}, this.data.add);
    delete add.server;
    delete add.game;
    delete add.description;
    return add;
  }

  public submit(): void {
    this.validateAll();
    if (this.isValid()) {
      this.status.loading = true;
      this.data.ads.salesman_uuid = this.ctrlSession.getUserId();
      this.ctrlItems.create(this.data.ads)
        .then(res => {
          this.status.type = 'success';
          this.status.show = true;
          this.status.message = 'Anúncio criado com sucesso!';
          setTimeout(() => {
            this.resetStatus();
            this.router.navigate(['/user/profile']);
          }, 2000);
        }).catch(err => {
          this.status.loading = false;
          this.status.type = 'error';
          this.status.show = true;
          this.status.message = 'Ocorreu um erro na criação.';
          setTimeout(() => {
            this.resetStatus();
          }, 3500);
        });
    } else {
      this.status.type = 'error';
      this.status.show = true;
      this.status.message = 'Campos obrigatórios não preenchidos.';
      setTimeout(() => {
        this.status.show = false;
      }, 2500);
    }
  }

  private initiateErrors(): void {
    this.errors = {
      server: false,
      game: false,
      name: false,
      type_: false,
      description: false,
      price: false,
      image: false
    };
  }

  isValid(): boolean {
    for (const e in this.errors) {
      if (this.errors[e]) {
        return false;
      }
    }
    return true;
  }

  private validateAll(): void {
    for (const e in this.errors) {
      this.validate(e);
    }
  }

  validate(property: string): void {
    if (!this.data.ads[property]) {
      this.errors[property] = true;
    } else {
      this.errors[property] = false;
    }
  }

}
