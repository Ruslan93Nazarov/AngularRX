import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ISettings} from "../../models/settings";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject: Subject<ISettings> = new Subject<ISettings>();
  constructor() { }

  loadUserSettings(): Observable<ISettings> {
    const settingObservable = new Observable<ISettings>((subscriber)=>{
      const settingsData: ISettings = {
        saveToken: true
      };
      subscriber.next(settingsData);
    });

    return settingObservable;
  }
    // subject
  loadUserSettingsSubject(data:ISettings): any {
    this.settingsSubject.next(data)
  }

  getSettingsSubjectObservable(): Observable<ISettings>{
    return this.settingsSubject.asObservable()
  }
}
