import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, catchError, throwError } from "rxjs";

import { environment } from "../../environments/environment";
import { Note } from "../models/note.model";

const BACKEND_URL = environment.apiUrl + '/notes/';

@Injectable({ providedIn: "root" })
export class NotesService {

  private notes: Note[] = [];
  private notesUpdated = new Subject<any>();

  constructor(private http: HttpClient) {}

  getNotes() {
    this.http
      .get<{message: string, notes: any}>(
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

            var fetchedNotes = response.body.notes;
            var tempNotes: Note[] = [];

            fetchedNotes.forEach((item: any) => {
                const note: Note = {
                  id: item._id,
                  note: item.note,
                  noted_by: item.noted_by,
                  note_timestamp: item.note_timestamp,
                };
                tempNotes.push(note);
            });

            this.notes = tempNotes;
            this.notesUpdated.next(this.notes);
        }
      });
  }

  getNote(id: string) {
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

  createNote(note: Note) {
    return this.http
      .post<any>(
        BACKEND_URL + 'create/',
        note,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  updateNote(note: Note) {
    return this.http
      .post<any>(
        BACKEND_URL + 'update/',
        note,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  deleteNote(id: String) {
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

  getNotesUpdateListener() {
    return this.notesUpdated.asObservable();
  }

}
