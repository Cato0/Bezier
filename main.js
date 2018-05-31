var punkt = document.getElementById("punkt").value;

function punktChanged() {
punkt = document.getElementById("punkt").value;
}

document.getElementById("divPunkt").style.display = "none";
document.getElementById("confirm").style.display = "none";

var buttonPressed = "add";

var canvas;
var ctx;
var posx;
var posy;

function P(x, y) {
	this.x = x;
	this.y = y;
}
function getRandomPoint(width, height) {			
	return new P(Math.floor(Math.random() * width),
				 Math.floor(Math.random() * height));
}

var width  = 600;
var height = 600;		
var num_points = 0;
var max_bezier_depth = 5000;

var CP = Array(num_points);

var line_width = 2;
var point_size = 3;
var back_color = '#303030';
var line_color = 'yellow';
var point_color = '#40f040';
var basicStruct_color = 'red';
var durchgang = 0;

var wert = 0.5; 	// t für die Verschiebung der Konstruktionslinien

for (var i=0; i<num_points; i++) {
		CP[i] = getRandomPoint(width, height);
	}

function draw () {
	
	if (ctx) {
		ctx.fillStyle = back_color;
		ctx.fillRect(0, 0, width, height);	
		ctx.lineWidth = line_width;
		ctx.strokeStyle = line_color;
		
		for (i=0; i<(num_points-1); i++) {
		ctx.strokeStyle = basicStruct_color;					// Punktlinien zeichnen
		line(CP[i],CP[i+1]);
		}
		ctx.fillStyle="green";
		for (i=0; i<(num_points); i++) {
		ctx.fillText("P"+i+"(0)", CP[i].x+10, CP[i].y+10);		// Punkt schreiben
		}
					
		ctx.strokeStyle = line_color;
		durchgang = 0;
		
		if (num_points>2) {
		bezier(CP, max_bezier_depth);	
		}
		// Bezierkurve zeichnen
	}
}

function point(P)
{
	ctx.fillStyle = point_color;
	ctx.fillRect(P.x-point_size/2,P.y-point_size/2,point_size,point_size);
}
function line (P0, P1) {
	ctx.beginPath();
	ctx.moveTo(P0.x, P0.y);
	ctx.lineTo(P1.x, P1.y);
	ctx.stroke();
}

