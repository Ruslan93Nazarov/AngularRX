import { Injectable } from '@angular/core';
import {ICustomStatisticUser} from "../../models/users";
import {map, Observable} from "rxjs";
import {StatisticRestService} from "../rest/statistic-rest/statistic-rest.service";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private statisticUserRest: StatisticRestService) { }

  getUserStatistic(): Observable<ICustomStatisticUser[]> {

    return this.statisticUserRest.getUserStatistic().pipe(
      map((data) => {
        const newDataArr: ICustomStatisticUser[] = [];
        data.forEach((el) => {
          const newDataObj: ICustomStatisticUser = {
            id: el.id,
            name: el.name,
            city: el.address.city,
            company: el.company.name,
            phone: el.phone,
            street: el.address.street
          };
          newDataArr.push(newDataObj);
        })

        return newDataArr;
      })
    )
  }


}
