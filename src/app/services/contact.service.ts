import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { IContact } from '../models/contact.model';
import { IGroup } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) {}

  getAllContacts() {
    return this.http
      .get<IContact[]>('http://localhost:9000/contacts')
      .pipe(catchError(this.handleError));
  }

  getSingleContact(contactId: string) {
    return this.http
      .get<IContact>(`http://localhost:9000/contacts/${contactId}`)
      .pipe(catchError(this.handleError));
  }

  editContact(edittedContact: IContact) {
    return this.http
      .put<IContact>(`http://localhost:9000/contacts/${edittedContact.id}`, {
        ...edittedContact,
      })
      .pipe(catchError(this.handleError));
  }

  createContact(contact: IContact) {
    return this.http
      .post('http://localhost:9000/contacts', { ...contact })
      .pipe(catchError(this.handleError));
  }

  deleteContact(contactId: string) {
    return this.http.delete(`http://localhost:9000/contacts/${contactId}`);
  }

  getAllGroups() {
    return this.http
      .get<IGroup[]>('http://localhost:9000/groups')
      .pipe(catchError(this.handleError));
  }

  private handleError(error) {
    if (error.message) {
      return throwError(`${error.message}`);
    } else {
      return throwError(
        `There is an error please try again later ${error.status}`
      );
    }
  }
}
