import { Injectable } from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {ICustomTourLocation, INearestTour, ITour, ITourLocation, ITourTypeSelect} from 'src/app/models/tours';
import { TicketRestService } from '../rest/ticket-rest.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private ticketSubject = new Subject<ITourTypeSelect>();
  private ticketUpdateSubject = new Subject<ITour[]>();
  readonly ticketUpdateSubject$ = this.ticketUpdateSubject.asObservable();
  constructor( private ticketServiceRest: TicketRestService) { }


  getTickets(): Observable<ITour[]> {
     return this.ticketServiceRest.getTickets().pipe(map(
       (value) => {
         const singleTours = value.filter((el) => el.type === 'single');
      return value.concat(singleTours)
       }
     ));
  }
  readonly ticketType$ = this.ticketSubject.asObservable();
  getError(): Observable<any>{
    return this.ticketServiceRest.getRestError();
  }

  getNearestTours(): Observable<INearestTour[]> {
    return this.ticketServiceRest.getNearestTickets();
  }

  getToursLocation(): Observable<ITourLocation[]> {
    return this.ticketServiceRest.getLocationList();
  }

  transformData(data : INearestTour[], regions: ITourLocation[]): ICustomTourLocation[] {
    const newTicketData: ICustomTourLocation[] = [];
    data.forEach((el) => {
      const newEl = <ICustomTourLocation>{...el};
      newEl.regions = <ICustomTourLocation>regions.find((regions) => el.locationId === regions.id) || {};
      newTicketData.push(newEl);
    });
    return newTicketData;
  }

  // 2 вариант доступа к Observable
  // getTicketTypeObservable(): Observable<ITourTypeSelect> {
  //   return this.ticketSubject.asObservable();
  // }
  updateTour(type:ITourTypeSelect): void {
    this.ticketSubject.next(type);
  }

  getRandomNearestEvent(type: number): Observable<INearestTour> {
    return this.ticketServiceRest.getRandomNearestEvent(type);
  }

  sendTourData(data:any): Observable<any> {
    return this.ticketServiceRest.sendTourData(data);
  }
}
