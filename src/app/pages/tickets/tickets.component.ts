import { Component, OnInit } from '@angular/core';
import { IMenuType } from 'src/app/models/menuType';
import { ITour } from 'src/app/models/tours';


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
public  tickets: ITour[];
public selectedType: IMenuType;

updateSelectedType(ev: IMenuType): void {
  this.selectedType = ev;
}
constructor( ) { }

  ngOnInit(): void {
  }

}
