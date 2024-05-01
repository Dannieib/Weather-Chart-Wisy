import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../service/weather.service';
import { Chart, registerables } from 'chart.js';
import { Dewpoint, RelativeHumidity } from '../../viewmodel/weather-response';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit{
location: any;
chart?: Chart;
periods: string[] =[];
dew: number[] = [];
relativeHumidity: number[] = [];


  constructor(private route: ActivatedRoute, private ws: WeatherService) {
    Chart.register(...registerables)
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p=>{
      this.location = p.get('location');
      this.getWeather();
    });
  }
  getWeather(): void {
    this.ws.getWeather(this.location).subscribe(d=> {
      const temp = d.properties.periods.map((s: { temperature: any; }) =>s.temperature);
      this.periods = d.properties.periods.map((s: { name: string; }) =>s.name);
      this.dew = d.properties.periods.map((s: { dewpoint: Dewpoint; }) =>s.dewpoint.value);
      this.relativeHumidity = d.properties.periods.map((s: { relativeHumidity: RelativeHumidity; }) =>s.relativeHumidity.value);
      this.renderChart(temp);
    })
  }
  
  renderChart(temperatures: number[]): void {
    if(this.chart){
      console.log("Entered chart function destroy()");
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.periods,
        datasets: [{
          label: 'Temperature Forecast',
          data: temperatures,
          borderWidth: 1,
        },
        {
          label: 'Dew Point',
          data: this.dew,
          borderWidth: 1,
        },
        {
          label: 'Relative Humidity',
          data: this.relativeHumidity,
          borderWidth: 1,
        }]
      },
      options: {
        scales: {
          y:{
            beginAtZero:true,
            display: true,//'Temperature (°F)'
          },
          x:{
            display: true,
            beginAtZero:true
          }
        }
      }
    });
  }

}
