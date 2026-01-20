import { Component } from '@angular/core';
import { Header } from '../shared/header/header';
import { Autenticacao } from '../../services/autenticacao';
import { Credentials } from '../../interfaces/credentials.interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ Header],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  credential: Credentials = {
    "username":  'admin',
    "password": 'admin'
  }

  constructor(private readonly aut: Autenticacao) {}
    public getAutentitacao(){
    this.aut.login(this.credential).subscribe({
      next: (response) => console.log('Post created successfully:', response),
      error: (error) => console.error('Error creating post:', error)
    });
  }
  

}
