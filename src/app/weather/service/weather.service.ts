import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseVM } from '../viewmodel/weather-response';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeather(location:string):Observable<ResponseVM>{
    console.log("Locationnnnn>>", location);
    const url = `https://api.weather.gov/gridpoints/${location}/31,80/forecast`;

    return this.http.get<ResponseVM>(url);
  }
}