/*

Starten der Beregnung für die Versenkregner

*/

var ID_VENTIL                    = 'hm-rpc.1.XXXXXXXXXX.14.STATE'/*RasenberegnungLinks STATE*/;
var ID_BEREGNUNGSDAUER           = 'Beregnung.0.RasenL.Beregnungsdauer';
var ID_BEREGNUNGSDAUER_AKTUELL   = 'Beregnung.0.RasenL.AktuelleBeregnungsdauer'/*aktuelleBeregnungsDauer*/;
var ID_ZEIT                      = 'Beregnung.0.RasenL.startBeregnung';
var ID_AUTOMATIC                 = 'Beregnung.0.RasenL.Automatik';
var logging=true;
var raum                         = 'Aussenbereich';
var colour                       = 'gold';
const sname=" ("+name.substr(10)+")";


setze_startzeit();

schedule({astro: "sunset", shift: -(getState(ID_BEREGNUNGSDAUER).val)}, function (obj) {
  if (getState(ID_AUTOMATIC).val===true) {
    tolog(logging,"Automatische Beregnung RasenL ist aktiv:");
    event("Automatische Beregnung RasenL ist aktiv:"+sname,raum,colour);
    beregnungRasenL(getState(ID_BEREGNUNGSDAUER).val);
  } else {
    tolog(logging,"Automatische Beregnung RasenL ist inaktiv, beende Beregnbung Seite");
    event("Automatische Beregnung Rasen ist inaktiv, beende Beregnbung MicroDrip"+sname,raum,colour);
  } 
    
});

// Jeden Morgen die Startzeit setzen - wird fuer die Anzeigen benötigt

schedule("1 2 * * *", function () {
  setze_startzeit();
});

// Bei Änderungen derBeregnungszeit Startzeit neu setzen

on({id: ID_BEREGNUNGSDAUER, change: "any"}, function (obj) {
  setze_startzeit();
});

function beregnungRasenL (beregnungsDauer) {
    
    tolog(logging,"Start Beregung RasenL fuer "+beregnungsDauer+" min");
    event("Start Beregung RasenL fuer "+beregnungsDauer+" min"+sname,raum,colour);
    var delayRegnerAus=1000*60*beregnungsDauer;
    
    tolog(logging,"Oeffne Beregnungsventile fuer "+beregnungsDauer+" min");
    var idnam=getObject(ID_VENTIL      ).common.name;
    event("Oeffne Ventil "+idnam+" fuer "+getState(ID_BEREGNUNGSDAUER).val+" min"+sname,raum,colour);
    setState(ID_VENTIL      ,true);
    
    // Schliessen der Seitesprenger Ventile nach Beregnungszeit
    
    setTimeout(function() {
        tolog(logging,"Schliesse Beregnungsventil");
        var idnam=getObject(ID_VENTIL).common.name;
        event("Schliesse Ventil "+idnam+sname,raum,colour);
        setState(ID_VENTIL,false);
        tolog(logging,"Ende Beregung RasenL");
        event("Ende Beregung RasenL"+sname,raum,colour);
    }, delayRegnerAus);

}

function setze_startzeit () {
  var beregnungsdauerRasenL=getState(ID_BEREGNUNGSDAUER).val;
  var zeit=formatDate(getAstroDate("sunset").getTime()-(1000*60*(getState('Beregnung.0.Seite.Beregnungsdauer').val+beregnungsdauerRasenL)),"hh:mm");
  event("Setze Startzeit fuer "+ID_ZEIT+" auf: "+zeit+" Uhr"+sname,raum,colour);    
  setState(ID_ZEIT,zeit);
};