import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IContact } from 'src/app/models/contact.model';
import { IGroup } from 'src/app/models/group.model';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css'],
})
export class AddContactComponent implements OnInit {
  allGroups: IGroup[];
  errorMsg: string;
  loading: boolean;
  imgUrl: string;

  @ViewChild('f') myForm: NgForm;

  constructor(private router: Router, private contactService: ContactService) {}

  ngOnInit(): void {
    this.loading = true;
    this.contactService.getAllGroups().subscribe(
      (groups) => {
        this.loading = false;

        this.allGroups = groups;
      },
      (error) => {
        this.loading = false;

        this.errorMsg = error;
      }
    );
  }

  addContact() {
    if (this.myForm.valid) {
      const newContact: IContact = this.myForm.value;
      this.loading = true;

      this.contactService.createContact({ ...newContact }).subscribe(
        (data) => {
          this.loading = false;
          this.errorMsg = null;
          this.router.navigate(['/']);
        },
        (error) => {
          this.loading = false;
          this.errorMsg = error;
        }
      );
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
