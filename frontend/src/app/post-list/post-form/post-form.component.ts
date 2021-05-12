import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';

export type FileEventTarget = EventTarget & { files: FileList };

@Component({
	selector: 'app-post-form',
	templateUrl: './post-form.component.html',
	styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

	postForm!: FormGroup
	errorMessage!: string
	file!: File

	constructor(private formBuilder: FormBuilder, private postsService: PostsService) { }

	ngOnInit(): void {
		this.initForm()
	}

	initForm(): void {
		this.postForm = this.formBuilder.group({
			title: [null, Validators.required],
			description: [null, Validators.required],
			postImg: [null,Validators.required]
		})
	}

	onSubmit() {
		const title = this.postForm.get('title')!.value
		const description = this.postForm.get('description')!.value

		this.postsService.createNewPost(title, description, this.file)
		//le service revoie sur le compoenent post-list

	}

	onFileAdded(event: Event | any) {
		if (event == null) { console.log('FILE IS NOT UPLOADED !') }
		else {
			this.file = event.target.files[0]
		}
	}
}


