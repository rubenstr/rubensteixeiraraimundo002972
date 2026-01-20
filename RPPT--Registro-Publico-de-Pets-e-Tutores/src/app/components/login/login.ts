import { Component } from '@angular/core';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ Header],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

}
