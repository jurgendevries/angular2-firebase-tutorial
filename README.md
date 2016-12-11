# Introductie

In dit blog laat ik je zien hoe je met Angular2 en Firebase snel een prototype webapp neer kan zetten. Door gebruik te maken van Firebase hoef je je niet druk te maken over de backend van je webapp. Dit laten we door Firebase afhandelen. Het is zelfs mogelijk om Authenticatie en Hosting door Firebase te laten regelen. Dat wordt in dit blog niet behandeld. Wel gaan we een webapp maken waarin je contacten kan opslaan en groeperen. En deze webapp vervolgens op een gratis Heroku account deployen.
Wat niet wordt behandeld in dit blog zijn de volgende onderwerpen:
*	Unit testen van de applicatie
*	Modulariseren van de applicatie
*	Complete uitleg hoe een Angular project te starten, we maken gebruik van de Angular-CLI om snel aan de slag te kunnen
*	User authentication

# Code
In deze tutorial wordt de code in blokken getoond. Hierin wordt voor de TypeScript en html code getoond wat er wordt toegevoegd aan de code of verwijderd. Dat ziet er als volgt uit:

``` diff
+ deze regel wordt toegevoegd
- en deze verwijderd
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

Om Firebase straks aan onze applicatie te kunnen koppelen hebben we een aantal gegevens nodig. Door in het linkermenu op ‘Overview’ te klikken kom je weer terug op het project overzicht. Klik hier op ‘Firebase toevoegen aan uw webapp’.

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

Wanneer je je browser venster weer bekijkt zou je je nieuw toegevoegde items nu moeten zien.

# Bootstrap toevoegen
Om een iets prettiger uitziende applicatie te krijgen voegen we bootstrap toe aan ons project met de volgende regel in het **head** gedeelte van **src/index.html**:
``` html
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
```
Daarnaast zetten we een div met de class **container** om onze lijst heen in **src/app/app.component.html**:
``` html
<div class="container">
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
Het formulier gaan we opmaken in **src/groep/groep.component.html**:
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
* Firebase en FirebaseListObservable importeren in **src/groep/groep.component.ts**
* In het groep component maken we een FirebaseListObservable aan direct na de class definitie
* In de constructor definiëren we AngularFire zodat deze beschikbaar is
* In de ngOnInit functie die we van de component generator cadeau hebben gekregen zorgen we dat de groepen aan de eerder gedefinieerde FirebaseListObservable worden gekoppeld
  * Het ‘/groepen’ endpoint bestaat nog niet in Firebase, maar zal automatisch aangemaakt worden zodra we hier iets naar toe schrijven.
* Dan de functie om een groep toe te voegen
En dan ziet er dan als volgt uit:
``` diff
import { Component, OnInit } from '@angular/core';
+import { AngularFire, FirebaseListObservable } from 'angularfire2';

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
+          console.log("Groep toegevoegd!");
+          formData.reset();
+        })
+        .catch(error => {
+          console.log(error);
+        });
+    }    
=  }

  ngOnInit() {
+    this.groepen = this.af.database.list('/groepen');
  }

}

De formData krijgen we vanuit het formulier meegestuurd, wanneer iemand deze functie toch probeert aan te roepen zonder dat de data valide is, gebeurt er nog niks. Wanneer de data wel valide is wordt er een object toegevoegd aan het FirebaseListObject.  Het pushen van een object naar een FirebaseListObservable geeft een promise terug. Met de then methode vangen we een succesvolle response op en met de catch methode eventuele fouten en loggen deze in de console. Met de titel property wordt de lijst met groepen vervolgens weer op het scherm getoond.
