import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, HostListener, Input, ViewChild } from '@angular/core';
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
import { Role } from '../../models/role.model';
import { RoleDialogInterface } from './role-dialog/role-dialog-interface';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { SnackbarService } from '../../services/snackbar.service';
import { RolesService } from '../../services/roles.services';
import { PermissionsService } from '../../services/permissions.services';
import { Permission } from '../../models/permission.model';
// import { DeviceDialogInterface } from './devices/device-dialog/device-dialog-interface';
// import { DeviceDialogComponent } from './devices/device-dialog/device-dialog.component';

interface RowData {
  id: number,
  roleId: string,
  role: string,
}

@Component({
  selector: 'ngx-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.scss'],
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
export class PrivilegesComponent {

  // ============================= PAGINATION =============================
  defaultLength = 5;
  defaultPageSize = 5;
  defaultPageIndex = 0;
  defaultPageSizeOptions = [5, 10, 25, 50, 100];

  length = 5;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 50, 100];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  shownRows: RowData[] = [];

  displayedColumns: string[] = ['select', 'id', 'role'];

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

      const devicesLength = this.roles.length;
      var index = 0;
      for (var i = 0; i < this.pageSizeOptions.length; i++) {
        const pageSize = this.pageSizeOptions[i];
        index = i;
        if (devicesLength < pageSize) {
          break;
        }
      };

      if (index == 0) {
        this.pageSizeOptions = [devicesLength];
        this.pageSize = devicesLength;
      } else {
        this.pageSizeOptions = this.pageSizeOptions.slice(0, index);
        if (!this.pageSizeOptions.includes(devicesLength)) {
          this.pageSizeOptions.push(devicesLength);
        }
      }
      
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    }
  }

  pageEvent?: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  // ============================= PAGINATION =============================

  private rolesSub?: Subscription;
  private permissionsSub?: Subscription;
  public data: any = null;

  searchValue: string = "";

  roles: Role[] = [];
  sortedRoles: Role[] = [];
  chosenRole: Role = {id: '', role: '', permissions: []};
  
  backupPermissions: Permission[] = [];
  permissions: Permission[] = [];

  tileIsSelected: boolean = false;
  selectedRole: Role = {
    id: '',
    role: '',
    permissions: []
  };

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public rolesService: RolesService,
    public permissionsService: PermissionsService,
    private snackbarService: SnackbarService
  ) {
    this.shownRows = this.generateRows();
    this.dataSource = new MatTableDataSource(this.shownRows);
  }

  ngOnInit() {
    this.rolesService.getRoles();
    this.rolesSub = this.rolesService.getRolesUpdateListener().subscribe((rolesData: any) => {
      this.roles = rolesData;
      this.sortedRoles = this.roles.slice();

      // const sortState: Sort = {active: 'id', direction: 'asc'};
      // this.sortData(sortState);

      this.shownRows = this.generateRows();
      this.dataSource.data = this.shownRows;
      
      console.log(this.shownRows);

      // this.permissionsService.getPermissions();
      // this.permissionsSub = this.permissionsService.getPermissionsUpdateListener().subscribe((permissionsData: any) => {

      //   this.permissions = permissionsData;
      //   this.backupPermissions = this.permissions.slice();

      // });
    });
  }

  ngOnDestroy() {
    this.rolesSub?.unsubscribe();
    this.permissionsSub?.unsubscribe();
  }

  generateRows() {
    var rowData: RowData[] = [];

    for (let i = 1; i <= this.sortedRoles.length; i++) {
      const role = this.sortedRoles[i-1];
      const data: RowData = {
        id: i,
        roleId: role.id,
        role: role.role
      };
      rowData.push(data);
    }

    return rowData;
  }

  sortData(sort: Sort) {
    const data = this.roles.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedRoles = data;
      return;
    }

    this.sortedRoles = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'role':
          return this.compare(a.role, b.role, isAsc);
        default:
          return 0;
      }
    });
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

  roleDialog(status: string) {
    const dialogData: RoleDialogInterface = {
      status: status,
      roles: this.roles,
      targetRole: this.chosenRole
    }

    const dialogRef = this.dialog.open(RoleDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {
        this.chosenRole = {id: '', role: '', permissions: []};

        if (status == "add") {
          this.snackbarService.openSnackBar('تم إضافة دور جديد بنجاح.', 'success');
        } else if (status == "edit") {
          this.snackbarService.openSnackBar('تم تعديل الدور بنجاح.', 'success');
        } else if (status == "delete") {
          this.snackbarService.openSnackBar('تم حذف الدور بنجاح.', 'success');
        }
      }
    });
  }

  isSelected(row: any) {
    var isSelected = this.selection.isSelected(row);
    this.selection.clear();

    if (isSelected) {
      this.selection.deselect(row);
      this.selectedRole = {
        id: '',
        role: '',
        permissions: []
      };
    } else {
      this.selection.select(row);

      var device = this.roles.find(a => a.id == row.deviceId);

      if (device) {
        this.selectedRole = device;
      }
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

  isAllowed(permission: string) {
    // return this.authService.isAllowed(permission);
  }
}
