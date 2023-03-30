import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IContact } from 'src/app/models/contact.model';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-manager',
  templateUrl: './contact-manager.component.html',
  styleUrls: ['./contact-manager.component.css'],
})
export class ContactManagerComponent implements OnInit, OnDestroy {
  allContacts: IContact[];
  errorMsg: string = null;
  contactSub: Subscription;
  deleteSub: Subscription;
  loading: boolean;
  deleteContactId: string;
  searchText: string;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loading = true;
    this.onContactsLoad();
  }

  onContactsLoad() {
    this.contactSub = this.contactService.getAllContacts().subscribe(
      (data) => {
        this.loading = false;
        this.allContacts = data;
      },
      (error) => {
        this.loading = false;
        this.errorMsg = error;
      }
    );
  }

  onDelete(id: string) {
    this.loading = true;
    this.deleteSub = this.contactService.deleteContact(id).subscribe(() => {
      this.onContactsLoad();
    });
  }

  ngOnDestroy(): void {
    this.contactSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }
}
