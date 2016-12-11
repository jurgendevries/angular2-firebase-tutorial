# Introductie

In dit blog laat ik je zien hoe je met Angular2 en Firebase snel een prototype webapp neer kan zetten. Door gebruik te maken van Firebase hoef je je niet druk te maken over de backend van je webapp. Dit laten we door Firebase afhandelen. Het is zelfs mogelijk om Authenticatie en Hosting door Firebase te laten regelen. Dat wordt in dit blog niet behandeld. Wel gaan we een webapp maken waarin je contacten kan opslaan en groeperen. En deze webapp vervolgens op een gratis Heroku account deployen.
Wat niet wordt behandeld in dit blog zijn de volgende onderwerpen:
*	Unit testen van de applicatie
*	Modulariseren van de applicatie
*	Complete uitleg hoe een Angular project te starten, we maken gebruik van de Angular-CLI om snel aan de slag te kunnen
*	User authentication

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

```typescript
import {test} from 'test.test';
```
