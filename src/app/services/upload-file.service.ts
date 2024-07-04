import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SnackbarService } from './snackbar.service';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/file-upload/';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) { }

  upload(file: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('uploadedBy', "Watson");
    
    return this.http
      .post<any>(
        BACKEND_URL + "create/",
        formData,
        {
          observe: 'events',
          reportProgress: true,
        }
      )
      .pipe(
        map(event => this.getEventMessage(event))
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  private getEventMessage(event: HttpEvent<any>): number {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return event.total ? Math.round(100 * event.loaded / event.total) : 0;
      case HttpEventType.Response:
        return 100;
      default:
        return 0;
    }
  }

  handleError(error: HttpErrorResponse) {
    var message = '';
    
    // Client-side error occurred
    if (error.error instanceof ErrorEvent) {
      message = 'حدث خطأ في العميل.';
    
    // Server-side error occurred
    } else {
      message = 'حدث خطأ في المزود.';
    }

    if (error.error.message) {
      message += "\n";
      message += error.error.message;
    }

    this.snackbarService.openSnackBar(message, 'failure');
    return throwError(message);
  }
}
