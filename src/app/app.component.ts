import { Component, AfterViewInit } from '@angular/core';
declare const L: any;

// Helper functions outside the class
function getAirQualityStatus(pm25: number): string {
  if (pm25 <= 12) return 'Good';
  else if (pm25 <= 35.4) return 'Moderate';
  else if (pm25 <= 55.4) return 'Unhealthy for Sensitive Groups';
  else if (pm25 <= 150.4) return 'Unhealthy';
  else return 'Very Unhealthy';
}

function getTemperatureStatus(tempF: number): string {
  if (tempF < 60) return 'Cool';
  else if (tempF <= 80) return 'Comfortable';
  else return 'Hot';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  private map: any;
  private airQualityLayer: any;
  private weatherLayer: any;
  private infrastructureLayer: any;

  public isAirQualityVisible = true;
  public isWeatherVisible = true;
  public isInfrastructureVisible = false;

  // 100 US cities (name, lat, lon)
  private usCities = [
    {name: "New York", lat: 40.7128, lon: -74.0060},
    {name: "Los Angeles", lat: 34.0522, lon: -118.2437},
    {name: "Chicago", lat: 41.8781, lon: -87.6298},
    {name: "Houston", lat: 29.7604, lon: -95.3698},
    {name: "Phoenix", lat: 33.4484, lon: -112.0740},
    {name: "Philadelphia", lat: 39.9526, lon: -75.1652},
    {name: "San Antonio", lat: 29.4241, lon: -98.4936},
    {name: "San Diego", lat: 32.7157, lon: -117.1611},
    {name: "Dallas", lat: 32.7767, lon: -96.7970},
    {name: "San Jose", lat: 37.3382, lon: -121.8863},
    {name: "Austin", lat: 30.2672, lon: -97.7431},
    {name: "Jacksonville", lat: 30.3322, lon: -81.6557},
    {name: "Fort Worth", lat: 32.7555, lon: -97.3308},
    {name: "Columbus", lat: 39.9612, lon: -82.9988},
    {name: "San Francisco", lat: 37.7749, lon: -122.4194},
    {name: "Charlotte", lat: 35.2271, lon: -80.8431},
    {name: "Indianapolis", lat: 39.7684, lon: -86.1581},
    {name: "Seattle", lat: 47.6062, lon: -122.3321},
    {name: "Denver", lat: 39.7392, lon: -104.9903},
    {name: "Washington", lat: 38.9072, lon: -77.0369},
    {name: "Boston", lat: 42.3601, lon: -71.0589},
    {name: "El Paso", lat: 31.7619, lon: -106.4850},
    {name: "Detroit", lat: 42.3314, lon: -83.0458},
    {name: "Nashville", lat: 36.1627, lon: -86.7816},
    {name: "Portland", lat: 45.5051, lon: -122.6750},
    {name: "Memphis", lat: 35.1495, lon: -90.0490},
    {name: "Oklahoma City", lat: 35.4676, lon: -97.5164},
    {name: "Las Vegas", lat: 36.1699, lon: -115.1398},
    {name: "Louisville", lat: 38.2527, lon: -85.7585},
    {name: "Baltimore", lat: 39.2904, lon: -76.6122},
    {name: "Milwaukee", lat: 43.0389, lon: -87.9065},
    {name: "Albuquerque", lat: 35.0844, lon: -106.6504},
    {name: "Tucson", lat: 32.2226, lon: -110.9747},
    {name: "Fresno", lat: 36.7378, lon: -119.7871},
    {name: "Mesa", lat: 33.4152, lon: -111.8315},
    {name: "Sacramento", lat: 38.5816, lon: -121.4944},
    {name: "Atlanta", lat: 33.7490, lon: -84.3880},
    {name: "Kansas City", lat: 39.0997, lon: -94.5786},
    {name: "Colorado Springs", lat: 38.8339, lon: -104.8214},
    {name: "Miami", lat: 25.7617, lon: -80.1918},
    {name: "Raleigh", lat: 35.7796, lon: -78.6382},
    {name: "Omaha", lat: 41.2565, lon: -95.9345},
    {name: "Long Beach", lat: 33.7701, lon: -118.1937},
    {name: "Virginia Beach", lat: 36.8529, lon: -75.9780},
    {name: "Oakland", lat: 37.8044, lon: -122.2712},
    {name: "Minneapolis", lat: 44.9778, lon: -93.2650},
    {name: "Tulsa", lat: 36.15398, lon: -95.99277},
    {name: "Arlington", lat: 32.7357, lon: -97.1081},
    {name: "Tampa", lat: 27.9506, lon: -82.4572},
    {name: "New Orleans", lat: 29.9511, lon: -90.0715},
    {name: "Wichita", lat: 37.6872, lon: -97.3301},
    {name: "Cleveland", lat: 41.4993, lon: -81.6944},
    {name: "Bakersfield", lat: 35.3733, lon: -119.0187},
    {name: "Aurora", lat: 39.7294, lon: -104.8319},
    {name: "Anaheim", lat: 33.8366, lon: -117.9143},
    {name: "Honolulu", lat: 21.3069, lon: -157.8583},
    {name: "Santa Ana", lat: 33.7455, lon: -117.8677},
    {name: "Riverside", lat: 33.9806, lon: -117.3755},
    {name: "Corpus Christi", lat: 27.8006, lon: -97.3964},
    {name: "Lexington", lat: 38.0406, lon: -84.5037},
    {name: "Stockton", lat: 37.9577, lon: -121.2908},
    {name: "Henderson", lat: 36.0395, lon: -114.9817},
    {name: "Saint Paul", lat: 44.9537, lon: -93.0900},
    {name: "St. Louis", lat: 38.6270, lon: -90.1994},
    {name: "Cincinnati", lat: 39.1031, lon: -84.5120},
    {name: "Pittsburgh", lat: 40.4406, lon: -79.9959},
    {name: "Greensboro", lat: 36.0726, lon: -79.7920},
    {name: "Anchorage", lat: 61.2181, lon: -149.9003},
    {name: "Plano", lat: 33.0198, lon: -96.6989},
    {name: "Lincoln", lat: 40.8136, lon: -96.7026},
    {name: "Orlando", lat: 28.5383, lon: -81.3792},
    {name: "Irvine", lat: 33.6846, lon: -117.8265},
    {name: "Newark", lat: 40.7357, lon: -74.1724},
    {name: "Toledo", lat: 41.6528, lon: -83.5379},
    {name: "Durham", lat: 35.9940, lon: -78.8986},
    {name: "Chula Vista", lat: 32.6401, lon: -117.0842},
    {name: "Fort Wayne", lat: 41.0793, lon: -85.1394},
    {name: "Jersey City", lat: 40.7178, lon: -74.0431},
    {name: "St. Petersburg", lat: 27.7676, lon: -82.6403},
    {name: "Laredo", lat: 27.5306, lon: -99.4803},
    {name: "Madison", lat: 43.0731, lon: -89.4012},
    {name: "Chandler", lat: 33.3062, lon: -111.8413},
    {name: "Buffalo", lat: 42.8864, lon: -78.8784},
    {name: "Lubbock", lat: 33.5779, lon: -101.8552},
    {name: "Scottsdale", lat: 33.4942, lon: -111.9261},
    {name: "Reno", lat: 39.5296, lon: -119.8138},
    {name: "Glendale", lat: 34.1425, lon: -118.2551},
    {name: "Gilbert", lat: 33.3528, lon: -111.7890},
    {name: "Winston–Salem", lat: 36.0999, lon: -80.2442},
    {name: "North Las Vegas", lat: 36.1989, lon: -115.1175},
    {name: "Norfolk", lat: 36.8508, lon: -76.2859},
    {name: "Chesapeake", lat: 36.7682, lon: -76.2875},
    {name: "Garland", lat: 32.9126, lon: -96.6389},
    {name: "Irving", lat: 32.8140, lon: -96.9489},
    {name: "Hialeah", lat: 25.8576, lon: -80.2781},
    {name: "Fremont", lat: 37.5483, lon: -121.9886},
    {name: "Boise", lat: 43.6150, lon: -116.2023},
    {name: "Richmond", lat: 37.5407, lon: -77.4360},
    {name: "Baton Rouge", lat: 30.4515, lon: -91.1871},
    {name: "Spokane", lat: 47.6588, lon: -117.4260},
    {name: "Des Moines", lat: 41.5868, lon: -93.6250},
    {name: "Tacoma", lat: 47.2529, lon: -122.4443}
  ];

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [39.8283, -98.5795], // Center of USA
      zoom: 4,
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.airQualityLayer = L.layerGroup();
    this.weatherLayer = L.layerGroup();
    this.infrastructureLayer = L.layerGroup();

    if (this.isAirQualityVisible) this.airQualityLayer.addTo(this.map);
    if (this.isWeatherVisible) this.weatherLayer.addTo(this.map);
    if (this.isInfrastructureVisible) this.infrastructureLayer.addTo(this.map);

    this.loadMockAirQualityData();
    this.loadMockWeatherData();
    this.loadMockInfrastructureData();
  }

  toggleAirQuality(event: any): void {
    this.isAirQualityVisible = event.target.checked;
    if (this.isAirQualityVisible) {
      this.airQualityLayer.clearLayers();
      this.usCities.forEach(city => {
        // Mock PM2.5 value from 5 to 55
        const pm25 = Math.random() * 50 + 5;
        const status = getAirQualityStatus(pm25);
        const marker = L.circleMarker([city.lat, city.lon], {
          radius: 6,
          color: 'green',
          fillOpacity: 0.5
        }).bindPopup(`<strong>${city.name}</strong><br>PM2.5: ${pm25.toFixed(1)} µg/m³ (${status})`);
        this.airQualityLayer.addLayer(marker);
      });
      this.airQualityLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.airQualityLayer);
    }
  }

  toggleWeather(event: any): void {
    this.isWeatherVisible = event.target.checked;
    if (this.isWeatherVisible) {
      this.weatherLayer.clearLayers();
      this.usCities.forEach(city => {
        // Mock temperature between 40 and 100 °F
        const temp = Math.floor(Math.random() * 60) + 40;
        const status = getTemperatureStatus(temp);
        const marker = L.circleMarker([city.lat, city.lon], {
          radius: 6,
          color: 'blue',
          fillOpacity: 0.5
        }).bindPopup(`<strong>${city.name}</strong><br>Temperature: ${temp} °F (${status})`);
        this.weatherLayer.addLayer(marker);
      });
      this.weatherLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.weatherLayer);
    }
  }

  toggleInfrastructure(event: any): void {
    this.isInfrastructureVisible = event.target.checked;
    if (this.isInfrastructureVisible) {
      this.infrastructureLayer.clearLayers();
      this.usCities.forEach(city => {
        const marker = L.marker([city.lat, city.lon])
          .bindPopup(`<strong>${city.name}</strong><br>Infrastructure: Available`);
        this.infrastructureLayer.addLayer(marker);
      });
      this.infrastructureLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.infrastructureLayer);
    }
  }

  private loadMockAirQualityData(): void {
    if(this.isAirQualityVisible) this.toggleAirQuality({ target: { checked: true } });
  }

  private loadMockWeatherData(): void {
    if(this.isWeatherVisible) this.toggleWeather({ target: { checked: true } });
  }

  private loadMockInfrastructureData(): void {
    if(this.isInfrastructureVisible) this.toggleInfrastructure({ target: { checked: true } });
  }
}
