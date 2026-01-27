import { Component } from '@angular/core';
import { Header } from '../shared/header/header';
import { Autenticacao } from '../../services/autenticacao';
import { Credentials } from '../../interfaces/credentials.interfaces';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ Header, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  credential: Credentials = {
    "username":  '',
    "password": ''
  }

  constructor(private readonly aut: Autenticacao) {}


    formLogin = new FormGroup({
      username: new FormControl('', { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required] }),
    });

    public getAutentitacao(){
      if(this.formLogin.invalid) {return;}
      this.credential.username = this.formLogin.controls.username.value || '';
      this.credential.password = this.formLogin.controls.password.value || '';
      console.log(this.credential);
    this.aut.login(this.credential).subscribe({
      next: (response) => {this.resetForm(), console.log('Post created successfully:', response)
      },
      error: (error) => console.error('Error creating post:', error)
    });
  }

  resetForm(){
    this.formLogin.reset();
  }
  

}
