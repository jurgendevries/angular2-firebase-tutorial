import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroepComponent } from './groep/groep.component';
import { ContactComponent } from './contact/contact.component';

const appRoutes: Routes = [
    {
        path: 'groepen',
        component: GroepComponent
    },
    {
        path: 'groepen/:id',
        component: ContactComponent
    },
    {
        path: '**',
        redirectTo: '/groepen',
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);