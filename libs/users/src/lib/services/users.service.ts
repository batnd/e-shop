import { inject, Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { UserDeleteResponse } from '../models/user-delete-response.interface';
import { UserCount } from '../models/user-count.interface';
import { UsersFacade } from '../+state/users.facade';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http: HttpClient = inject(HttpClient);
  private usersFacade: UsersFacade = inject(UsersFacade);

  private apiURLUsers: string = environment.apiUrl + 'users';

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  public getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURLUsers, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
  }

  public deleteUser(userId: string): Observable<UserDeleteResponse> {
    return this.http.delete<UserDeleteResponse>(`${this.apiURLUsers}/${userId}`);
  }

  public getUsersCount(): Observable<number> {
    return this.http.get<UserCount>(`${this.apiURLUsers}/get/count`)
      .pipe(
        map((count: UserCount) => count.userCount)
      );
  }

  public initAppSession(): void {
    this.usersFacade.buildUserSession();
  }

  public observeCurrentUser(): Observable<User | null> {
    return this.usersFacade.currentUser$;
  }

  public isCurrentUserAuthenticated(): Observable<boolean> {
    return this.usersFacade.isAuthenticated$;
  }
}
