import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeepfakeComponent } from './deepfake.component';
import { GridComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { TypographyComponent } from './typography/typography.component';
import { SearchComponent } from './search-fields/search-fields.component';
import { DeepfakeDetectionComponent } from './deepfake-detection/deepfake-detection.component';

const routes: Routes = [{
  path: '',
  component: DeepfakeComponent,
  children: [ {
    path: 'detection',
    component: DeepfakeDetectionComponent,
  }, {
    path: 'grid',
    component: GridComponent,
  }, {
    path: 'icons',
    component: IconsComponent,
  }, {
    path: 'typography',
    component: TypographyComponent,
  }, {
    path: 'search-fields',
    component: SearchComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeepfakeRoutingModule { }
