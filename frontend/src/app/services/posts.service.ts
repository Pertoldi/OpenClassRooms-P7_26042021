import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
	providedIn: 'root'
})
export class PostsService {

	posts: Post[] = []
	postsSubject = new Subject<Post[]>()

	constructor() {
		this.getPosts()
	}

	emitPosts() {
		this.postsSubject.next(this.posts)
	}

	async getPosts() {
		// requete des posts au serveur puis on enregistre dans posts et on emet le subject pour le mettre à jour.
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

}
