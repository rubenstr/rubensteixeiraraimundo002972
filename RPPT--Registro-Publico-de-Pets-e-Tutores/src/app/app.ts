import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/shared/header/header';
import { AutenticacaoService } from './core/services/autenticacao.service';

@Component({
  selector: 'app-root',
  imports: [ Header, RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RPPT--Registro-Publico-de-Pets-e-Tutores');

}
