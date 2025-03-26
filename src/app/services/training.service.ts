// training.global-state-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private baseUrl = 'https://script.google.com/macros/s/AKfycbyviFs9MB13IPH56GqNAppLv6b_w1dm9qjR0o-7DV5OscaVZDsM6n3iqzGyZZa2mlaY/exec';

  constructor(private http: HttpClient) {}

  postRegisterTraining(trainingData: any): Observable<any> {
    return this.http.post(this.baseUrl, trainingData, { headers: { 'Content-Type': 'application/json' } });
  }

  getTrainingSchedule(day: string): Observable<{ name: string; series: number; repetitions: number; rest: number; weight: number }[]> {
    console.log('dia', day);
    const url = `${this.baseUrl}?sheet=FichasTreino&dia=${encodeURIComponent(day)}`;
    return this.http.get<Record<string, any>>(url).pipe(
      map(exercises => {
        if (exercises && Object.keys(exercises).length > 0) {
          return Object.entries(exercises).map(([nome, detalhes]: [string, any]) => ({
            name: nome, // Mantém o nome original em português
            series: parseInt(detalhes?.series ?? '0', 10),
            repetitions: parseInt(detalhes?.repeticoes ?? '0', 10),
            rest: parseInt(detalhes?.descanso ?? '0', 10),
            weight: parseInt(detalhes?.carga ?? '0', 10),
          }));
        } else {
          return [];
        }
      })
    );
  }

  getLastTrainingSession(day: string): Observable<{ name: string; series: number; repetitions: number; rest: number; weight: number }[]> {
    const url = `${this.baseUrl}?sheet=RegistrosTreino&dia=${encodeURIComponent(day)}`;
    return this.http.get<Record<string, any>>(url).pipe(
      map(exercises => {
        if (exercises && Object.keys(exercises).length > 0) {
          return Object.entries(exercises).map(([nome, detalhes]: [string, any]) => ({
            name: nome, // Mantém o nome original em português
            series: parseInt(detalhes?.series ?? '0', 10),
            repetitions: parseInt(detalhes?.repeticoes ?? '0', 10),
            rest: parseInt(detalhes?.descanso ?? '0', 10),
            weight: parseInt(detalhes?.carga ?? '0', 10),
          }));
        } else {
          return [];
        }
      })
    );
  }
}
