import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbComponentSize, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { SnackbarService } from '../../../services/snackbar.service';
import { UploadFileService } from '../../../services/upload-file.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-deepfake-detection',
  styleUrls: ['./deepfake-detection.component.scss'],
  templateUrl: './deepfake-detection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepfakeDetectionComponent {

  constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private uploadFileService: UploadFileService,
    private snackbarService: SnackbarService
  ) {

  }

  files: File[] = [];
  actionSize: NbComponentSize = 'medium';
  isAnalyzing: boolean = false;

  ngOnInit() {
    const breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(map(([, breakpoint]) => breakpoint.width))
      .subscribe((width: number) => {
        this.actionSize = width > breakpoints.md ? 'medium' : 'small';
      });
  }

  onSelect(event: any) {
    for (let file of event.addedFiles) {
      if (!this.files.some(f => f.name === file.name && f.size === file.size && f.type === file.type)) {
        this.files.push(file);
      } else {
        this.snackbarService.openSnackBar('يوجد ملف مُضاف بنفس الاسم. الرجاء حذفه أو تغيير اسمه.', 'failure');
      }
    }
  }

  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  analyzeFiles() {
    if (this.isAnalyzing)
      return
    
    this.files.forEach(file => {
      this.isAnalyzing = true;
      if (file) {
        this.uploadFileService.upload(file).subscribe(
          progress => console.log(progress),
          // progress => this.progress = progress,
          error => console.error(error)
        );
      }
    });
    this.isAnalyzing = false;
  }

  clearFiles() {
    if (this.isAnalyzing)
      return
    this.files.splice(0, this.files.length);
  }

}
