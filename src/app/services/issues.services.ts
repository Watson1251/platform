import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, catchError, throwError } from "rxjs";

import { environment } from "../../environments/environment";
import { Issue } from "../models/issue.model";

const BACKEND_URL = environment.apiUrl + '/issues/';

@Injectable({ providedIn: "root" })
export class IssuesService {

  private issues: Issue[] = [];
  private issuesUpdated = new Subject<any>();

  constructor(private http: HttpClient) {}

  getIssues() {
    this.http
      .get<{message: string, issues: any}>(
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

            var fetchedIssues = response.body.issues;
            var tempIssues: Issue[] = [];

            fetchedIssues.forEach((item: any) => {
                const issue: Issue = {
                  id: item._id,
                  issue: item.issue,
                  issue_timestamp: item.issue_timestamp,
                  issue_status: item.issue_status,
                  issued_by: item.issued_by,
                  assigned_to: item.assigned_to,
                  notes: item.notes,
                };
                tempIssues.push(issue);
            });

            this.issues = tempIssues;
            this.issuesUpdated.next(this.issues);
        }
      });
  }

  getIssue(id: string) {
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

  createIssue(issue: Issue) {
    return this.http
      .post<any>(
        BACKEND_URL + 'create/',
        issue,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  updateIssue(issue: Issue) {
    return this.http
      .post<any>(
        BACKEND_URL + 'update/',
        issue,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  deleteIssue(id: string) {
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

  getIssuesUpdateListener() {
    return this.issuesUpdated.asObservable();
  }

}
