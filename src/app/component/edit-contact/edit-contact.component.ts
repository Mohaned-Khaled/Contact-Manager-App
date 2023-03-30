import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IContact } from 'src/app/models/contact.model';
import { IGroup } from 'src/app/models/group.model';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit, OnDestroy {
  contactData: IContact;
  allGroups: IGroup[];
  loading: boolean;
  errorMsg: string;
  groupSub: Subscription;
  contactSub: Subscription;
  editSub: Subscription;
  contactId: string;

  myForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    const contactId = this.route.snapshot.params['id'];
    this.contactId = contactId;
    this.loading = true;

    this.contactSub = this.contactService.getSingleContact(contactId).subscribe(
      (data) => {
        this.contactData = data;
        this.errorMsg = null;

        this.groupSub = this.contactService.getAllGroups().subscribe(
          (data) => {
            this.allGroups = data;
            this.errorMsg = null;

            this.myForm = new FormGroup({
              name: new FormControl(this.contactData.name, [
                Validators.required,
              ]),
              email: new FormControl(this.contactData.email, [
                Validators.required,
              ]),
              photo: new FormControl(this.contactData.photo, [
                Validators.required,
              ]),
              mobile: new FormControl(this.contactData.mobile, [
                Validators.required,
              ]),
              company: new FormControl(this.contactData.company, [
                Validators.required,
              ]),
              title: new FormControl(this.contactData.title, [
                Validators.required,
              ]),
              groupId: new FormControl(this.contactData.groupId, [
                Validators.required,
              ]),
            });

            this.loading = false;
          },
          (error) => {
            this.loading = false;
            this.errorMsg = error;
          }
        );
      },
      (error) => {
        this.loading = false;
        this.errorMsg = error;
      }
    );
  }

  onEdit() {
    this.loading = true;
    const edittedContact: IContact = {
      ...this.myForm.value,
      id: this.contactId,
    };
    this.editSub = this.contactService.editContact(edittedContact).subscribe(
      (data) => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      (error) => {
        this.loading = false;
        this.errorMsg = error;
      }
    );
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.groupSub?.unsubscribe();
    this.contactSub.unsubscribe();
    this.editSub?.unsubscribe();
  }
}
