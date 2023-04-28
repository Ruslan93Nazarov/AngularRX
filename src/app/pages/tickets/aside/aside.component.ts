import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IMenuType } from 'src/app/models/menuType';
import {ITourTypeSelect} from "../../../models/tours";
import {TicketService} from "../../../services/tickets/ticket.service";
import {MessageService} from "primeng/api";
import {SettingsService} from "../../../services/settings/settings.service";


@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
menuTypes: IMenuType[];
selectedMenuType: IMenuType;
time: Date;
private timeInterval: number;
  @Output() updateMenuType: EventEmitter<IMenuType> = new EventEmitter() ;

  tourTypes: ITourTypeSelect[] = [
    {label: 'Все', value: 'all'},
    {label: 'Одиночный', value: 'single'},
    {label: 'Групповой', value: 'multi'}
  ]

  constructor(private ticketService: TicketService,
              private messageService: MessageService,
              private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.menuTypes = [
      {type: 'custom', label : 'Обычное'},
      {type: 'extended', label : 'Расширенное'}
    ]
    this.timeInterval = window.setInterval(() => {
      this.time = new Date();
    }, 1000)
  }

  changeType(ev: {ev: Event, value: IMenuType}): void {
    this.updateMenuType.emit(ev.value);
  }
  changeTourType(ev:  {ev: Event, value: ITourTypeSelect}): void {
    this.ticketService.updateTour(ev.value)
  }
  selectDate(ev: string) {
    console.log('ev', ev)
    this.ticketService.updateTour({date:ev})
  }
  initRestError(): void {
    {
      this.ticketService.getError().subscribe({
        next:(data)=>{
        },
        error:(err) =>{
          this.messageService.add({severity: 'error', summary: 'Error'});
        }
      })
    }
  }

  initSettingsData(){
    this.settingsService.loadUserSettingsSubject({
      saveToken: false
    });
  }
}
