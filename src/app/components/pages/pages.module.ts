import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PrivilegesModule } from './privileges/privileges.module';
import { UsersModule } from './users/users.module';
import { LoginModule } from '../login/login.module';
import { PagesComponent } from './pages.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    UsersModule,
    PrivilegesModule,
    LoginModule
  ],
  declarations: [
    PagesComponent
  ]
})
export class PagesModule {
}
