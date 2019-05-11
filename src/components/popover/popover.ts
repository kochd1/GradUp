import { Component, Input } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * Generated class for the PopoverComponent component.
 *
 * @author kochd1
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  infoText: string;

  data: any;

  constructor(public navParams: NavParams) {
    console.log('Hello PopoverComponent Component');
    this.infoText = '';
  }

  ionViewDidLoad() {
    //get all data
    this.data = this.navParams.get('data');
    console.log("data from main page:", this.data);

    this.infoText = this.data.infoText;

  }

  /*template: `
  <ion-list>
    <ion-list-header>Ionic</ion-list-header>
    <button ion-item (click)="close()">Learn Ionic</button>
    <button ion-item (click)="close()">Documentation</button>
    <button ion-item (click)="close()">Showcase</button>
    <button ion-item (click)="close()">GitHub Repo</button>
  </ion-list>`*/

}
