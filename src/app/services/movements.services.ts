import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, catchError, throwError } from "rxjs";

import { environment } from "../../environments/environment";
import { Movement } from "../models/movement.model";

const BACKEND_URL = environment.apiUrl + '/movements/';

@Injectable({ providedIn: "root" })
export class MovementsService {

  private movements: Movement[] = [];
  private movementsUpdated = new Subject<any>();

  constructor(private http: HttpClient) {}

  getMovements() {
    this.http
      .get<{message: string, movements: any}>(
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

            var fetchedMovements = response.body.movements;
            var tempMovements: Movement[] = [];

            fetchedMovements.forEach((item: any) => {
                const movement: Movement = {
                  id: item._id,
                  movement_timestamp: item.movement_timestamp,
                  movement_from: item.movement_from,
                  movement_to: item.movement_to,
                  moved_by: item.moved_by,
                  notes: item.notes,
                };
                tempMovements.push(movement);
            });

            this.movements = tempMovements;
            this.movementsUpdated.next(this.movements);
        }
      });
  }

  getMovement(id: string) {
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

  createMovement(movement: Movement) {
    return this.http
      .post<any>(
        BACKEND_URL + 'create/',
        movement,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  updateMovement(movement: Movement) {
    return this.http
      .post<any>(
        BACKEND_URL + 'update/',
        movement,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  deleteMovement(id: string) {
    return this.http
      .post<any>(
        BACKEND_URL + 'delete/',
        {id: id},
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

  getMovementsUpdateListener() {
    return this.movementsUpdated.asObservable();
  }

}
