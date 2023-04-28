import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ICustomTourLocation, INearestTour, ITour, ITourLocation} from 'src/app/models/tours';
import { TicketsStorageService } from 'src/app/services/tickets-storage/tickets-storage.service';
import {IUser} from "../../../models/users";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {forkJoin, fromEvent, map, of, Subscription, switchMap, withLatestFrom} from "rxjs";
import {TicketService} from "../../../services/tickets/ticket.service";

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit,OnDestroy {
  ticket?: ITour | undefined;
  user: IUser | null;
  userForm: FormGroup;

  nearestTours: INearestTour[];
  tourLocation: ITourLocation[];

  @ViewChild('ticketSearch') ticketSearch: ElementRef;
  searchTicketSub: Subscription;
  ticketRestSub: Subscription;
  searchTypes = [1,2,3];
  ticketSearchValue: string;

  constructor(private route: ActivatedRoute,
              private ticketStorage: TicketsStorageService,
              private userService: UserService,
              private ticketService: TicketService) { }

  ngOnInit(): void {
    // first get userInfo
    this.user = this.userService.getUser()

    // init formGroup
    this.userForm = new FormGroup({
      firstName: new FormControl('',{validators:Validators.required}),
      lastName: new FormControl('',[Validators.required, Validators.minLength(1)]),
      cardNumber: new FormControl(),
      birthDay: new FormControl(),
      age: new FormControl(),
      citizen: new FormControl()
    });

    // forkJoin([this.ticketService.getNearestTours(), this.ticketService.getToursLocation()])
    //   // .pipe(withLatestFrom(this.userService.user$),
    //   //   switchMap((val,user) =>{
    //   //     console.log('user',user)
    //   //     return of([])
    //   //   })
    //   // )
    //   .subscribe(
    //     (data)=>{
    //       this.tourLocation = data[1];
    //       this.nearestTours = this.ticketService.transformData(data[0], data[1]);
    //     }
    //   )

    forkJoin([this.ticketService.getNearestTours(), this.ticketService.getToursLocation()]).subscribe((data) => {
        // console.log('data', data);
        this.tourLocation = data[1];
        this.nearestTours = this.ticketService.transformData(data[0],data[1])
      }
    );



    // params
    const routeIdParam = this.route.snapshot.paramMap.get('id'); // for route
    const queryIdParam = this.route.snapshot.queryParamMap.get('id'); // for queryParams
    const paramValueId = routeIdParam || queryIdParam;
    if (paramValueId) {
      // const ticketStorage = this.ticketStorage.getStorage();
      // this.ticket = ticketStorage.find((el) => el.id === paramValueId);
      // console.log('this.ticket', this.ticket)
      // this.initTicketInfo(paramValueId);
    }
  }

  ngAfterViewInit():void {
    // setCardNumber
    this.userForm.controls['cardNumber'].setValue(this.user?.cardNumber);

    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup');
    this.searchTicketSub = fromEventObserver.subscribe((ev: any) => {
      this.initSearchTour();
    });
    //this.userForm.patchValue({
    // cardNumber: this.user.cardNumber
    // });
  }


  ngOnDestroy(): void {
    this.searchTicketSub.unsubscribe();
  }

  initSearchTour():void {
    // const emptyInput = (<HTMLInputElement | null>document.querySelector('.searchInput'));
    if (this.ticketSearchValue === '') {
      forkJoin([this.ticketService.getNearestTours(), this.ticketService.getToursLocation()]).subscribe((data) => {
          // console.log('data', data);
          this.tourLocation = data[1];
          this.nearestTours = this.ticketService.transformData(data[0],data[1])
        }
      );
    } else {
    const type = Math.floor(Math.random() * this.searchTypes.length);
    // unsubscribe
    if (this.ticketRestSub && !this.searchTicketSub.closed) {
      this.ticketRestSub.unsubscribe();
    }

    this.ticketRestSub = this.ticketService.getRandomNearestEvent(type).subscribe((data) => this.nearestTours = this.ticketService.transformData([data], this.tourLocation))
  }


  }

  onSubmit():void{

  }

  initTour():void{
    const userData=this.userForm.getRawValue();
    const postData={...this.ticket, ...userData};
    // console.log(postData, "postData");
    // console.log(this.userForm.getRawValue(), "this.userForm.getRawValue()");
    this.ticketService.sendTourData(postData).subscribe()
  }

  selectDate(ev:Event): void{

  }
}
