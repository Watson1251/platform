import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbIconLibraries, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { RippleService } from '../../../@core/utils/ripple.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.services';

interface TempUser {
  name: string;
  picture: string;
}


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public readonly materialTheme$: Observable<boolean>;
  userPictureOnly: boolean = false;
  user: TempUser = {
    name: '',
    picture: ''
  };

  currentTheme = 'default';

  userMenu = [ { title: 'تسجيل الخروج' } ];

  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private iconLibraries: NbIconLibraries,
    private router: Router,
    private rippleService: RippleService,
    public authService: AuthService

  ) {
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'fa', iconClassPrefix: 'fa' });
  }

  ngOnInit() {
    this.menuService.onItemClick().subscribe(( event ) => {
      this.onMenuItemClick(event.item.title);
    })

    const userID = this.authService.getUserId();
    console.log(userID);

    this.user.name = "عبدالرحمن الصابري";


    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => {
    //     this.user = users.nick;
    //     console.log(users.nick);
    //   });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);
    
    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => {
        this.currentTheme = themeName;
        this.rippleService.toggle(themeName?.startsWith('material'));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToUsers() {
    this.router.navigate(['/pages/users']);
  }

  goToPermissions() {
    this.router.navigate(['/pages/privileges']);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  onMenuItemClick(event) {
    switch (event) {
      case 'تسجيل الخروج':
        this.authService.logout();
        break;
      
      default:
        break;
    }
  }
}