function bezier (points, tiefe) { // points array mit allen Punkten

var abstandX = Math.abs(points[(points.length-1)].x - points[0].x);
var abstandY = Math.abs(points[(points.length-1)].y - points[0].y);

var abstand = Math.sqrt(abstandX*abstandX+abstandY*abstandY);

	if ( (abstand<width*height/100000) ) { ctx.strokeStyle="white";	line(points[0],points[(points.length-1)]); }	// abstand < 3.6
	
	else {
		
		durchgang++;
		
		var temp = num_points-1;
		var array=0;
		
		while (temp>0) {
		array += temp;		// Berechnet wie viele Arrays man braucht
		temp--;
		}
		
		var CPP = Array(array);				// mittelpunkte des ersten durchgangs
		var CP1 = Array(num_points);		// linker weg der neu erstellten Punkte für rekursiven aufruf
		var CP2 = Array(num_points);		// rechter weg der neu erstellten Punkte für rekursiven aufruf
		
		temp=num_points;
		
		for (var i=0; i<(num_points-1); i++) {
		CPP[i] = kurz(points[i],points[i+1]);	// Ersten Strecken ausrechnen
		}

		i = num_points-1;	// i zurücksetzen sonst ändert die for schleife den wert wieder
						
		temp--;		// temp = num_points-1;
		var z=0;
		
		while(temp>0) {			// Temp wird von (num_points -1)  immer um 1 kleiner um genau die richtige Anzahl an punkten zu erstellen
		for ( var j=0; j<(temp-1); j++ ) {	// Erstellt alle Mittelpunkte für den ersten Durchgang
		CPP[i] = kurz(CPP[z],CPP[z+1]);		// CPP[0] bis CPP[2]

		i++;
		z++;
		}
		z++; 			// Zweiter Durchgang startet ab hier und z wird um ein erhöht, damit ein Schritt übersprungen wird
		temp--;																	// CPP[3] bis CPP[9] bei 4 Punkten
		}
		
		temp = num_points-1;
		i= num_points-1;
		z = 0;
		
		if (durchgang==1) {

		var b=1;	// Beschriftung in Klammern( ) hochzählen
		while(temp>0) {
		for ( var j=0; j<(temp-1); j++ ) {
		
		line(CPP[z],CPP[z+1]);
		
		if (j==0) {
		ctx.fillText("P"+(j)+"("+(b)+")", CPP[z].x+10, CPP[z].y+10);		// Beschreibung des ersten Punktes
		}
		
		ctx.fillText("P"+(j+1)+"("+(b)+")", CPP[z+1].x+10, CPP[z+1].y+10);		// Beschreibung aller weiteren Punkte
		i++;
		z++;
		}
		z++; 
		temp--;																	// CPP[3] bis CPP[9]
		b++;				// Beschriftung in ( ) hochzählen nach je einem Durchgang
		}
		if ((z+num_points-1)>0) {
		ctx.fillText("P0"+"("+(num_points-1)+")", CPP[array-1].x+10, CPP[array-1].y+10);  // Beschriftung des letzten Punktes ind er Kurve
		}	
		}
		
		temp = num_points;
		q = 0;
		temp2 = num_points;
		
		
		// CP1 -> alle Punkte für 1. Rekursion
		CP1[0] = points[0];	// erster Punkt ist immer der Nullpunkt
		for (i=1;i<(num_points);i++) {
		temp2 = temp;
		CP1[i] = CPP[q];	// weitere Punkte der Rekursiven Funktion
		while ((temp2-1)>0) {
		temp2--;			
		q++;			
		}
		temp--;
		}

		var erg = CPP.length;
		var step = 1;
		
		// CP2 -> alle Punkte für 2. Rekursion
		for (i=0; i<(num_points-1); i++) {
		CP2[i] = new P(CPP[erg-1].x, CPP[erg-1].y);			// CP2 erstellen wo alle Punkte der zweiten Rekursiven funktion drin sind
		erg=erg-step;	
		step++; 
		}
		CP2[i] = new P(points[num_points-1].x, points[num_points-1].y);		// Letzter Punkt ist fix

		bezier(CP1, (tiefe-1));
		bezier(CP2, (tiefe-1));		
		
	}
	
}

window.addEventListener('load', function () {
	var canvas = document.getElementById('beziers');
	// check for browser support
	if (canvas && canvas.getContext) {
		//canvas.addEventListener( 'mousedown', draw, false );
		ctx = canvas.getContext('2d');
		if (ctx) {
			draw();			// start 						
		}
	}	
}, false);				

function addClicked() {
buttonPressed = "add";
document.getElementById("divPunkt").style.display = "none";
document.getElementById("confirm").style.display = "none";
// BORDER ändern
}

function removeClicked() {
buttonPressed = "remove";
document.getElementById("divPunkt").style.display = "";
document.getElementById("confirm").style.display = "";
// BORDER ÄNDERN
}

function moveClicked() {
buttonPressed = "move";
document.getElementById("divPunkt").style.display = "";
document.getElementById("confirm").style.display = "none";
//BORDER
}

function confirmClicked() {
remove(CP,punkt);
}


function clicked (event) {

switch(buttonPressed) {

case "add": 
	CP.push(new P(event.pageX,event.pageY));
	num_points++;
	draw();
break;

case "move": 
	move(CP[document.getElementById("punkt").value],event.pageX,event.pageY);
break;

default : 
break;
}
}

function remove (arr, punkt) {

if (arr.length>punkt) {	// wenn es den Punkt nicht gibt

var a = new Array(arr.length);
var te = 0;													// man kann nicht punkt +1 rechnen dafür te
for (var i=0; i<arr.length; i++) {
a[i] = arr[i];												// Array kopieren
if (i==punkt) { te = i; }
}
arr.splice(punkt);											// 

for ( i=(te+1); i<a.length; i++) {
arr.push(a[i]);

}
num_points--;
draw();
}
}

function move (punkt,newX,newY) {
punkt.x = newX;
punkt.y = newY;
draw();
}

function kurz (p1,p2) {					// Punktlinien zeichnen aber nur erster Durchgang

return new P(wert*p2.x+(1.0-wert)*p1.x,wert*p2.y+(1.0-wert)*p1.y);
}

//canvas.addEventListener('mouseup', release, false);
beziers.addEventListener('mousedown', clicked, false);
//canvas.addEventListener('mousemove', move, false);