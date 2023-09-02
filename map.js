import IDs from './name-id.json' assert { type: 'json' };

import Mstops from './stops.json' assert { type: 'json' };

const stopsButton = document.getElementById("stopsButton");
stopsButton.addEventListener("click", () => {
    location.reload(); // Reload the page
});
const dict ={};

for(const key in Mstops) {
    if(Mstops.hasOwnProperty(key)) {
        var coords =Mstops[key];
        dict[key] =coords;
    }

}

const n ={};
for(const b in IDs) {
    if(IDs.hasOwnProperty(b)) {
        var a =IDs[b];
        n[b] =a;
    }
    
}


function getId(key) {
    const a = n[key];
    return a;
}

var mapOptions = {
    center: [40.7128, -74.0060],
    zoom: 12
 }
 
 var map = new L.map('map', mapOptions);
 var cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© CartoDB'
})
 



 cartoLayer.addTo(map);

 

 for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
        const coords = dict[key];
        const lat = parseFloat(coords[0]);
        const lon = parseFloat(coords[1]);
        const iconUrl = '8405421.png';
        const iconSize = [10, 10];
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: iconSize
        });
        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
        marker.bindPopup(key);

        marker.on('click',function(){
            displayInfo(key);
        });

    }
}



function getMonitoring(name) {
    const ids = name;
    return ids;
}

async function getRealTime(mon) {
    return new Promise((resolve, reject) => {
        const apiKey = '66d82ac2-9e2f-4d03-9b88-f169b8dd85bf';
        const baseURL = 'https://bustime.mta.info/api/siri/stop-monitoring.json';
        const operatorRef = 'MTA';
        const monitoringRef = mon;
        const requestUrl = `${baseURL}?key=${apiKey}&OperatorRef=${operatorRef}&MonitoringRef=${monitoringRef}`;
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
                const a = data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;
                const busses = [];
                for (const bus of a) {
                    const monitored = bus.MonitoredVehicleJourney;
                    const bearing = monitored.Bearing;
                    const line = monitored.LineRef;
                    const arrivals = monitored.MonitoredCall.AimedArrivalTime;
                    const latitude = monitored.VehicleLocation.Latitude;
                    const Longitude = monitored.VehicleLocation.Longitude;

                    const busData = {
                        bearing: bearing,
                        line: line,
                        arrivals: arrivals,
                        latitude: latitude,
                        Longitude: Longitude
                    };

                    busses.push(busData);
                }
                resolve(busses);
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

async function displayInfo(key) {
    
    const mon = getId(key);
    const busses = await getRealTime(mon);
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    for(const bus of busses) {
        const latitude= bus.latitude;
        const Longitude = bus.Longitude;
        const busIcon = L.icon({
            iconUrl:'bus-icon-icon-1024x1024-3hirurpi.png',
            iconSize:[20,20]
        });
        const a = estimatedArrival(bus.arrivals);
    
        const marker = L.marker([latitude,Longitude],{icon:busIcon}).addTo(map);
        marker.bindPopup(bus.line +' '+a+'minutes away');

    }
  
    setTimeout(() => displayInfo(key), 10000);
    
}

function estimatedArrival(futureTime) {
    const current = new Date();
    const expected = new Date(futureTime);

    const difference = Math.round((expected-current) / (1000 * 60));
    return difference;




}






