# Introductie in Angular(2) en Firebase
In deze tutorial laat ik je zien hoe je met Angular en Firebase snel een prototype (of POC) voor een web applicatie neer kan zetten. 
Door gebruik te maken van Firebase hoef je je niet druk te maken over de backend van je web applicatie. Dit laten we door Firebase afhandelen. Het is zelfs mogelijk om Authenticatie en Hosting door Firebase te laten regelen. Dat wordt in dit blog niet behandeld. Wel gaan we een web applicatie maken waarin je contacten kan opslaan en groeperen. 
In dit blog komen verschillende aspecten aan bod:
* Hoe zet je snel een Angular applicatie neer?
* Hoe maak je connectie met Firebase vanuit Angular?
* Hoe sla je data op in Firebase en hoe haal je dit er weer uit?
* Werken met een Router in Angular
* Deployen van een Angular applicatie naar Heroku

Wat niet wordt behandeld in dit blog zijn de volgende onderwerpen:
*	Complete uitleg Angular2 en hoe handmatig een Angular2 project te starten, we maken gebruik van de Angular-CLI om snel aan de slag te kunnen
* Verschil tussen AngularJS en Angular2
*	Unit testen van de applicatie
*	Modulariseren van de applicatie
*	User authentication met Firebase

Wellicht komen een aantal van deze componenten in een toekomstige tutorial aan bod.

# Code
In deze tutorial wordt de code in blokken getoond. Hierin wordt voor de TypeScript en html code getoond wat er wordt toegevoegd aan de code of verwijderd. Dat ziet er als volgt uit:

``` diff
+ deze regel wordt toegevoegd
- en deze verwijderd
+ en deze is gewijzigd
en deze blijft staan
```

De **+** en **-** tekens horen niet bij de code.

Wordt de code compleet vervangen in een bestand of is alle code nieuw dan wordt de volledige code getoond:
``` html
<div class="container">
  container
</div>
```

