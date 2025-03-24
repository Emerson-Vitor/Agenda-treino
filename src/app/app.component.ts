import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  urlBase = 'https://script.google.com/macros/s/AKfycbyviFs9MB13IPH56GqNAppLv6b_w1dm9qjR0o-7DV5OscaVZDsM6n3iqzGyZZa2mlaY/exec';
  modo: string = 'visualizar';
  loadingOverlayVisible = false;
  diaSelecionado: string = '';
  exercicioSelecionado: string = '';
  seriesFeitas: number | null = null;
  carga: number | null = null;
  repsFeitas: number | null = null;
  descansoFeito: string = '';
  equipamentos: string = '';
  exercicios: { nome: string; series: number; repeticoes: number; descanso: number; carga: number }[] = [];

  alternarModo() {
    const selectElement = document.getElementById('modo') as HTMLSelectElement;
    this.modo = selectElement.value; // Define o modo com base na seleção
  }



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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

  registrarTreino(
    dia: string,
    exercicio: string,
    seriesFeitas: number | null,
    carga: number | null,
    repsFeitas: number | null,
    descansoFeito: string,
    equipamentos: string
  ): void {
    if (!dia || !exercicio || !seriesFeitas || !carga || !repsFeitas || !descansoFeito || !equipamentos) {
      alert('Preencha todos os campos!');
      return;
    }

    this.carregandoOn();

    const dados = {
      tipo: 'registro',
      dia,
      exercicio,
      seriesFeitas,
      carga,
      repsFeitas,
      descansoFeito,
      equipamentos,
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

    this.http.get<{ [key: string]: string }>(url).subscribe({
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
