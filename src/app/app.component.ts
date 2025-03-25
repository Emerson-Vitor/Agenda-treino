import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule, FormGroup, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  agendaForm: FormGroup;
  urlBase = 'https://script.google.com/macros/s/AKfycbyviFs9MB13IPH56GqNAppLv6b_w1dm9qjR0o-7DV5OscaVZDsM6n3iqzGyZZa2mlaY/exec';
  modo = 'visualizar';
  loadingOverlayVisible = false;
  diaSelecionado = '';
  exercicioSelecionado = '';
  seriesFeitas: number | null = null;
  carga: number | null = null;
  repsFeitas: number | null = null;
  descansoFeito = '';
  equipamentos = '';
  exercicios: { nome: string; series: number; repeticoes: number; descanso: number; carga: number }[] = [];
  diasDaSemana: string[] = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  alternarModo() {
    const selectElement = document.getElementById('modo') as HTMLSelectElement;
    this.modo = selectElement.value; // Define o modo com base na seleção
  }



  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.agendaForm = this.fb.group({
      diaTreino: ['', Validators.required],
      exercicioTreino: ['', Validators.required],
      seriesFeitas: ['', [Validators.required, Validators.min(1)]],
      carga: ['', Validators.min(0)],
      repsFeitas: ['', [Validators.required, Validators.min(1)]],
      descansoFeito: [''],
      equipamentos: [''],
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

    listContainer.innerHTML = ''; // Limpa o conteúdo anterior
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

  carregandoOn(): void {
    this.loadingOverlayVisible = true;
  }

  carregandoOff(): void {
    setTimeout(() => {
      this.initTableConversion();
      this.loadingOverlayVisible = false;
    }, 3000);
  }

  registrarTreino(): void {
    if (!this.agendaForm.valid) {
      alert('Preencha todos os campos!');
      return;
    }

    this.carregandoOn();

    const dados = {
      tipo: 'registro',
      dia: this.agendaForm.get('diaTreino')?.value ?? ' ',
      exercicio: this.agendaForm.get('exercicioTreino')?.value ?? ' ',
      seriesFeitas: this.agendaForm.get('seriesFeitas')?.value ?? ' ',
      carga: this.agendaForm.get('carga')?.value ?? ' ',
      repsFeitas: this.agendaForm.get('repsFeitas')?.value ?? ' ',
      descansoFeito: this.agendaForm.get('descansoFeito')?.value ?? ' ',
      equipamentos: this.agendaForm.get('equipamentos')?.value ?? ' ',
    };

    this.http.post(this.urlBase, dados, { headers: { 'Content-Type': 'application/json' } }).subscribe(
      () => {
        alert('Treino registrado com sucesso!');
        this.limparCampos();
        this.carregandoOff();
      },
      (error) => {
        console.error('Erro ao registrar treino:', error);
        this.carregandoOff();
      }
    );
  }

  limparCampos(): void {
    (document.getElementById('seriesFeitas') as HTMLInputElement).value = '';
    (document.getElementById('carga') as HTMLInputElement).value = '';
    (document.getElementById('repsFeitas') as HTMLInputElement).value = '';
    (document.getElementById('descansoFeito') as HTMLInputElement).value = '';
    (document.getElementById('equipamentos') as HTMLInputElement).value = '';
  }

  carregarExerciciosAgenda(dia: string | undefined): void {
    if (!dia) return; // Se não tiver dia selecionado, encerra a função
    this.carregandoOn();
    const url = `${this.urlBase}?sheet=FichasTreino&dia=${encodeURIComponent(dia)}`;

    this.http.get<Record<string, string>>(url).subscribe({
      next: (exercicios) => {
        if (exercicios && Object.keys(exercicios).length > 0) {
          // Transforma a resposta em uma lista de exercícios
          this.exercicios = Object.entries(exercicios).map(([nome, detalhes]: [string, any]) => ({
            nome,
            series: parseInt(detalhes?.series ?? '0', 10),
            repeticoes: parseInt(detalhes?.repeticoes ?? '0', 10),
            descanso: parseInt(detalhes?.descanso ?? '0', 10),
            carga: parseInt(detalhes?.carga ?? '0', 10),
          }));
        } else {
          console.warn('Nenhum exercício encontrado para o dia selecionado.');
          this.exercicios = []; // Limpa a lista se não houver exercícios
        }
        this.carregandoOff(); // Finaliza estado de carregamento
      },
      error: (err) => {
          console.error('Erro ao carregar exercícios:', err);
        this.exercicios = []; // Garante que a lista de exercícios é esvaziada em caso de erro
        this.carregandoOff(); // Finaliza estado de carregamento mesmo em caso de erro
      },
    });
  }

  carregarTreinoDoDiaUltimaCarga() {
    console.log("...")
  }
}
