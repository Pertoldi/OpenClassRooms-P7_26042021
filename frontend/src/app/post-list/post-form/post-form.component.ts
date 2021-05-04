import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-post-form',
	templateUrl: './post-form.component.html',
	styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

	postForm!: FormGroup

	constructor(private formBuilder: FormBuilder, private router: Router) { }

	ngOnInit(): void {
		this.initForm();
	}

	initForm():void {
		this.postForm = this.formBuilder.group({
			title: ['', Validators.required],
			description: ['', Validators.required],
			post_URL: ['']
		})
	}

	onSubmit() {
		//l'id de l'user est dans son token
	}

}
