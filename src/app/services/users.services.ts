import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, catchError, throwError } from "rxjs";

import { environment } from "../../environments/environment";
import { User } from "../models/user.model";

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({ providedIn: "root" })
export class UsersService {

  private users: User[] = [];
  private usersUpdated = new Subject<any>();

  constructor(private http: HttpClient) {}

  getUsers() {
    this.http
      .get<{message: string, users: any}>(
        BACKEND_URL,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      )
      .subscribe(response => {
        if (response.status == 200 || response.status == 201) {
            if (response.body == null) {
                return;
            }

            var fetchedUsers = response.body.users;
            var tempUsers: User[] = [];

            fetchedUsers.forEach((item: any) => {
                const user: User = {
                    id: item._id,
                    name: item.name,
                    username: item.username,
                    isMale: item.isMale,
                    role: item.role,
                }
                tempUsers.push(user);
            });

            this.users = tempUsers;
            this.usersUpdated.next(this.users);
        }
      });
  }

  getUser(id: string) {
    return this.http
      .get<any>(
        BACKEND_URL + id,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  createUser(user: User) {
    return this.http
      .post<any>(
        BACKEND_URL + 'create/',
        user,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  updateUser(user: User) {
    return this.http
      .post<any>(
        BACKEND_URL + 'update/',
        user,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  deleteUser(user: User) {
    return this.http
      .post<any>(
        BACKEND_URL + 'delete/',
        user,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // Client-side error occurred
        console.error('Client-side error:', error.error.message);
    } else {
        // Server-side error occurred
        console.error('Server-side error:', error.status, error.error);
    }
    return throwError('Something went wrong. Please try again later.');
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

}