# Firebase account/project aanmaken en instellen
Ga naar [https://firebase.google.com/](https://firebase.google.com/ "Firebase")

![alt text](https://github.com/jurgendevries/angular2-firebase-tutorial/blob/master/firebase-start.jpg "Firebase")

Klik rechts boven op ‘Aanmelden’. Je kunt hier makkelijk met je Google account aanmelden.
Klik daarna rechts boven op ‘Naar console’. Klik op ‘Nieuw project maken’. Kies een naam en een land en druk op ‘Project maken’. Je wordt automatisch doorverwezen naar het dashboard van je project.
Aangezien we in dit blog geen Authenticatie gaan behandelen gaan we de rechten voor dit project aanpassen zodat de gegevens zonder in te loggen bereikbaar zijn. Standaard zijn de gegevens alleen te bereiken wanneer je ingelogd bent. Ga in het linker menu naar ‘Database’ en vervolgens via het top menu naar ‘Regels’. Vervang de huidige instellingen door deze:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Nu zijn de gegevens publiekelijk toegankelijk. Gebruik deze instellingen dus niet wanneer je (bedrijfs) gevoelige data wil opslaan.

Wanneer je in het topmenu teruggaat naar **Data**, zie je de url van je database:
[https://NAAM-PROJECT.firebaseio.com/](https://NAAM-PROJECT.firebaseio.com/ "Firebase project link")

Aangezien er nog geen data ingevoerd is zie je hier verder niks.

![alt text](https://github.com/jurgendevries/angular2-firebase-tutorial/blob/master/firebase-data-leeg.jpg "Firebase geen data")

Om Firebase straks aan onze applicatie te kunnen koppelen hebben we een aantal gegevens nodig. Door in het linkermenu op ‘Overview’ te klikken kom je weer terug op het project overzicht. Klik hier op ‘Firebase toevoegen aan uw webapp’.

![alt text](https://github.com/jurgendevries/angular2-firebase-tutorial/blob/master/firebase-overview.jpg "Firebase project overzicht")

Kopieer het JSON-object wat getoond wordt en bewaar deze, we zullen de gegevens straks nodig hebben.

# Angular2 Installeren
De snelste manier om aan de slag te kunnen met Angular2 en Firebase is door gebruik te maken van Angular-CLI.

Om Angular-CLI te installeren heb je NodeJS en NPM nodig. Voor AngularFire2 heb je minimaal Angular-CLI versie 1.0.0-beta.14 nodig. Om deze versie te kunnen installeren ga je naar [https://nodejs.org/en/](https://nodejs.org/en/ "NodeJS") toe en download je de installer voor de laatste stabiele versie (op dit moment 6.9.2). Hierbij krijg je automatisch de bijbehorende NPM versie geïnstalleerd.

Wanneer je NodeJS en NPM geïnstalleerd hebt kun je Angular CLI installeren. Ga naar de folder waar je je webapp wilt ontwikkelen. Met het volgende commando in Windows Command venster wordt Angular-CLI geïnstalleerd:
```sh
npm install -g angular-cli@latest
npm install -g typings 
npm install -g typescript
```

@latest zorgt ervoor dat je de nieuwste versie van Angular-CLI installeert.
-g zorgt ervoor dat Angular-CLI globaal beschikbaar wordt gesteld.
Naast Angular-CLI installeren we ook typings en typescript om gebruik te kunnen maken van TypeScript.

Hierna het volgende commando om een nieuw Angular2 project aan te maken en de project folder in te gaan.
```sh
ng new <project-name>
```
Wanneer je commando venster uitgeraasd is, heb je een nieuwe folder met alle benodigdheden (Dit kan even duren). Ga naar deze folder toe met het commando:
```sh
cd <project-name>
```
Om te testen of alles tot zover werkt het volgende commando:

```sh
ng serve
```
Als het commando venster klaar is ga je naar [http://localhost:4200](http://localhost:4200). Als het goed is zie je hier de tekst ‘App works!’ staan. Als dit niet het geval is of je hebt rood gekleurde meldingen in je commando venster staan, kijk dan in het hoofdstuk Troubleshooting of daar een oplossing voor je probleem staat.

Zolang je je commando venster laat draaien zal met elke wijziging in je bestanden automatisch je project opnieuw gebouwd worden en je browser venster herladen worden.

# Angularfire2 en Firebase installeren
Om te kunnen communiceren met ons Firebase project gaan we 2 libraries via NPM toevoegen die ons hierbij zullen helpen. Draait de applicatie nog? Stop deze dan eerst in het windows command venster door CTRL+c te typen en type vervolgens J en enter om te bevestigen. Installeer vervolgens de dependencies via het volgende commando:
```sh
npm install angularfire2 firebase --save
```
Wanneer de dependencies geïnstalleerd zijn ga je in een IDE naar **src/app/app.module.ts**. Zoek je bewaarde Firebase webapp configuratie er weer bij en voeg Firebase op de volgende manier toe:
``` diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
+ import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';

+ export const firebaseConfig = {
+  apiKey: '<your-key>',
+  authDomain: '<your-project-authdomain>',
+  databaseURL: '<your-database-URL>',
+  storageBucket: '<your-storage-bucket>'
+ };

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
+    AngularFireModule.initializeApp(firebaseConfig)
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```
Vervolgens voegen we Firebase aan **src/app/app.component.ts** toe om het te kunnen gebruiken.
``` diff
import { Component } from '@angular/core';
+ import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
+  constructor(
+    af: AngularFire
+  ) {}
}
```
We hebben nu Firebase aan het project toegevoegd maar doen er nog niks mee. Om te testen of het echt werkt gaan Angular aan een lijst met items in Firebase koppelen. Pas **src/app/app.component.ts** aan naar het volgende:
``` diff
import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {
+  items: FirebaseListObservable<any[]>;

  constructor(
    af: AngularFire
  ) {
+    this.items = af.database.list('/items');
  }
}
```
En vervang de code in **src/app/app.component.html** voor:
``` html
<ul>
  <li class="text" *ngFor="let item of items | async">
    {{item.value}}
  </li>
</ul>
```
Omdat er nog geen data in Firebase staat, gaan we deze direct in Firebase toevoegen. Via het dashboard ga je in het linker menu naar database. Via het plusje op het hoofd element kun je makkelijk data toevoegen.

Geef de naam **items** op en laat het waarde veld leeg. Klik op het plusje van het nieuwe element en geef hier de naam **item1** aan. Laat ook hier het waarde veld leeg en klik op het plusje van dit element. In het nieuwe element geef je als naam **value** op en in het waarde veld zet je **item1**. Herhaal de stappen om een tweede item **item2** toe te voegen en druk daarna op toevoegen.

![alt text](https://github.com/jurgendevries/angular2-firebase-tutorial/blob/master/firebase-data.jpg "Firebase data")

Wanneer je je browser venster weer bekijkt zou je je nieuw toegevoegde items nu moeten zien.

# Bootstrap toevoegen
Om een iets prettiger uitziende applicatie te krijgen voegen we bootstrap toe aan ons project met de volgende regel in het **head** gedeelte van **src/index.html**:
``` html
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
```
Daarnaast zetten we een div met de class **container** om onze lijst heen in **src/app/app.component.html**:
``` html
<div class="container">
  <ul>
    <li class="text" *ngFor="let item of items | async">
      {{item.value}}
    </li>
  </ul>
</div>
```

# Datamodel
Omdat de data als JSON opgeslagen wordt kunnen geen gebruik maken van tabellen. Hoe gaan we onze database inrichten?
We kunnen ervoor kiezen om groepen op te slaan met daarin genest onze contacten:
*	Groepen
  *	–KT_uwF2FH23j
    *	NAME: Groep1
      *	Contacten
        *	–KT_xvfDFm2mk
          *	NAME: Contact1
        *	–KT_xvfDFm2mk
          *	NAME: Contact1
        *	–KT_xvfDFm2mk
          *	NAME: Contact1
        *	–KT_xvfDFm2mk
          *	NAME: Contact1
  *	–KT_uwF3FH23j
    *	NAME: Groep2
      *	Contacten
        *	–KT_xvfDFm2mk
          *	NAME: Contact1
        *	–KT_xvfDFm3mk
          *	NAME: Contact1
        *	–KT_xvfDFm4mk
          *	NAME: Contact1
        *	–KT_xvfDFm5mk
          *	NAME: Contact1

Voor de app die we gaan maken zal de hoeveelheid data niet wereldschokkend groot zijn. Maar wanneer je een project begint met serieuze hoeveelheden data, is dit geen goed idee. Firebase moet om alleen een lijstje groepen binnen te halen ook alles binnenhalen wat er onder die groepen hangt. Naarmate de hoeveelheid data toeneemt gaat dit performance problemen opleveren.
Hoe gaan we dan wel onze data opslaan, we kunnen immers geen tabellen aanmaken zoals een SQL-database. Gelukkig slaat Firebase elk item voor ons op met uniek ID. Laten we eens kijken of we daar een beter datamodel mee kunnen maken:
* Groepen
  * -KT_uwF2FH23j
    * NAME: Groep1
  * –KT_uwF3FH23j
    * NAME:  Groep2
  * –KT_uwF4FH23j
    * NAME:  Groep3
  * –KT_uwF5FH23j
    * NAME:  Groep4
*	Contacten
  * –KT_xvfDFm2mk
    * GRP_ID: –KT_uwF2FH23j
    * NAME:  Contact1
  * –KT_xvfDFm2mk
    * GRP_ID: –KT_uwF3FH23j
    * NAME:  Contact1
  * –KT_xvfDFm2mk
    * GRP_ID: –KT_uwF4FH23j
    * NAME:  Contact1
  * –KT_xvfDFm2mk
    * GRP_ID: –KT_uwF5FH23j
    * NAME:  Contact1
  * –KT_xvfDFm2mk 
    * GRP_ID: –KT_uwF2FH23j
    * NAME:  Contact1

Dit lijkt sterk op hoe je in een SQL-database gebruik maakt van foreign keys en zo gaan we dat dus ook in Firebase aanpakken. Op deze manier kunnen we een lijst met groepen tonen zonder de contacten ook meteen op te halen. En op basis van een groep ID kunnen we met een query de contacten uit een groep ophalen. Nu we onze installatie klaar hebben en het datamodel duidelijk is gaan we daadwerkelijk beginnen met onze webapp.

Wanneer er echt grote hoeveelheden data aanwezig zijn zou je niet door alle contacten heen willen zoeken naar die contacten die in de geselecteerde groep zitten. Hiervoor zou je nog een extra node aan kunnen in de database waarin een lijst met groepen en de bijbehorende contact id’s zijn opgeslagen. Dat doen we in dit geval niet.

Om deze structuur te krijgen hoeven we zelf niks te doen in Firebase. Zodra we data proberen toe te voegen aan een pad dat nog niet bestaat in Firebase, maakt Firebase dit zelf aan. We moeten de data alleen op de juiste manier naar Firebase toe sturen.

# Component
Voor het groepen overzicht van de applicatie maken we een apart component aan. We willen de code graag overzichtelijk houden en elk component zijn eigen taak geven. Op deze manier worden het ook echt componenten van de applicatie.
Het groep component gaan we op de makkelijke manier toevoegen via de Angular-CLI met het volgende commando:
```sh
ng g component groep
```
De **g** staat voor **generate**, dit kan ook gebruikt worden maar de **g** is korter. Met dit commando wordt niet alleen de map ‘groep’ met daarin de component onderdelen toegevoegd, maar ook wordt het nieuwe component automatisch aan je **src/app/app.module.ts** toegevoegd waarmee het component beschikbaar wordt gesteld voor de applicatie. Voor de contacten maken we straks met de hand een component aan en zullen we deze stappen zelf uit moeten voeren.

# Data toevoegen aan Firebase vanaf de applicatie
Met het groep component gaan we aan de slag om groepen toe te kunnen voegen in Firebase en vervolgens deze groepen te tonen op het scherm.
Om data in te kunnen voeren maken gebruik van een html formulier dat we aan Angular gaan koppelen met de functionaliteiten van FormsModule, deze is gekoppeld aan de applicatie in app.module.ts en wordt automatisch meegeleverd bij het aanmaken van een nieuw project met de AngularCLI.
Het formulier gaan we opmaken in **src/app/groep/groep.component.html**:
``` html
<form #formData='ngForm'>
  <div class="form-group">
    <input type="text" class=”form-control” (ngModel)="text" placeholder="Groep titel" id="titel" name="titel" rows="10" required/>
  </div>
  <button [disabled]="!formData.valid" (click)="groepToevoegen(formData)" class="btn btn-primary">Opslaan</button>
</form>
<ul>
  <li *ngFor="let groep of groepen | async">
    {{ groep.titel }}
  </li>
</ul>
```
Je ziet dat er een form element met het attribuut **#formData="ngForm"** gebruikt wordt, dit is eigenlijk een verkorte manier om een formulier aan te maken zonder deze in je componentclass te definiëren.  De langere notatie hiervan zou als volgt zijn:
``` html
<form [ngFormModel]="myForm">
```
En in het component zou dan de volgende code opgenomen moeten worden om het geheel werkend te krijgen:
``` typescript
this.myForm = formBuilder.group({
  'subject': '',
  'message': ''
})
```
Voor onze applicatie gebruiken we de verkorte versie.

Er is één inputveld om een groep titel op te geven door deze een **name** en een **(ngModel)** te geven met de waarde **titel** kunnen we deze waarde in de componentclass straks weer opvragen.

In de knop waarmee we het formulier op gaan slaan staan twee belangrijke attributen: **[disabled]** en **(click)**. Een voordeel van de FormsModule gebruiken is dat je makkelijk formulieren kunt valideren. Omdat ons input veld het attribuut required heeft moet hier eerst wat ingevoerd worden voordat de formData de status valid krijgt. Zolang dit niet het geval is blijft de knop disabled en onbruikbaar. Het **(click)** attribuut koppelt de knop aan een functie in onze componentclass (deze moeten we nog aanmaken). Aan deze functie geven we de formData mee zodat deze beschikbaar gesteld wordt in de functie.

Als laatste tonen we de groepen die zijn toegevoegd aan Firebase in een lijstje met titels onder het formulier.
Om de functie waar de knop naar verwijst te kunnen realiseren moeten we eerst een aantal stappen nemen.
* Firebase en FirebaseListObservable importeren in **src/app/groep/groep.component.ts**
* In het groep component maken we een FirebaseListObservable aan direct na de class definitie
* In de constructor definiëren we AngularFire zodat deze beschikbaar is
* In de ngOnInit functie die we van de component generator cadeau hebben gekregen zorgen we dat de groepen aan de eerder gedefinieerde FirebaseListObservable worden gekoppeld
  * Het ‘/groepen’ endpoint bestaat nog niet in Firebase, maar zal automatisch aangemaakt worden zodra we hier iets naar toe schrijven.
* Dan de functie om een groep toe te voegen
En dat ziet er dan als volgt uit:
``` diff
import { Component, OnInit } from '@angular/core';
+ import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-groep',
  templateUrl: './groep.component.html',
  styleUrls: ['./groep.component.css']
})
export class GroepComponent implements OnInit {
+  groepen: FirebaseListObservable<any[]>;
  constructor(
+    private af: AngularFire
  ) {}

+  groepToevoegen(formData: any): void {
+    if (formData.valid) {
+      this.groepen.push({titel: formData.value.titel})
+        .then(response => {
+          console.log('Groep toegevoegd!');
+          formData.reset();
+        })
+        .catch(error => {
+          console.log(error);
+        });
+    }    
+  }

  ngOnInit() {
+    this.groepen = this.af.database.list('/groepen');
  }

}
```
De formData krijgen we vanuit het formulier meegestuurd, wanneer iemand deze functie toch probeert aan te roepen zonder dat de data valide is, gebeurt er nog niks. Wanneer de data wel valide is wordt er een object toegevoegd aan het FirebaseListObject.  Het pushen van een object naar een FirebaseListObservable geeft een promise terug. Met de then methode vangen we een succesvolle response op en met de catch methode eventuele fouten en loggen deze in de console. Met de titel property wordt de lijst met groepen vervolgens weer op het scherm getoond.

# Router
Omdat we niet alles in 1 overzicht willen tonen maar per groep de contacten en een overzicht van de groepen in het contactenboek zullen we verschillende routes in de applicatie beschikbaar moeten stellen. Binnen Angular2 doen we dit met een router.

Momenteel is het nog niet mogelijk om dit vanuit de AngularCLI te genereren dus doen we dit met hand.

Om de router te activeren zijn een aantal stappen benodigd. In **src/app/app.component.html** voegen we de tag <router-outlet></router-outlet> toe net voor de sluit tag van de container-div. 
``` html
<div class="container">
  <ul>
    <li class="text" *ngFor="let item of items | async">
      {{item.value}}
    </li>
  </ul>
+  <router-outlet></router-outlet>
</div>
```
Dit is waar de output van de router straks terug te vinden is. Alles wat er omheen staat zal altijd in beeld zijn. Maar wat binnen de router-outlet getoond wordt is afhankelijk van de url.

Daarnaast hebben we een bestand **src/app/app.routing.ts** nodig waar we onze routes kunnen definiëren. Maak het bestand **src/app/app.routing.ts** aan met de volgende inhoude:
``` typescript
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroepComponent } from './groep/groep.component';

const appRoutes: Routes = [
    {
        path: 'groepen',
        component: GroepComponent
    },
    {
        path: '**',
        redirectTo: '/groepen',
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
```
We importeren de benodigde onderdelen uit Angular en importeren ook het groep component.
Daarna maken we een constante variabele aan, deze zal namelijk niet veranderen tijdens het gebruik van de applicatie, en definiëren hier de routes in als objecten. Elke route moet minimaal bestaan uit een pad (de url achter de slash) en het component wat daaraan gekoppeld moet worden. Het tweede pad dat we aanmaken wordt gebruikt wanneer er geen match met een van de voorgaande paden gevonden is en in dit geval verwijzen we dan ook naar ons groep component.
Met de laatste regel stellen we de router beschikbaar voor onze applicatie. 

Vervolgens importeren we de router in **src/app/app.module.ts** en we voegen **routing** toe aan de import array:
``` diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
+ import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { GroepComponent } from './groep/groep.component';

export const firebaseConfig = {
    apiKey: "AIzaSyD1LgKHv8s8-awyabqjYfG5y-1D7_fKn5I",
    authDomain: "angularfirebase-276b0.firebaseapp.com",
    databaseURL: "https://angularfirebase-276b0.firebaseio.com",
    storageBucket: "angularfirebase-276b0.appspot.com",
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
+    routing
  ],
  declarations: [ AppComponent, GroepComponent ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}
```

Uit het app component halen we nu alle referenties naar items weg en ook de firebase koppeling kan hier inmiddels weggehaald worden. Dit doen we nu immers in het groep component. 
**src/app/app.component.ts**:
``` diff
import { Component } from '@angular/core';
- import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
-  items: FirebaseListObservable<any[]>;

  constructor(
-    this.items = af.database.list('/items');
  ) {}
}
```
**src/app/app.component.html**:
``` diff
<div class="container">
-  <ul>
-    <li class="text" *ngFor="let item of items | async">
-      {{item.value}}
-    </li>
-  </ul>
  <router-outlet></router-outlet>
</div>
```
Verwijder vervolgens ook de items array via het Firebase Data Dashboard, deze hebben we niet meer nodig.

# Model
Door het gebruik van TypeScript hebben we de mogelijkheid om types mee te geven aan variabelen en parameters in functies. Wanneer je een functie definieert die een integer verwacht om mee te rekenen, maar je roept die functie per ongeluk aan met een string krijg je natuurlijk onverwachte uitkomsten. Door types mee te geven aan je functie parameters krijg je van je IDE/Editor al meldingen dat je verkeerde type parameters meegeeft in je functie aanroep. Hierdoor wordt je eerder op je fouten gewezen en dit scheelt je later een hoop debuggen.

Het zou dan ook mooi zijn om de functies in het groep component een parameter van het type groep mee te geven.
Maak in de groep folder een nieuwe bestand aan met de naam **src/app/groep/groep.model.ts**:
``` typescript
export class Groep {
    constructor(
        public titel: string,
    ) {}
};
```
Het lijkt wat overdreven om voor een groep met alleen maar een titel van het type string een model aan te maken. Toch denk ik dat het goed is om je zelf aan te leren dit altijd wel te doen. Wanneer je bijvoorbeeld user authentication aan deze applicatie toe zou voegen wil je een user ID per groep opslaan zodat je weet welke groepen bij welke user horen. Misschien moeten users meerdere adresboeken aan kunnen maken en dan wil je per groep een adresboek ID opslaan.
Om gebruik te maken van dit model voegen we het eerst aan het groep component toe. 
* Begin met het importeren van het groep model in **src/app/groep/groep.component.ts**
* Vervolgens gebruiken we het model om een nieuwe groep aan te maken en door te geven aan Firebase in de groepToevoegen methode
``` diff
import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

+ import { Groep } from './groep.model';

@Component({
  selector: 'app-groep',
  templateUrl: './groep.component.html',
  styleUrls: ['./groep.component.css']
})
export class GroepComponent implements OnInit {
  groepen: FirebaseListObservable<any[]>;
  constructor(
    private af: AngularFire
  ) {}

  groepToevoegen(formData: any): void {
    if (formData.valid) {
+      this.groepen.push(new Groep(formData.value.titel))
        .then(response => {
          console.log("Groep toegevoegd!");
          formData.reset();
        })
        .catch(error => {
          console.log(error);
        });
    }    
  }

  ngOnInit() {
    this.groepen = this.af.database.list('/groepen');
  }

}
```
Probeer je nu nog een element mee te geven in bij het aanmaken van de groep, of een titel die geen string is, dan krijg je hier een foutmelding van in je commando venster (of je IDE/editor als deze TypeScript ondersteuning heeft).

# Service
We hebben de communicatie met Firebase nu verwerkt in het groep component. Mochten we ooit Firebase in willen ruilen voor een andere backend dan moeten we in het component de communicatie gaan aanpassen. Het is beter om deze communicatie via een service te laten lopen om op die manier de communicatie met de backend gescheiden te houden van het component zelf.
Maak in het bestand **src/app/groep/groep.service.ts** aan.
Importeer de nodige modules uit Angular, Firebase en het groep model:
``` typescript
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable  } from 'angularfire2';
import { Groep } from './groep.model';
```
De functie om een groep toe te voegen aan Firebase zou hier terrecht moet komen. Daarnaast moeten we AngularFire instantieren en een FirebaseListObservable aanmaken die de groepen ophaalt en bijhoudt. Voor het ophalen van de groepen maken we nog een functie aan die we aan kunnen roepen vanuit het groep component om daar de groepen beschikbaar te stellen. Dat ziet er als volgt uit:

``` diff
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable  } from 'angularfire2';
import { Groep } from './groep.model';

+ @Injectable()
+ export class GroepService {
+    private groepen: FirebaseListObservable<any[]>;

+    constructor(
+        private af: AngularFire
+    ) {
+        this.groepen = af.database.list('/groepen');
+    }

+    groepToevoegen(groep: Groep): void {
+        this.groepen.push(groep)
+        .then(response => {
+          console.log("Groep toegevoegd!");
+        })
+        .catch(error => {
+          console.log(error);
+        });
+    }

+    getGroepen(): FirebaseListObservable<any[]> {
+        return this.groepen;
+    }
+}
```
Om gebruik te kunnen maken van groep service moet deze eerst toegevoegd worden aan het groep component en aan de app.module.ts.
* Importeer de service in **src/app/app.module.ts**
* Voeg deze vervolgens aan de providers array toe om de service beschikbaar te stellen voor de hele module
``` diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { GroepComponent } from './groep/groep.component';
+ import { GroepService } from './groep/groep.service';

// Must export the config
export const firebaseConfig = {
    apiKey: "AIzaSyD1LgKHv8s8-awyabqjYfG5y-1D7_fKn5I",
    authDomain: "angularfirebase-276b0.firebaseapp.com",
    databaseURL: "https://angularfirebase-276b0.firebaseio.com",
    storageBucket: "angularfirebase-276b0.appspot.com",
};
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    routing
  ],
+  providers: [
+    GroepService
+  ],
  declarations: [ 
    AppComponent, 
    GroepComponent 
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```

Om de groep service vervolgens te gebruiken in het groep component:
* Importeren we ook daar de groep service
* In de constructor voegen de service toe
* En in de ngOnInit functie passen aan dat de groepen niet nogmaals opgehaald worden maar via de groep service
* En als laatste vervangen we de groepToevoegen functie

``` diff
import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Groep } from './groep.model';
+ import { GroepService } from './groep.service';

@Component({
  selector: 'app-groep',
  templateUrl: './groep.component.html',
  styleUrls: ['./groep.component.css']
})
export class GroepComponent implements OnInit {
  groepen: FirebaseListObservable<any[]>;
  constructor(
    private af: AngularFire,
+    private groepService: GroepService
  ) {}

+  groepToevoegen(formData: any): void {
+    if (formData.valid) {
+      let groep: Groep = new Groep(formData.value.titel);
+      this.groepService.groepToevoegen(groep);
+      formData.reset();
+    }    
+  }

  ngOnInit() {
+    this.groepen = this.groepService.getGroepen();
  }

}
```
Met deze vernieuwde code maken we nu een nieuwe groep aan en geven deze vervolgens door aan de groepService waar alles verder afgehandeld wordt.

Aan de voorkant is verschil te zien, maar de code is beter onderhoudbaar en we kunnen niet meer iets anders dan een groep meegeven aan de groepToevoegen functie. Doen we dit wel dan worden we hier in een vroegtijdig stadium al op gewezen.

# Contacten
Zoals eerder aangegeven gaan we het contact component niet genereren maar zelf aanmaken. We beginnen met het aanmaken van een model voor de contacten. Maak een nieuwe map aan genaamd **src/app/contact**. En een nieuw bestand toe **src/app/contact/contact.model.ts** met de volgende inhoud:
``` typescript
export class Contact {
    constructor(
        public groepId: string,
        public naam: string,
        public adres: string,
        public tel: string
    ) {}
};
```
Vervolgens maken we een service aan waarin we contacten op kunnen halen per groep en contacten kunnen opslaan. Maak een nieuw bestand **src/app/contact/contact.service.ts** aan in de folder contact met de volgende inhoud:
``` typescript
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

    getContacten(): FirebaseListObservable<any[]> {
        return this.contacten;
    }
}
```
Om het contact component aan te maken kopieëren we de code van het groep component en veranderen overal het woord groep(en) in contact(en). Dat geeft ons de volgende code in **src/app/contact/contact.component.ts**:
``` typescript
import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { Contact } from './contact.model';
import { ContactService } from './contact.service'; 

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  contacten: FirebaseListObservable<any[]>;
  constructor(
    private af: AngularFire,
    private contactService: ContactService
  ) {}
  
/*
 contactToevoegen(formData: any): void {
    if (formData.valid) {
      let contact: Contact = new Contact(formData.value.titel);
      this.contactService.contactToevoegen(contact);
      formData.reset();
    }    
  }*/
  
  ngOnInit() {
    this.contacten = this.contactService.getContacten();
  }
}
```
Zoals je ziet commentarieren we eerst de functie contactToevoegen uit. Deze zetten we later weer aan.
Ok, we hebben nu een contact component, service en model maar hoe zijn deze contacten aan een groep gelinkt? Juist, op dit moment nog niet. Daarvoor hebben we een groepId nodig. Vanuit de groep route, waar het groep component geladen is, linken we de groepen elk naar een eigen pagina door. Deze link bouwen we op door het groepId te gebruiken zodat we deze beschikbaar krijgen in het contact component en zo de contacten uit een groep kunnen ophalen en contacten aan een groep kunnen toevoegen. Ga hiervoor naar het groep component en maak de volgende aanpassingen in **src/app/groep/groep.component.ts**:
* Voeg de functie selecteerGroep toe
* Importeer router
* Voeg de router aan de constructor toe
``` diff
import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
+ import { Router } from '@angular/router';

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
+    private router: Router
  ) {}

  groepToevoegen(formData: any): void {
    if (formData.valid) {
      let groep: Groep = new Groep(formData.value.titel);
      this.groepService.groepToevoegen(groep);
      formData.reset();
    }    
  }

+  selecteerGroep(groepId: string): void {
+    this.router.navigate(['/groepen, groepId]);
+  }

  ngOnInit() {
    this.groepen = this.groepService.getGroepen();
  }

}
```
In het groep template gaan we vervolgens een toevoeging doen aan de groep titel om de selecteerGroep functie aan te roepen, **src/app/groep/groep.component.html**:
``` diff
<form #formData='ngForm'>
  <div class="form-group">
    <input type="text" class=”form-control” (ngModel)="text" placeholder="Groep titel" id="titel" name="titel" rows="10" required/>
  </div>
  <button [disabled]="!formData.valid" (click)="groepToevoegen(formData)" class="btn btn-primary">Opslaan</button>
</form>
<ul>
+  <li *ngFor="let groep of groepen | async" (click)="selecteerGroep(groep.$key)">
    {{ groep.titel }}
  </li>
</ul>
```
Door het **(click)** attribuut wordt de selecteerGroep functie aangeroepen bij het aanklikken van de link. We geven **groep.$key** mee aan de functie, de $key is het ID van de groep zoals deze in Firebase opgeslagen is. Wanneer de functie selecteerGroep aangeroepen wordt, worden we doorverwezen naar de link ‘/groepen/GROEPID’. Hier hebben we nog geen route voor. Maak een nieuwe route aan in app.routing.ts en importeer het contact component:
``` diff
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroepComponent } from './groep/groep.component';
+ import { ContactComponent } from './contact/contact.component';

const appRoutes: Routes = [
    {
        path: 'groepen',
        component: GroepComponent
    },
+    {
+        path: 'groepen/:id',
+        component: ContactComponent
+    },
    {
        path: '**',
        redirectTo: '/groepen',
        pathMatch: 'full'
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
```
Door :id aan de route toe te voegen wordt het groepId beschikbaar als een route parameter. Deze kunnen we vervolgens in het contact component afvangen om daar mee de juiste contacten op te halen, **src/app/contact/contact.component.ts**: 
* Voeg aan het contact component de benodigde imports toe
* Voeg de router en activatedRoute toe aan de constructer van het contact component
* Voeg vervolgens een component variabele toe direct na het openen van de ContactComponent class
* En in de ngOnInit functie slaan we het groepId uit de url op in de zojuist aangemaakte variabale
* In de getContacten functie kunnen we nu het groepId mee geven
``` diff
import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
+ import { Router, ActivatedRoute, Params } from '@angular/router';

import { Contact } from './contact.model';
import { ContactService } from './contact.service'; 

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  contacten: FirebaseListObservable<any[]>;
+  groepId: string;

  constructor(
    private af: AngularFire,
    private contactService: ContactService,
+    private route: ActivatedRoute,
+    private router: Router
  ) {}
  
/*
 contactToevoegen(formData: any): void {
    if (formData.valid) {
      let contact: Contact = new Contact(formData.value.titel);
      this.contactService.contactToevoegen(contact);
      formData.reset();
    }    
  }*/
  
  ngOnInit() {
+    this.route.params.forEach((params: Params) => {
+      let id = params['id'];
+      this.groepId = id;
+    });
+    this.contacten = this.contactService.getContacten(this.groepId);
  }
}
```

Als laatste moet we hiervoor nog de functie getContacten in de contact service aanpassen, het is namelijk niet meer de bedoeling om alle contacten binnen te halen, **src/app/contact/contact.service.ts**:
``` diff
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

+    getContacten(id: string): FirebaseListObservable<any[]> {
+        return this.af.database.list('/contacten', {
+            query: {
+                orderByChild: 'groepId',
+                equalTo: id 
+            }
+        });       
+    }
}
```
Deze nieuwe functie geeft niet meer de eerder opgehaalde FirebaseListObservable met contacten door maar voert een query uit op contacten met het overeenkomende groepId.

Om te kijken of alles werkt voegen we nu een template toe voor de contacten. Maak de bestanden **src/app/contact/contact.component.html** en **src/app/contact/contact.component.css** aan. Met deze laatste doen we niks maar we verwijzen er in het contact component wel naar (je kan er ook voor kiezen de verwijzing te verwijderen).
Zet in **src/app/contact/contact.component.html** de volgende code:
``` html
<ul>
  <li *ngFor="let contact of contacten | async">
    {{ contact.naam }}<br/>
    {{ contact.adres }}<br/>
    {{ contact.tel }}
  </li>
</ul>
```
Om alles te laten werken moeten we nu alleen nog dit nieuwe component en de nieuwe service toevoegen aan **src/app/app.module.ts** 
* Importeer het nieuwe component en de service:
* Voeg het component vervolgens toe aan de declarations array en de service aan de providers array.
``` diff
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { GroepComponent } from './groep/groep.component';
import { GroepService } from './groep/groep.service';
+ import { ContactComponent } from './contact/contact.component';
+ import { ContactService } from './contact/contact.service';

// Must export the config
export const firebaseConfig = {
    apiKey: "AIzaSyD1LgKHv8s8-awyabqjYfG5y-1D7_fKn5I",
    authDomain: "angularfirebase-276b0.firebaseapp.com",
    databaseURL: "https://angularfirebase-276b0.firebaseio.com",
    storageBucket: "angularfirebase-276b0.appspot.com",
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
+    ContactService
  ],
  declarations: [ 
    AppComponent, 
    GroepComponent,
+    ContactComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```


Als je je commando venster nog hebt draaien ga je naar http://localhost:4200 heb je je commando venster niet meer draaien, ga dan naar je projectfolder en type ng serve om de applicatie weer te starten.
En als het goed is zie je hier het overzicht van je groepen. Klik een groep aan en als het goed is kom je op een lege pagina terrecht. De link van deze pagina zal er als http://localhost:4200/groepen/-KXQw3F3TS-ex60A-zOO uit zien.
Maar we zien hier nu natuurlijk nog geen contacten. Daarvoor voegen we een formulier op de pagina toe om contacten mee aan te maken. Ga daarvoor naar het bestand contact.component.ts en voeg de volgende code bovenaan het bestand toe:
``` diff
+ <form #formData="ngForm">
+  <div class="form-group">
+    <input type="text" class="form-control" (ngModel)="naam" placeholder="Naam" id="naam" name="naam" rows="10" required/>
+  </div>
+  <div class="form-group">
+    <input type="text" class="form-control" (ngModel)="adres" placeholder="Adres" id="adres" name="adres" rows="10" required/>
+  </div>
+  <div class="form-group">
+    <input type="text" class="form-control" (ngModel)="tel" placeholder="Telefoonnummer" id="tel" name="tel" rows="10" required/>
+  </div>
+  <button [disabled]="!formData.valid" (click)="contactToevoegen(formData)" class="btn btn-primary">Opslaan</button>
+ </form>
<ul>
  <li *ngFor="let contact of contacten | async">
    {{ contact.naam }}<br/>
    {{ contact.adres }}<br/>
    {{ contact.tel }}
  </li>
</ul>
```
Het principe is hetzelfde als het formulier om een groep aan te maken. We willen hier alleen meer velden vullen. Om de functie in het contact component af te ronden zetten we de functie contactToevoegen weer aan en passen deze als volgt aan, **src/app/contact/contact.component.ts**:
``` diff
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
  
+  contactToevoegen(formData: any): void {
+    if (formData.valid) {
+      let contact: Contact = new Contact(this.groepId, formData.value.naam, formData.value.adres, formData.value.tel);
+      this.contactService.contactToevoegen(contact);
+      formData.reset();
+    }    
+  }
  
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      this.groepId = id;
    });
    this.contacten = this.contactService.getContacten(this.groepId);
  }
}
```
Wanneer je nu naar [http://localhost:4200](http://localhost:4200) gaat zou je als alles goed is gegaan nu contacten aan groepen toe kunnen voegen. En deze contacten zou je alleen onder de groep terug moeten zien waar je het contact hebt aangemaakt.
We hebben nu een werkend adresboek. Ok, het is niet het mooiste adresboek maar de benodigde functionaliteit zit erin. 

# Heroku
Als laatste (optionele) stap deployen we de applicatie nog naar Heroku zodat jij niet de enige persoon bent die deze applicatie kan bekijken.

Zorg ervoor dat je een gratis account op Heroku aanmaakt en de Heroku Toolbelt hebt geïnstalleerd. (zie ook: [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli "Heroku Toolbelt"))

Nadat dit gereed is zijn er een paar kleine aanpassingen in het project nodig om te kunnen deployen naar Heroku.

We gaan eerst kijken of de applicatie goed gebouwd kan worden. Zonde om er op het laatste moment achter te komen dat dat niet werkt. Type CTRL + c om de Angular-CLI te stoppen en type vervolgens J om te bevestigen. Met het volgende commando voer je een build uit:
``` sh
Ng build
```
Werkt dit dat kun je verder. Om het deployen op Heroku te laten werken zijn een aantal wijzigingen in het bestand **src/package.json** nodig. 
* Het start commando passen we aan om gebruik te maken van http-server. 
* In de preisntall fase wordt http-server geïnstalleerd. 
* In de postinstall fase wordt het ng build commando uitgevoerd en wordt de dist folder naar de hoofd directory verplaatst.
* En als laatste moet alles wat onder devDependencies staat worden verplaatst naar dependencies, anders wordt dit niet door Heroku opgepakt. (versies kunnen hier en daar afwijken)
``` diff
{
  "name": "project-name",
  "version": "0.0.1",
  "license": "MIT",
  "angular-cli": {}
  "scripts": { 
+    "start": "http-server", 
    "lint": "tslint \"src/**/*.ts\"", 
    "test": "ng test", 
    "pree2e": "webdriver-manager update",
    "e2e": "protractor", 
+    "preinstall": "npm install -g http-server", 
+    "postinstall": "ng build && mv dist/* ." 
  },
  "private": true,
  "dependencies": {
    "@angular/common": "2.0.0",
    "@angular/compiler": "2.0.0",
    "@angular/core": "2.0.0",
    "@angular/forms": "2.0.0",
    "@angular/http": "2.0.0",
    "@angular/platform-browser": "2.0.0",
    "@angular/platform-browser-dynamic": "2.0.0",
    "@angular/router": "3.0.0",
+    "angularfire2": "^2.0.0-beta.6",
+    "core-js": "^2.4.1",
+    "firebase": "^3.6.1",
+    "rxjs": "5.0.0-beta.12",
+    "ts-helper": "^1.1.1",
+    "zonejs": "^0.6.23",
+    "@types/jasmine": "^2.2.30",
+    "angular-cli": "1.0.0-beta.16",
+    "codelyzer": "~0.0.26",
+    "jasmine-core": "2.4.1",
+    "jasmine-spec-reporter": "2.5.0",
+    "karma": "1.2.0",
+    "karma-chrome-launcher": "^2.0.0",
+    "karma-cli": "^1.0.1",
+    "karma-jasmine": "^1.0.2",
+    "karma-remap-istanbul": "^0.2.1",
+    "protractor": "4.0.9",
+    "ts-node": "1.2.1",
+    "tslint": "3.13.0",
+    "typescript": "2.0.2"
  },
  "devDependencies": {
  }
}
```
Maak vanuit het commando venster vervolgens een nieuw Heroku project aan met:
``` sh
Heroku create
```
Commit alle wijzigingen met git. En om alles naar Heroku te deployen:
``` sh
git push heroku master.
```
Wanneer alles klaar is ga je naar je nieuwe project link en zou je daar de applicatie moeten zien.

# Troubleshooting
``` sh
Cannot find name ‘require’
```
Wanneer deze melding in je commando venster verschijnt, zoek dan de file src/typings.d.ts op en voeg onderaan de volgende 2 regels toe:
``` diff
+ declare var require: any; 
+ declare var module: any;
```

``` sh
Cannot find namespace ‘firebase’
```
Wanneer je deze melding in je commando venster tegenkomt, zoek dan de file src/tsconfig.json op en voeg onderaan (maar binnen de hoofdnode) de volgende property toe:
``` diff
+ "files": [ "../node_modules/firebase/firebase.d.ts" ]
```
