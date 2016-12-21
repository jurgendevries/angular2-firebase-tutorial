import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { Groep } from './groep.model';
import { GroepService } from './groep.service';

@Component({
  selector: 'app-groep',
  templateUrl: './groep.component.html',
  styleUrls: ['./groep.component.css']
})

export class GroepComponent implements OnInit {
    groepen: FirebaseListObservable<any[]>;

    constructor(
        private af: AngularFire,
        private groepService: GroepService,
        private router: Router
    ) { }

    groepToevoegen(formData: any): void {
        if (formData.valid) {
            let groep: Groep = new Groep(formData.value.titel);
            this.groepService.groepToevoegen(groep);
            formData.reset();
        }    
    }
    
    selecteerGroep(groepId: string): void {
        this.router.navigate(['/groepen', groepId]);
    }

    ngOnInit() {
        this.groepen = this.groepService.getGroepen();
    }

}
