import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbIconLibraries } from '@nebular/theme';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'ngx-deepfake-detection',
  styleUrls: ['./deepfake-detection.component.scss'],
  templateUrl: './deepfake-detection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeepfakeDetectionComponent {

  constructor(
    iconsLibrary: NbIconLibraries,
    private snackbarService: SnackbarService
  ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);

    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  files: File[] = [];

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
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  evaIcons = [];

  icons = {

    ionicons: [
      'ionic', 'arrow-right-b', 'arrow-down-b', 'arrow-left-b', 'arrow-up-c', 'arrow-right-c',
      'arrow-down-c', 'arrow-left-c', 'arrow-return-right', 'arrow-return-left', 'arrow-swap',
      'arrow-shrink', 'arrow-expand', 'arrow-move', 'arrow-resize', 'chevron-up',
      'chevron-right', 'chevron-down', 'chevron-left', 'navicon-round', 'navicon',
      'drag', 'log-in', 'log-out', 'checkmark-round', 'checkmark', 'checkmark-circled',
      'close-round', 'plus-round', 'minus-round', 'information', 'help',
      'backspace-outline', 'help-buoy', 'asterisk', 'alert', 'alert-circled',
      'refresh', 'loop', 'shuffle', 'home', 'search', 'flag', 'star',
      'heart', 'heart-broken', 'gear-a', 'gear-b', 'toggle-filled', 'toggle',
      'settings', 'wrench', 'hammer', 'edit', 'trash-a', 'trash-b',
      'document', 'document-text', 'clipboard', 'scissors', 'funnel',
      'bookmark', 'email', 'email-unread', 'folder', 'filing', 'archive',
      'reply', 'reply-all', 'forward',
    ],

    fontAwesome: [
      'adjust', 'anchor', 'archive', 'chart-area', 'arrows-alt', 'arrows-alt-h',
      'arrows-alt-v', 'asterisk', 'at', 'car', 'ban', 'university',
      'chart-bar', 'barcode', 'bars', 'bed', 'beer',
      'bell', 'bell-slash', 'bicycle', 'binoculars',
      'birthday-cake', 'bolt', 'bomb', 'book', 'bookmark',
      'briefcase', 'bug', 'building', 'bullhorn',
    ],

    fontAwesomeRegular: ['chart-bar', 'bell', 'bell-slash', 'bookmark', 'building'],
  };

}
