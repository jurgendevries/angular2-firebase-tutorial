import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { GroepComponent } from './groep/groep.component';
import { GroepService } from './groep/groep.service';
import { ContactComponent } from './contact/contact.component';
import { ContactService } from './contact/contact.service';
// Must export the config
export const firebaseConfig = {
    apiKey: "AIzaSyDTQHemdk3VG3epBLKtS9zY2qk3UR8xNAU",
    authDomain: "test-blog-26f4b.firebaseapp.com",
    databaseURL: "https://test-blog-26f4b.firebaseio.com",
    storageBucket: "test-blog-26f4b.appspot.com"
};
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routing
  ],
  providers: [
    GroepService,
    ContactService
  ],
  declarations: [ AppComponent, GroepComponent, ContactComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}



 