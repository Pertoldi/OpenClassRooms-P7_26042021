import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class PostsService {

	posts: Post[] = []
	postsSubject = new Subject<Post[]>()

	constructor(private http: HttpClient, private router: Router) {
		this.getPosts()
	}

	emitPosts() {
		this.postsSubject.next(this.posts)
	}

	async getPosts() {
		// requete des 'posts' au serveur puis on enregistre dans posts et on emet le subject pour le mettre à jour.
		try {
			this.posts = []
			let data = await (await fetch('http://localhost:3000/post/all')).json()
			for (const post of data.results) {
				//On ajoute les valeurs par défault
				if (post.userUrl == null) post.userUrl = '../../assets/people-2388584_1280.png'	//image de profilt par défault
				this.posts.push(post)
			}
			this.emitPosts()
		} catch (error) {
			throw error
		}
	}

	async createNewPost(title: string, description: string, file: File) {
		return new Promise((resolve, reject) => {
			let token = sessionStorage.getItem('token')
			let userId = sessionStorage.getItem('userId')

			const BodyFormData = new FormData()
			BodyFormData.append('data', JSON.stringify({ title: title, description: description, userId: userId}))
			if (file == null) {
				console.log('FILE IS NOT UPLOADING !')
			}
			else {
				BodyFormData.append('file', file)
			}

			//WITH HTTPCLIENT
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
				
			this.http.post('http://localhost:3000/post/', BodyFormData, { 'headers': headers }).subscribe(
				(res) => {
					this.router.navigate(['/post-list'])
					this.getPosts()
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

}
