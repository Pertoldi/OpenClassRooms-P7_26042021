import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

	posts: Array<any> = [
		{
			author: ['Nom', 'Prenom', '../../assets/people-2388584_1280.png'],
			date: new Date(),
			title: 'test post',
			post_URL: '../../assets/db44y4q-8e2f43c7-6568-40d7-8558-0631ddc2c446.jpg',
			description: 'Un Asyméchat',
			likes: 2,
			nbCommentaires: 0
		},
		{
			author: ['Nom', 'Prenom', '../../assets/people-2388584_1280.png'],
			date: new Date(),
			title: 'test post',
			post_URL: '../../assets/giphy.gif',
			description: 'Un GIF pour tester',
			likes: 2,
			nbCommentaires: 0
		},
		{
			author: ['Nom', 'Prenom', '../../assets/people-2388584_1280.png'],
			date: new Date(),
			title: 'test post',
			post_URL: '../../assets/db44y4q-8e2f43c7-6568-40d7-8558-0631ddc2c446.jpg',
			description: 'Un Asyméchat',
			likes: 2,
			nbCommentaires: 0
		}
	]

	constructor() { }

	async ngOnInit(): Promise<void> {
		//TODO un postServices pour demander les posts sur la base de donénes
		let data = await fetch('http://localhost:3000/post/all')
		await console.log('data is :', data)
	}

}
