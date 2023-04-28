import {Component, OnInit} from '@angular/core';
import {ObservableExampleService} from "./services/testing/observable-example.service";
import {ConfigService} from "./services/config/config.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ticketSales2023';
  prop: string;
  constructor( private testing: ObservableExampleService,
               private configService:ConfigService ) {

  }

  ngOnInit() {
    /*Observable*/
    // first subscribe
    const myObservable = this.testing.getObservable();
    myObservable.subscribe((data:string) => {
      // console.log('first myObservable data')
    });

    // second subscriber
    myObservable.subscribe((data:string) => {
      // console.log('second myObservableData')
    });

    /*Subject*/
    const mySubject = this.testing.getSubject();
    mySubject.next('subject value');
    // mySubject.subscribe((data:string) =>{
    //   // console.log('first data subject', data)
    // });
    // mySubject.subscribe((data:string) =>{
    //   // console.log('second data subject', data)
    // });


    // send subjectData
    mySubject.next('subject value1')

   /*Behavior Subject*/

    const myBehavior = this.testing.getBehaviorSubject();
    myBehavior.subscribe((data:string) =>{
      console.log('first data behaviorSubject', data)
    });

    // myBehavior.next('new data1 from behaviorSubject');
    // myBehavior.next('new data2 from behaviorSubject');
  }

}
