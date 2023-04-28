import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IUser } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth/auth.service';
import {ConfigService} from "../../../services/config/config.service";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
     login:string;
     psw:string;
     pswRepeat:string;
     mail: string;
     cardNumber: string;
     selectedValue: string;

     showCardNumber: boolean;



  constructor(private messageService: MessageService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.showCardNumber = ConfigService.config.useUserCard;
  }

  toLocalStorage():void{}

  registration(ev:Event):void | boolean {
      if(this.psw !== this.pswRepeat){
        this.messageService.add({severity:'error', summary: 'Пароли не совпадают'});
        return false;
      }
      const userObj: IUser = {
        psw: this.psw,
        cardNumber: this.cardNumber,
        login: this.login,
        email: this.mail,
      }

      if (!this.authService.isUserExists(userObj)) {
        if (this.selectedValue){
        let userString = JSON.stringify(userObj);
        window.localStorage.setItem(this.login, userString)}
        this.authService.setUser(userObj);
        this.messageService.add({severity:'success',
          summary:'Вы успешно зарегистрированы'});
      } else {
        this.messageService.add({severity:'warn', summary:'Пользователь с таким логином уже зарегестрирован'});
      }
    }

}
