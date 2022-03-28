import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }
  inSubmission = false;
  showAlert = false;
  alertMsg = "Signing you in..";
  alertColor = 'blue';

  constructor(private auth: AngularFireAuth) { }

  async loginUser() {
    this.showAlert = true;
    this.alertColor = "blue";
    this.alertMsg = "Logging you in..";
    this.inSubmission = true;
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      )
      this.alertMsg = "Signed in sucessfully!"
      this.alertColor = "green"
    } catch (e) {
      this.alertColor = "red"
      this.inSubmission = false;
      this.alertMsg = "An unexpected error occurred. Please try again later."

      return
    }

    this.alertMsg = "Sucessfully logged in!"
    this.alertColor = "green"
  }

  ngOnInit(): void {
  }

}
