import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TicketService} from "../../../services/tickets/ticket.service";
import {ITour, ITourTypeSelect} from "../../../models/tours";

import {Router} from "@angular/router";
import {BlocksStyleDirective} from "../../../directive/blocks-style.directive";
import {debounceTime, fromEvent, Subscription} from "rxjs";
import {TicketsStorageService} from "../../../services/tickets-storage/tickets-storage.service";


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, AfterViewInit, OnDestroy {
  tickets: ITour[];
  loadCountBlock = false;
//свойство для отписки:
  tourUnsubscriber: Subscription;
  ticketsCopy: ITour[];


  @ViewChild('tourWrap', {read: BlocksStyleDirective}) blockDirective: BlocksStyleDirective;
  @ViewChild('tourWrap') tourWrap: ElementRef;

  @ViewChild('ticketSearch') ticketSearch: ElementRef;

  searchTicketSub: Subscription;
  ticketSearchValue: string;

  constructor(private ticketService: TicketService,
              private router: Router,
              private ticketStorage: TicketsStorageService) {
  }

  ngOnInit(): void {
    this.ticketService.ticketUpdateSubject$.subscribe((data)=>{
      this.tickets=data;
    })


    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
        this.ticketsCopy = [...this.tickets];
        this.ticketStorage.setStorage(data);
      }
    )
//  1 вариант подписки

    this.tourUnsubscriber = this.ticketService.ticketType$.subscribe((data: ITourTypeSelect) => {
      console.log('data', data)

      let ticketType: string;
      switch (data.value) {
        case "single":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "single");
          break;
        case "multi":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "multi");
          break;
        case "all":
          this.tickets = [...this.ticketsCopy];
          break;

      }
      if (data.date) {
        const dateWithoutTime = new Date(data.date).toISOString().split('T');
        const dateValue = dateWithoutTime[0]
        console.log('dateValue', dateValue)
        this.tickets = this.ticketsCopy.filter((el) => el.date === dateValue);
      }

      setTimeout(() => {
        this.blockDirective.updateItems();
        this.blockDirective.initStyle(0);  // сбрасываем индекс на 0 элемент
      });

    });

//  2 вариант подписки
//     this.tourUnsubscriber = this.ticketService.getTicketTypeObservable().subscribe((data:ITourTypeSelect) => {  console.log('data', data)  });

  }

  goToTicketInfoPage(item: ITour) {
    // this.router.navigate( ['/tickets/ticket/${item.id}'])
    // если пусть в роутинг модуле записан так: path: 'tickets/:id',

    this.router.navigate(['/tickets/ticket'], {queryParams: {id: item.id}})
    // если пусть в роутинг модуле записан так: path: 'ticket',
  }

  directiveRenderComplete(ev: boolean) {
    const el: HTMLElement = this.tourWrap.nativeElement;
    this.blockDirective.initStyle(0);
    this.loadCountBlock = true;
  }

  ngAfterViewInit() {

    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, "keyup");

    this.searchTicketSub = fromEventObserver.pipe(
      debounceTime(200)).subscribe((ev:any)=>{
        if (this.ticketSearchValue) {
          this.tickets = this.ticketsCopy.filter((el) => el.name.toLowerCase().includes(this.ticketSearchValue.toLowerCase()));
        } else {
          this.tickets = [...this.ticketsCopy];
        }
      }
    );
  }

  ngOnDestroy()
  {
    this.tourUnsubscriber.unsubscribe();
    this.searchTicketSub.unsubscribe();
  }


}
