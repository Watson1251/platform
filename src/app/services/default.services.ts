import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, Subscription, catchError, throwError } from "rxjs";

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + '/default/';

@Injectable({ providedIn: "root" })
export class DefaultService {

  private permissions: any = [];
  private permissionsUpdated = new Subject<any>();
  private permissionsSub?: Subscription;

  private defaultRole: string = "المسؤول";
  private permissionsClone: string[];
  private defaultPermissions: string[] = [
    'إدارة الأدوار والصلاحيات',
    'إضافة مستخدمين جدد',
    'تعديل بيانات المستخدمين',
    'حذف المستخدمين',
    'إضافة أجهزة جديدة',
    'تعديل بيانات الأجهزة',
    'حذف الأجهزة',
    'إضافة تحركات وسجلات جديدة',
    'حذف التحركات والسجلات',
    'تدوين الملاحظات على التحركات',
    'إضافة مشاكل وأعطال جديدة',
    'حذف المشاكل والأعطال',
    'تدوين الملاحظات على الأعطال',
  ];

  constructor(private http: HttpClient) {
    this.permissionsClone = this.defaultPermissions.slice();

    while (this.permissionsClone.length > 0) {
      this.handlePermissions(this.permissionsClone.pop() as string);
    }

    this.permissionsSub = this.permissionsUpdated.asObservable().subscribe(permissionsData => {

      const permissionIds = permissionsData.map((a: { _id: any; }) => a._id);

      this.handleRole(this.defaultRole, permissionIds).subscribe(response => {
        if (response.status == 200 || response.status == 201) {
          if (response.body == null) {
              return;
          }

          var roleId = "";

          if (response.status == 200) {
            roleId = response.body.role[0]._id;
          } else if (response.status == 201) {
            roleId = response.body.role._doc._id;
          }

          this.handleUser(roleId).subscribe(response => {

          });
        }
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.permissionsSub?.unsubscribe();
  }

  private handlePermissions(permission: string) {

    this.http
      .post<any>(
        BACKEND_URL + "permission/",
        {
          permission: permission
        },
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

          if (response.status == 200) {
            var permission = response.body.permission[0];
            this.permissions.push(permission);
          } else if (response.status == 201) {
            var permission = response.body.permission._doc;
            this.permissions.push(permission);
          }

          if (this.permissions.length >= this.defaultPermissions.length) {
            this.permissionsUpdated.next(this.permissions);
          }
        }

      });
  }

  private handleRole(role: string, permissions: string[]) {
    return this.http
      .post<any>(
        BACKEND_URL + "role/",
        {
          role: role,
          permissions: permissions
        },
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  private handleUser(roleId: string) {
    return this.http
      .post<any>(
        BACKEND_URL + "user/",
        {
          role: roleId
        },
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // Client-side error occurred
        console.error('Client-side error:', error.error.message);
    } else {
        // Server-side error occurred
        console.error('Server-side error:', error.status, error.error);
    }
    return throwError('Something went wrong. Please try again later.');
  }

}
