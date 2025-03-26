import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrainingService} from '../../services/training.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  GlobalStateService
} from '../../services/global-state-service/global-state.service';
import {Alert} from '../../alert.enum';

@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./view-training.component.scss']
})
export class ViewTrainingComponent implements OnInit {
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
  viewForm!: FormGroup;

  constructor(private trainingService: TrainingService, private fb: FormBuilder, private globalState: GlobalStateService) {}

  ngOnInit(): void {
    this.viewForm = this.fb.group({
      diaVisualizar: ['', Validators.required],
    });
    this.initTableConversion();
  }


  initTableConversion(): void {
    this.convertTableToList();
    window.addEventListener('resize', () => this.convertTableToList());
  }

  convertTableToList(): void {
    const table = document.getElementById('data-table') as HTMLTableElement;
    const listContainer = document.getElementById('list-container');
    if (!table || !listContainer) return;

    listContainer.innerHTML = '';
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent || '');
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const listGroup = document.createElement('div');
      listGroup.classList.add('list-group');

      cells.forEach((cell, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');
        listItem.innerHTML = `<strong>${headers[index]}:</strong> ${cell.textContent}`;
        listGroup.appendChild(listItem);
      });

      listContainer.appendChild(listGroup);
    });
  }

  loadLastTrainingSession(dia: string | undefined): void {
    if (!dia) return;
    this.globalState.showLoading();
    this.trainingService.getLastTrainingSession(dia).subscribe({
      next: (exercises) => {
        this.exercises = exercises;
        this.globalState.hideLoading();
      },
      error: (err) => {
        this.globalState.showNotification(Alert.Bad, 'Erro ao carregar exercícios:');
        this.globalState.hideLoading();
      }
    });
  }
}
