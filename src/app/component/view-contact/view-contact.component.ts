import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IContact } from 'src/app/models/contact.model';
import { IGroup } from 'src/app/models/group.model';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css'],
})
export class ViewContactComponent implements OnInit, OnDestroy {
  contactData: IContact;
  contactSub: Subscription;
  loading: boolean;
  errorMsg: string;
  theGroup: IGroup;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    const contactId = this.route.snapshot.params['id'];
    this.loading = true;

    this.contactService.getSingleContact(contactId).subscribe(
      (data) => {
        this.loading = false;
        this.errorMsg = null;

        this.contactData = data;

        this.contactService.getAllGroups().subscribe((data: IGroup[]) => {
          this.theGroup = data.find(
            (group) => group.id === this.contactData.groupId
          );
        });
      },
      (error) => {
        this.loading = false;

        this.errorMsg = error;
      }
    );
  }

  ngOnDestroy(): void {
    this.contactSub?.unsubscribe();
  }
}
