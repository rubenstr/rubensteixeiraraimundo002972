import { Component } from '@angular/core';

import { Credentials } from '../../interfaces/credentials.interfaces';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../core/services/autenticacao.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  credentials: Credentials = {
    "username":  '',
    "password": ''
  }

  constructor(
    private readonly auth: AutenticacaoService,
    private readonly router: Router
  ) {}


    formLogin = new FormGroup({
      username: new FormControl('', { validators: [Validators.required] }),
      password: new FormControl('', { validators: [Validators.required] }),
    });

      public getAutenticacao() {
    if (this.formLogin.invalid) return;

    const credential = {
      username: this.formLogin.value.username!,
      password: this.formLogin.value.password!
    };

    this.auth.login(credential).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Erro no login', err);
      }
    });
  }

  resetForm(){
    this.formLogin.reset();
  }
  

}
