import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'التزييف العميق (DeepFake)',
    icon: 'eye-outline',
    group: true,
  },
  {
    title: 'الكشف',
    icon: 'search-outline',
    link: '/pages/deepfake/detection',
    home: true,
  },
  {
    title: 'التوليد',
    icon: 'repeat-outline',
    link: '/pages/deepfake/detection',
  },


  {
    title: 'تحويل الصوت إلى نص',
    icon: 'edit-2-outline',
    group: true,
  },
  {
    title: 'الكشف (Detection)',
    icon: 'search-outline',
    link: '/pages/deepfake/detection',
    home: true,
  },
  {
    title: 'التوليد (Generation)',
    icon: 'repeat-outline',
    link: '/pages/deepfake/detection',
  },
];
