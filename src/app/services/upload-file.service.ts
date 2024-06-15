import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private uploadUrl = 'http://localhost:3000/upload'; // Replace with your back-end endpoint

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add any headers you need
    });

    return this.http.post(this.uploadUrl, formData, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      responseType: 'text' // Expect a text response
    }).pipe(
      map(event => this.getEventMessage(event))
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
}
