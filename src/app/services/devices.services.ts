import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, catchError, throwError } from "rxjs";

import { environment } from "../../environments/environment";
import { Device } from "../models/device.model";

const BACKEND_URL = environment.apiUrl + '/devices/';

@Injectable({ providedIn: "root" })
export class DevicesService {

  private devices: Device[] = [];
  private devicesUpdated = new Subject<any>();

  constructor(private http: HttpClient) {}

  getDevices() {
    this.http
      .get<{message: string, devices: any}>(
        BACKEND_URL,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      )
      .subscribe(response => {
        if (response.status == 200 || response.status == 201) {
            if (response.body == null) {
                return;
            }

            var fetchedDevices = response.body.devices;
            var tempDevices: Device[] = [];

            fetchedDevices.forEach((item: any) => {
                const device: Device = {
                  id: item._id,
                  serial: item.serial,
                  assigned_department: item.assigned_department,
                  location: item.location,
                  deployment_timestamp: item.deployment_timestamp,
                  default_password: item.default_password,
                  version: item.version,
                  openIssues: item.openIssues,
                  movements: item.movements,
                  issues: item.issues,
                  notes: item.notes
                };
                tempDevices.push(device);
            });

            this.devices = tempDevices;
            this.devicesUpdated.next(this.devices);
        }
      });
  }

  getDevice(id: string) {
    return this.http
      .get<any>(
        BACKEND_URL + id,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  createDevice(device: Device) {
    return this.http
      .post<any>(
        BACKEND_URL + 'create/',
        device,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  updateDevice(device: Device) {
    return this.http
      .post<any>(
        BACKEND_URL + 'update/',
        device,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  deleteDevice(device: Device) {
    return this.http
      .post<any>(
        BACKEND_URL + 'delete/',
        device,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // Client-side error occurred
        console.error('Client-side error:', error.error.message);
    } else {
        // Server-side error occurred
        console.error('Server-side error:', error.status, error.error);
    }
    return throwError('Something went wrong. Please try again later.');
  }

  getDevicesUpdateListener() {
    return this.devicesUpdated.asObservable();
  }

}
