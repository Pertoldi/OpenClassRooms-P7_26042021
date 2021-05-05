import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class PostsService {

	posts: Post[] = []
	postsSubject = new Subject<Post[]>()

	constructor(private http: HttpClient) {
		this.getPosts()
	}

	emitPosts() {
		this.postsSubject.next(this.posts)
	}

	async getPosts() {
		// requete des 'posts' au serveur puis on enregistre dans posts et on emet le subject pour le mettre à jour.
		try {
			let data = await (await fetch('http://localhost:3000/post/all')).json()
			for (const post of data.results) {
				//On ajoute les valeurs par défault
				if (post.userUrl == null) post.userUrl = '../../assets/people-2388584_1280.png'	//image de profilt par défault
				if (post.postUrl == null) post.postUrl = '../../assets/db44y4q-8e2f43c7-6568-40d7-8558-0631ddc2c446.jpg' //TODO en attendant la gestion des images
				this.posts.push(post)
			}
			this.emitPosts()
		} catch (error) {
			throw error
		}
	}



	async createNewPost(title: string, description: string, file: File) {
		return new Promise((resolve, reject) => {
			const BodyFormData = new FormData()
			BodyFormData.append('data', JSON.stringify({ title: title, description: description }))
			if (file == null) {
				console.log('FILE IS NOT UPLOADING !')
			}
			else {
				BodyFormData.append('file', file)
			}

			let token = sessionStorage.getItem('token')

			const headers = new HttpHeaders()
				.set('Authorization', `Bearer ${token}`);
			// .set('Content-Type', 'multipart/form-data')

			//WITH HTTPCLIENT
			this.http.post('http://localhost:3000/post/', BodyFormData, { 'headers': headers }).subscribe(
				(res) => {
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})

		//WITH FETCH
		// try {
		// 	let response = await fetch('http://localhost:3000/post/', {
		// 		method: "POST",
		// 		body: BodyFormData,
		// 		headers: {
		// 			'Authorization': `Bearer ${token}`
		// 		}
		// 	})
		// 	if (response.ok) {
		// 		let json = await response.json();
		// 		return json
		// 	}
		// }
		// catch (error) {
		// 	throw error
		// }
	}


}
