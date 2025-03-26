import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonModule, NgForOf } from '@angular/common';
import { TrainingService } from '../../services/training.service';
import {
  GlobalStateService
} from '../../services/global-state-service/global-state.service';
import {Alert} from '../../alert.enum';


@Component({
  selector: 'app-training-schedule',
  templateUrl: './training-schedule.component.html',
  standalone: true,
  imports: [NgForOf, ReactiveFormsModule, FormsModule, CommonModule],
  styleUrls: ['./training-schedule.component.scss']
})
export class TrainingScheduleComponent implements OnInit {
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

  @ViewChildren('inputField') inputFields!: QueryList<ElementRef>;

  constructor(private trainingService: TrainingService, private fb: FormBuilder, private globalState: GlobalStateService) {}

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




  registerTraining(): void {
    if (this.trainingForm.valid) {
      this.globalState.showLoading();
      this.trainingService.postRegisterTraining(this.trainingForm.value).subscribe({
        next: () => {
          this.globalState.showNotification(Alert.Success, 'Treino registrado com sucesso!');
          this.globalState.hideLoading();
        },
        error: (error) => {
          this.globalState.showNotification(Alert.Bad, 'Erro ao registrar treino:');
          this.globalState.hideLoading();
        }
      });
    } else {
      this.globalState.showNotification(Alert.Bad, 'Preencha todos os campos!');
    }
  }

  loadExercises(dia: string | undefined): void {
    if (!dia) return;
    this.globalState.showLoading();
    this.trainingService.getTrainingSchedule(dia).subscribe({
      next: (exercises) => {
        console.log(exercises)
        this.exercises = exercises;
        this.globalState.hideLoading();
      },
      error: (err) => {
        console.error('Erro ao carregar exercícios:', err);
        this.globalState.hideLoading();
      }
    });
  }

  submitTraining(): void {
    this.registerTraining();
  }
}
