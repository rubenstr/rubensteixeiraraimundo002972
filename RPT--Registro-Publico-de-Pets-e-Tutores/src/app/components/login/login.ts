import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.username.set(this.loginForm.value.username);
      this.password.set(this.loginForm.value.password);
      // Call API method here with username and password
    }
  }
}
