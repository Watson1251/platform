import { NgModule } from '@angular/core';
import { NbActionsModule, NbAlertModule, NbCardModule, NbIconModule, NbPopoverModule, NbSearchModule } from '@nebular/theme';

import { ThemeModule } from '../../../@theme/theme.module';
import { DeepfakeRoutingModule } from './deepfake-routing.module';
import { DeepfakeComponent } from './deepfake.component';
import { DeepfakeDetectionComponent } from './deepfake-detection/deepfake-detection.component';

import { NgxDropzoneModule } from 'ngx-dropzone';

const components = [
  DeepfakeComponent,
  DeepfakeDetectionComponent,
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
