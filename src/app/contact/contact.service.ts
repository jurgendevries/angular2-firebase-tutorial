import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable  } from 'angularfire2';

import { Contact } from './contact.model';

@Injectable()
export class ContactService {
    private contacten: FirebaseListObservable<any[]>;
    constructor(
        private af: AngularFire
    ) {
        this.contacten = af.database.list('/contacten');
    }

    contactToevoegen(contact: Contact): void {
        this.contacten.push(contact)
        .then(response => {
          console.log("Groep toegevoegd!");
        })
        .catch(error => {
          console.log(error);
        });
    }

    getContacten(id: string): FirebaseListObservable<any[]> {
        return this.af.database.list('/contacten', {
            query: {
                orderByChild: 'groepId',
                equalTo: id
            }
        });
    }
}