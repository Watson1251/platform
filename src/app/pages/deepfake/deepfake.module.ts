import { NgModule } from '@angular/core';
import { NbActionsModule, NbAlertModule, NbCardModule, NbIconModule, NbPopoverModule, NbSearchModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DeepfakeRoutingModule } from './deepfake-routing.module';
import { DeepfakeComponent } from './deepfake.component';
import { GridComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { TypographyComponent } from './typography/typography.component';
import { SearchComponent } from './search-fields/search-fields.component';
import { DeepfakeDetectionComponent } from './deepfake-detection/deepfake-detection.component';

import { NgxDropzoneModule } from 'ngx-dropzone';

const components = [
  DeepfakeComponent,
  DeepfakeDetectionComponent,
  GridComponent,
  IconsComponent,
  TypographyComponent,
  SearchComponent,
];

@NgModule({
  imports: [
    NbCardModule,
    NbPopoverModule,
    NbSearchModule,
    NbIconModule,
    NbAlertModule,
    NbActionsModule,
    ThemeModule,
    DeepfakeRoutingModule,
    NgxDropzoneModule
  ],
  declarations: [
    ...components,
  ],
})
export class DeepfakeModule { }
