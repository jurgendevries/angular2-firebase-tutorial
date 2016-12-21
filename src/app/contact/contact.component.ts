import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Contact } from './contact.model';
import { ContactService } from './contact.service'; 

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  contacten: FirebaseListObservable<any[]>;
  groepId: string;
  
  constructor(
    private af: AngularFire,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  contactToevoegen(formData: any): void {
    if (formData.valid) {
      let contact: Contact = new Contact(this.groepId, formData.value.naam, formData.value.adres, formData.value.tel);
      this.contactService.contactToevoegen(contact);
      formData.reset();
    }    
  }
  
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
        let id = params['id'];
        this.groepId = id;
    });
    this.contacten = this.contactService.getContacten(this.groepId);
  }
}