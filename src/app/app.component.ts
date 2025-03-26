import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import {NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {TrainingService} from "./services/training.service";
import {NavbarComponent} from "./component/navbar/navbar.component";
import {
    ViewTrainingComponent
} from "./component/view-training/view-training.component";
import {
    TrainingScheduleComponent
} from "./component/training-schedule/training-schedule.component";
import {
  LoadingSpinnerComponent
} from "./component/loading-spinner/loading-spinner.component";
import {
  NotificationComponent
} from "./component/notification/notification.component";

enum Alert {
  Bad = 'Bad',
  Success = 'Success'
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, NgIf, FormsModule, NgForOf, CommonModule, NavbarComponent, ViewTrainingComponent, TrainingScheduleComponent, LoadingSpinnerComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TrainingService]
})

export class AppComponent implements OnInit {
    mode = 'schedule';
    loadingOverlayVisible = false;
    notificationOverlayVisible = false;
    notificationText: string = "Deus é meu guia";
    notificationColor: string = "#000";
    daysOfWeek: string[] = [
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
        'Domingo'
    ];
    exercises: { name: string; series: number; repetitions: number; rest: number; weight: number }[] = [];
    formControlNames: string[] = [];
    trainingForm!: FormGroup;

    constructor(private trainingService: TrainingService, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.trainingForm = this.fb.group({
            diaTreino: ['', Validators.required],
            exercicioTreino: ['', Validators.required],
            seriesFeitas: ['', [Validators.required, Validators.min(1)]],
            carga: ['', Validators.min(0)],
            repsFeitas: ['', [Validators.required, Validators.min(1)]],
            descansoFeito: [''],
            equipamentos: [''],
        });
        this.formControlNames = Object.keys(this.trainingForm.controls);
    }

    alternarModo(mode: string): void {
        this.mode = mode;
    }

    emitirAlerta(alert: Alert, text: string): void {
        if (alert === Alert.Bad) {
            this.notificationColor = "#FF5733";
            this.notificationText = text;
            this.notificationOverlayVisible = true;
        } else if (alert === Alert.Success) {
            this.notificationColor = "#2e8b57";
            this.notificationText = text;
            this.notificationOverlayVisible = true;
        } else {
            console.error("erro ao exibir alerta");
            return;
        }

        setTimeout(() => {
            this.notificationOverlayVisible = false;
        }, 3000);
    }

    showLoading(): void {
        this.loadingOverlayVisible = true;
    }

    hideLoading(): void {
        this.loadingOverlayVisible = false;
    }

    registerTraining(trainingData: any): void {
        this.showLoading();
        this.trainingService.postRegisterTraining(trainingData).subscribe({
            next: () => {
                this.emitirAlerta(Alert.Success, 'Treino registrado com sucesso!');
                this.hideLoading();
            },
            error: (error) => {
                this.emitirAlerta(Alert.Bad, 'Erro ao registrar treino:');
                this.hideLoading();
            }
        });
    }

    loadExercises(day: string | undefined): void {
        if (!day) return;
        this.showLoading();
        this.trainingService.getTrainingSchedule(day).subscribe({
            next: (exercises) => {
                this.exercises = exercises; // Adicionado
                this.hideLoading();
            },
            error: (err) => {
                console.error('Erro ao carregar exercícios:', err);
                this.hideLoading();
            }
        });
    }

    loadLastTrainingSession(day: string | undefined): void {
        if (!day) return;
        this.showLoading();
        this.trainingService.getLastTrainingSession(day).subscribe({
            next: (exercises) => {
                this.exercises = exercises; // Adicionado
                this.hideLoading();
            },
            error: (err) => {
                console.error('Erro ao carregar exercícios:', err);
                this.hideLoading();
            }
        });
    }
}
