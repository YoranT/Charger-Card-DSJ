# Charger Card DSJ

Een strakke Home Assistant kaart voor Easee-laders, gemaakt door De Slimme Jongens.
Kies je eigen kleur, automatische animaties, LED-statusindicatie, en alle data direct uit de laadpaal.
Geen gedoe met entiteiten. Eén device-id is genoeg.

⸻

Installatie (HACS)
	1.	Open Home Assistant
	2.	Ga naar
Instellingen → HACS → Integraties → Custom repositories
	3.	Voeg jouw GitHub-repo toe als type: Lovelace
	4.	Zoek daarna op Charger Card DSJ en installeer hem
	5.	Herstart de frontend (Ctrl+Shift+R)

⸻

Bestandsstructuur

De kaart gebruikt embedded afbeeldingen via HACS:

Charger-Card-DSJ/
│
├── charger-card-dsj.js
├── hacs.json
├── README.md
└── images/
    ├── charger_white.png
    ├── charger_red.png
    ├── charger_black.png
    ├── charger_blue.png
    ├── leds_white_all.gif
    ├── leds_white_flashing.gif
    ├── leds_blue_all.gif
    ├── leds_blue_flashing.gif
    ├── leds_red_flashing.gif
    ├── leds_off.gif

Alle afbeeldingen worden automatisch geserveerd via:

/hacsfiles/Charger-Card-DSJ/images/


⸻

Gebruik in Home Assistant

Voeg een kaart toe en gebruik:

type: custom:charger-card-dsj
device_id: cor_koezema
charger_color: white

Minimale config

type: custom:charger-card-dsj
device_id: cor_koezema

Opties

Optie	Verplicht	Uitleg
device_id	ja	Prefix van je Easee entiteiten (bijv. sensor.cor_koezema_status → device_id: cor_koezema)
charger_color	nee	white, red, black, blue


⸻

Automatische entiteitenkoppeling

De kaart detecteert zelf alle entidades.
Voorbeeld (device_id = cor_koezema):

sensor.cor_koezema_status
sensor.cor_koezema_vermogen
sensor.cor_koezema_sessie_energie
sensor.cor_koezema_laadstroom
sensor.cor_koezema_energie_per_uur
sensor.cor_koezema_voltage
sensor.cor_koezema_maximale_limiet_lader
sensor.cor_koezema_reden_geen_stroom

Je hoeft ze niet handmatig op te geven.

⸻

Kleurwissel van de charger-body

Je kunt zelf kiezen welke kleur in je dashboard wordt getoond:

charger_color: white
charger_color: red
charger_color: black
charger_color: blue

De body-afbeelding blijft constant, alleen de LED-status verandert.

⸻

LED-animaties

De kaart toont automatische Easee-LED’s afhankelijk van de status:

Status	LED	Gedrag
charging	blauw	continue animatie
completed	wit	steady
awaiting_authorization	wit	knipper
error	rood	knipper
disconnected	off	donker
ready_to_charge	body image	geen LED


⸻

Animatiesnelheid (op basis van ampère)

Hoe hoger de laadstroom, hoe sneller de animatie.

Laadstroom	Snelheid
0–6A	langzaam
6–16A	gemiddeld
16–32A	snel

Dit werkt automatisch, zonder extra instellingen.

⸻

Voorbeeld volledig

type: custom:charger-card-dsj
device_id: cor_koezema
charger_color: red


⸻

Problemen / Feedback

We zijn De Slimme Jongens.
We houden van slimme dingen.

Heb je ideeën, bugs, of verbeteringen?
Open een issue in GitHub of stuur ons een bericht.
