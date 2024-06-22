import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Device } from '../../models/device.model';
import { Movement } from '../../models/movement.model';
import { Note } from '../../models/note.model';
import { User } from '../../models/user.model';

interface RowData {
  id: number,
  name: string,
  username: string,
  role: string
}

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ar'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class UsersComponent {

  displayedColumns: string[] = ['select', 'id', 'name', 'username', 'role'];

  dataSource: MatTableDataSource<RowData>;
  selection = new SelectionModel<RowData>(true, []);

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatSort, { static: false }) set setSort(content: any) {
    if (content) {
      this.sort = content;
      this.dataSource.sort = this.sort as MatSort;
    }
  }

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) set setPaginator(content: any) {
    if (content) {
      this.paginator = content as MatPaginator;

      this.length = this.defaultLength;
      this.pageSize = this.defaultPageSize;
      this.pageIndex = this.defaultPageIndex;
      this.pageSizeOptions = this.defaultPageSizeOptions;

      this.paginator._intl.itemsPerPageLabel = 'العناصر:';
      this.paginator._intl.firstPageLabel = 'الصفحة الأولى';
      this.paginator._intl.previousPageLabel = 'الصفحة السابقة';
      this.paginator._intl.nextPageLabel = 'الصفحة التالية';
      this.paginator._intl.lastPageLabel = 'الصفحة الأخيرة';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        const start = page * pageSize + 1;
        const end = (page + 1) * pageSize;
        return `${start.toString()} - ${end.toString()} من ${length.toString()}`;
      };

      this.dataSource.paginator = this.paginator;
    }
  }

  users: User[] = [];
  sortedUsers: User[] = [];
  shownRows: RowData[] = [
    {
      id: 0,
      name: "عبدالرحمن الصابري",
      username: "am3737",
      role: "admin"
    },
    {
      id: 1,
      name: "شهاب علي",
      username: "sa",
      role: "user"
    },
    {
      id: 2,
      name: "محمد أحمد",
      username: "ma",
      role: "user"
    },
    {
      id: 3,
      name: "ناصر سالم",
      username: "ns",
      role: "admin"
    }
  ];

  selectedUser: User = {
    id: '',
    name: '',
    username: '',
    role: ''
  };

  activeIndex = 0;

  defaultLength = 5;
  defaultPageSize = 5;
  defaultPageIndex = 0;
  defaultPageSizeOptions = [5, 10, 25];

  length = 5;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  iterations = 5;

  pageEvent?: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  constructor(
  ) {
    // this.shownRows = this.generateRows();
    this.dataSource = new MatTableDataSource(this.shownRows);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  getUser(id: string) {

  }

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedUsers = data;
      return;
    }

    // this.sortedUsers = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'movement_timestamp':
    //       return this.compare(a.movement_timestamp, b.movement_timestamp, isAsc);
    //     case 'movement_from':
    //       return this.compare(a.movement_from, b.movement_from, isAsc);
    //     case 'movement_to':
    //       return this.compare(a.movement_to, b.movement_to, isAsc);
    //     case 'moved_by':
    //       return this.compare(a.moved_by, b.moved_by, isAsc);
    //     default:
    //       return 0;
    //   }
    // });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  showDate(timestamp: number) {
    return moment(timestamp).locale("ar").format('LL');
  }

  enToAr(number: number | string) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const numberString = String(number);

    let arabicNumber = '';
    for (let i = 0; i < numberString.length; i++) {
      const digit = parseInt(numberString[i], 10);
      if (!isNaN(digit)) {
        arabicNumber += arabicDigits[digit];
      } else {
        arabicNumber += numberString[i];
      }
    }

    return arabicNumber;
  }

  arToEn(input: string) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Replace each Arabic number with its corresponding English number
    for (let i = 0; i < arabicNumbers.length; i++) {
      const arabicRegex = new RegExp(arabicNumbers[i], 'g');
      input = input.replace(arabicRegex, englishNumbers[i]);
    }

    return input;
  }

  isSelected(row: any) {
    var isSelected = this.selection.isSelected(row);
    this.selection.clear();

    if (isSelected) {
      this.selection.deselect(row);
    } else {
      this.selection.select(row);

      var time = new Date().getTime();
      var targetUser = this.users.find(i => i.id == row.id);

      const user: User = {
        id: row.id,
        name: row.name,
        username: row.username,
        role: row.role
      }

      this.selectedUser = user;
    }
  }

  applyFilter(event: Event) {
    if (!this.dataSource) {
      return;
    }

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  movementDialog(status: string) {
    
  }

  noteDialog(status: string, row: any) {
    
  }

  isAllowed(permission: string) {
  }

}
