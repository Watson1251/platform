import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Role } from "../models/role.model";
import { PermissionsService } from "./permissions.services";
import { Permission } from "../models/permission.model";

const BACKEND_URL = environment.apiUrl + '/roles/';

@Injectable({ providedIn: "root" })
export class RolesService {

  private roles: Role[] = [];
  private rolesUpdated = new Subject<any>();

  constructor(private http: HttpClient, public permissionsService: PermissionsService,) {}

  getRoles() {
    this.http
      .get<{message: string, roles: any}>(
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

          if (response.body.roles.length == 0) {
            this.roles = response.body.roles;
            this.rolesUpdated.next(this.roles);
            return;
          }

          var allPermissions: string[] = [];
          var fetchedRoles = response.body.roles;
          fetchedRoles.forEach((role: any) => {
            role.permissions.forEach((item: any) => {
              if (!allPermissions.includes(item)) {
                allPermissions.push(item);
              }
            });
          });

          var permissions: Permission[] = [];
          allPermissions.forEach(id => {
            this.permissionsService.getPermission(id).subscribe(response => {

              if (response.status == 200 || response.status == 201) {

                const permission: Permission = {
                  id: response.body._id,
                  permission: response.body.permission
                }

                permissions.push(permission);
                if (permissions.length == allPermissions.length) {

                  var tempRoles: Role[] = [];

                  fetchedRoles.forEach((item: any) => {
                    // console.log(item.permissions.map((_id: any) => {
                    //   permissions.find(i => i.id === _id);
                    // }))
                    var temp: Permission[] = [];
                    for (var _temp of item.permissions) {
                      var resultingObj = permissions.find(i => i.id === _temp);
                      if (resultingObj != null) {
                        temp.push(resultingObj);
                      }
                    }

                    const role: Role = {
                        id: item._id,
                        role: item.role,
                        permissions: temp
                    }
                    tempRoles.push(role);
                  });


                  this.roles = tempRoles;
                  this.rolesUpdated.next(this.roles);

                }
              }
            });
          });
        }
      });
  }

  // getRole(id: string) {
  //   console.log(id);
  //   return this.http
  //     .get<any>(
  //       BACKEND_URL + id,
  //       {observe: 'response'}
  //     )
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //           return this.handleError(error);
  //       })
  //     );
  // }

  createRole(role: Role) {
    return this.http
      .post<any>(
        BACKEND_URL + 'create/',
        role,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  updateRole(role: Role) {
    return this.http
      .post<any>(
        BACKEND_URL + 'update/',
        role,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  deleteRole(role: Role) {
    return this.http
      .post<any>(
        BACKEND_URL + 'delete/',
        role,
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

  getRolesUpdateListener() {
    return this.rolesUpdated.asObservable();
  }

}
