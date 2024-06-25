import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./services/auth.services";
import { SnackbarService } from "./services/snackbar.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  paths = {
    "permissions": [
      "إدارة الأدوار والصلاحيات"
    ],
    "users": [
      "إضافة مستخدمين جدد",
      "تعديل بيانات المستخدمين",
      "حذف المستخدمين",
    ],
    "devices": [
      "إضافة أجهزة جديدة",
      "تعديل بيانات الأجهزة",
      "حذف الأجهزة",
    ],
  };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    const isAuth = this.authService.getIsAuth();
    var isValid = false;

    if (route.url.length > 0) {
      const path = route.url[0].path as String;
      var permissions: string[] = [];

      switch (path) {
        case "permissions":
          permissions = this.paths.permissions;
          break;
        case "users":
          permissions = this.paths.users;
          break;
        case "devices":
          permissions = this.paths.devices;
          break;
      }

      permissions.forEach(item => {
        // console.log(this.authService.isAllowed(item));
        if (this.authService.isAllowed(item)) {
          isValid = true;
        }
      });

      if (!isValid) {
        this.snackbarService.openSnackBar('الرجاء التأكد من الصلاحيات.', 'failure');
        this.router.navigate(['/']);
      }

      return isValid;
    }


    if (!isAuth) {
      this.snackbarService.openSnackBar('الرجاء تسجيل الدخول أولا', 'failure');
      // this.authService.logout();
      this.router.navigate(['/auth/login']);
    }

    return isAuth;
  }
}
