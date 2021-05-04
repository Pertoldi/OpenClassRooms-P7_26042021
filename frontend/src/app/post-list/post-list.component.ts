import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { PostsService } from '../services/posts.service';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

	posts: Array<any> = [
		// {
		// 	author: ['Nom', 'Prenom', '../../assets/people-2388584_1280.png'],
		// 	date: new Date(),
		// 	title: 'test post',
		// 	post_URL: '../../assets/db44y4q-8e2f43c7-6568-40d7-8558-0631ddc2c446.jpg',
		// 	description: 'Un Asyméchat',
		// 	likes: 2,
		// 	nbCommentaires: 0
		// },
		// {
		// 	author: ['Nom', 'Prenom', '../../assets/people-2388584_1280.png'],
		// 	date: new Date(),
		// 	title: 'test post',
		// 	post_URL: '../../assets/giphy.gif',
		// 	description: 'Un GIF pour tester',
		// 	likes: 2,
		// 	nbCommentaires: 0
		// },
		// {
		// 	author: ['Nom', 'Prenom', '../../assets/people-2388584_1280.png'],
		// 	date: new Date(),
		// 	title: 'test post',
		// 	post_URL: '../../assets/db44y4q-8e2f43c7-6568-40d7-8558-0631ddc2c446.jpg',
		// 	description: 'Un Asyméchat',
		// 	likes: 2,
		// 	nbCommentaires: 0
		// }
	]

	postsSubscription!: Subscription

	constructor(private postsService: PostsService, private router: Router) { }

	ngOnInit():void {
		this.postsSubscription = this.postsService.postsSubject.subscribe(
			(posts: Post[]) => (
				this.posts = posts
			)
		)
		this.postsService.emitPosts()
	}

}
