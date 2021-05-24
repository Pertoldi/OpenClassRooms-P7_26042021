import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/header/header.component';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {

	errorMessage!: string
	signInForm!: FormGroup

	constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private postsService: PostsService) { }

	ngOnInit():void {
		this.initForm()
	}

	initForm():void {
		this.signInForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{8,}/)]]
		})
	}

	onSubmit() {
		const email = this.signInForm.get('email')!.value
		const password = this.signInForm.get('password')!.value

		this.authService.signInUser(email, password).then(
			async () => {
				await this.authService.initIsAuthSubject()
				this.postsService.getPosts()						//getPosts doit être appelé car PostsService ne peut pas getPosts() tant que l'utilisateur n'est pas connecté
				this.postsService.emitPosts()
				this.router.navigate(['/post-list'])
			},
			(error) => {
				this.errorMessage = error.error.message
			}
		)
	}
}
