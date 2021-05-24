import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

	errorMessage!: string
	signupForm!: FormGroup

	constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

	ngOnInit(): void {
		this.initForm();
	}

	initForm(): void {
		this.signupForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
		})
	}

	onSubmit() {
		const firstName = this.signupForm.get('firstName')!.value
		const lastName = this.signupForm.get('lastName')!.value
		const email = this.signupForm.get('email')!.value
		const password = this.signupForm.get('password')!.value

		this.authService.createNewUser(firstName, lastName, email, password)
		.then( () => {
			this.router.navigate(['/auth/signin'])
		})
		.catch( (error) => {
			this.errorMessage = error.error.message
		})
	} 
}
