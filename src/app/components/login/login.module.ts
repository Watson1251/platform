import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { LoginComponent } from './login.component';
import { ThemeModule } from '../../@theme/theme.module';
import { AngularMaterialModule } from '../../angular-material.module';
import { PaginatorModule } from '../shared/paginator/paginator.module';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    AngularMaterialModule,
    PaginatorModule
  ],
  declarations: [
    LoginComponent
  ],
})
export class LoginModule { }
