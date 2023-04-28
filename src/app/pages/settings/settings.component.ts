import {Component, OnDestroy, OnInit} from '@angular/core';
import {ObservableExampleService} from "../../services/testing/observable-example.service";
import {Subject, Subscription, take, takeUntil} from "rxjs";
import {SettingsService} from "../../services/settings/settings.service";
import {ISettings} from "../../models/settings";
import {IUser} from "../../models/users";
import {UserService} from "../../services/user/user.service";
import {MessageService} from "primeng/api";
import {AuthService} from "../../services/auth/auth.service";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit,OnDestroy {
  subjectForUnsubscribe = new Subject();
  user: IUser | null;
  newPsw: string;
  rptNewPsw: string;
  pswUser: string;
  constructor( private testing: ObservableExampleService,
               private settingsService: SettingsService,
               private authService: AuthService,
               private messageService: MessageService,
               private userService: UserService) { }

  ngOnInit(): void {
    //  settingsData observable
    this.settingsService.loadUserSettings().pipe(takeUntil(this.subjectForUnsubscribe)).subscribe((data:ISettings)=>{
      console.log('settings data', data)
    });

    //settings data subject
    this.settingsService.getSettingsSubjectObservable().pipe(takeUntil(this.subjectForUnsubscribe)).subscribe(
      (data:ISettings) => {
      console.log('settings data from subject', data)
    })
  }

  ngOnDestroy(): void {
    this.subjectForUnsubscribe.next(true)
    this.subjectForUnsubscribe.complete();
  }

  onPswChange(Ev:Event): void|boolean{
    const  user = this.userService.getUser();
    if ( user.psw !== this.pswUser) {
      this.messageService.add({severity: 'error', summary: 'Неверно введен текущий пароль'});
    } else {
      if (this.newPsw !== this.rptNewPsw) {
        this.messageService.add({severity: 'error', summary: 'Новые пароли не совпадают'});
        // console.log("this.newPsw", this.newPsw);
        // console.log("this.rptNewPsw", this.rptNewPsw);
      } else {
        this.messageService.add({severity: 'success', summary: 'Новый пароль установлен'});
        user.psw = this.newPsw;
        this.userService.setUser(user);
        const userString = JSON.stringify(user);
        window.localStorage.setItem(user.login, userString);
        console.log("теперь пароль", user.psw);


        // const pswUser = this.userService.getUser()?.psw
        // if ( pswUser !== this.pswUser) {
        //   this.messageService.add({severity: 'error', summary: 'Неверно введен текущий пароль'});
        // } else {
        //   if (this.newPsw !== this.rptNewPsw) {
        //     this.messageService.add({severity: 'error', summary: 'Новые пароли не совпадают'});
        //     // console.log("this.newPsw", this.newPsw);
        //     // console.log("this.rptNewPsw", this.rptNewPsw);
        //   } else {
        //     this.messageService.add({severity: 'success', summary: 'Новый пароль установлен'});
        // const user = this.userService.getUser();
        // const newUser = <IUser> {...user};
        // newUser.psw = this.newPsw;
        // this.userService.setUser(newUser);
        // console.log("теперь пароль", newUser.psw);
      }
    }
  }
}
