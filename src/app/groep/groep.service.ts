import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable  } from 'angularfire2';
import { Groep } from './groep.model';

@Injectable()
export class GroepService {
    private groepen: FirebaseListObservable<any[]>;

    constructor(
        private af: AngularFire
    ) {
        this.groepen = af.database.list('/groepen');
    }

    groepToevoegen(groep: Groep): void {
        this.groepen.push(groep)
        .then(response => {
          console.log("Groep toegevoegd!");
        })
        .catch(error => {
          console.log(error);
        });
    }

    getGroepen(): FirebaseListObservable<any[]> {
        return this.groepen;
    }
}