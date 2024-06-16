import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, throwError } from "rxjs";

import { environment } from "../../environments/environment";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { AuthData } from "../models/auth-data.model";
import { Permission } from "../models/permission.model";
import { SnackbarService } from "./snackbar.service";

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string = "";
  private tokenTimer: any;

  private userId: string = "";
  private userName: string = "";
  private role: string = "";

  private permissions: Permission[] = [];

  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  setPermissions(permissions: Permission[]) {
    this.permissions = permissions;
  }

  getPermissions() {
    return this.permissions;
  }

  isAllowed(permission: string) {
    return this.permissions.filter(obj => obj.permission == permission).length > 0;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(username: string, password: string) {
    const authData: AuthData = { username: username, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string, userName: string, role: string }>(
        BACKEND_URL + "login",
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.userName = response.userName;
            this.role = response.role;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId, this.userName, this.role);
            this.router.navigate(["/"]);
          }
        },
        error => {
          console.log(error);
          this.authStatusListener.next(false);
          this.snackbarService.openSnackBar('خطأ في اسم المستخدم أو كلمة المرور', 'failure');
        }
      );
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = '';
    this.userName = '';
    this.role = '';
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const role = localStorage.getItem("role");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName,
      role: role,
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId ?? '';
      this.userName = authInformation.userName ?? '';
      this.role = authInformation.role ?? '';
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    // console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, userName: string, role: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("role", role);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }

  getRole() {
    return this.role;
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // Client-side error occurred
        console.error('Client-side error:', error.error.message);
    } else {
        // Server-side error occurred
        console.error('Server-side error:', error.status, error.error);
    }
    this.snackbarService.openSnackBar('خطأ في السيرفر', 'failure');
    return throwError('Something went wrong. Please try again later.');
  }

}
