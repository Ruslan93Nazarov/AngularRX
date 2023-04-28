import { Injectable } from '@angular/core';
import { IUser } from 'src/app/models/users';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private userStorage: IUser[] = [];

  constructor() { }
  checkUser(user:IUser):boolean{
  const isUserExists = this.userStorage.find((el:IUser) =>el.login === user.login );

  let  isUserSaveInStore = window.localStorage.getItem(user?.login);
  let  userInStore: IUser = <IUser> {};

if(isUserSaveInStore){
 return userInStore = JSON.parse(isUserSaveInStore);
}
 if(isUserExists){
        return isUserExists.psw === user.psw;

  } else if(userInStore?.login){
    return userInStore.psw === user.psw;
  }
return false
  }


  setUser(user:IUser): void {
    const isUserExists = this.userStorage.find((el:IUser) =>el.login === user.login );
    if(!isUserExists && user?.login) {
      this.userStorage.push(user);
    }
  }

  isUserExists(user:IUser):boolean{
    const isUserExists = this.userStorage.find((el:IUser) =>el.login === user.login );
    return !!isUserExists;
  }
}
