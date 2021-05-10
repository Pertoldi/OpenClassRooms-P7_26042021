import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
		// requete des 'posts' au serveur puis on enregistre dans l'objet posts et on emet le subject pour le mettre à jour.
		try {
			this.posts = []
			let data = await (await fetch('http://localhost:3000/post/all')).json()
			for (const post of data.result) {
				//On ajoute les valeurs par défault
				if (post.userUrl == null) post.userUrl = '../../assets/people-2388584_1280.png'	//image de profilt par défault
				this.posts.push(post)
			}
			this.emitPosts()
		} catch (error) {
			throw error
		}
	}

	async getOnePost(id: number | string): Promise<Post> {
		try {
			let token = sessionStorage.getItem('token')
			let data = await (await fetch(`http://localhost:3000/post/${id}`, {
				method: "GET",
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})).json()
			let post: Post = data.result
			console.log('post is :', data.result[0].title)
			return post
		} catch (error) {
			throw error
		}
	}

	async createNewPost(title: string, description: string, file: File) {
		return new Promise((resolve, reject) => {
			let token = sessionStorage.getItem('token')
			let userId = sessionStorage.getItem('userId')

			const BodyFormData = new FormData()
			BodyFormData.append('data', JSON.stringify({ title: title, description: description, userId: userId }))
			if (file == null) {
				console.log('FILE IS NOT UPLOADING !')
				reject('No file found !')
			}
			else {
				BodyFormData.append('file', file)
			}

			//WITH HTTPCLIENT
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

			this.http.post('http://localhost:3000/post/', BodyFormData, { 'headers': headers }).subscribe(
				(res) => {
					this.getPosts()
					this.router.navigate(['/post-list'])
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	async deletePost(id: number) {
		return new Promise<any>((resolve, reject) => {
			let token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			let param = new HttpParams()
			param = param.append('id', `${id}`)// { params: param }
			this.http.delete(`http://localhost:3000/post/${String(id)}`, { 'headers': headers }).subscribe(
				(res) => {
					this.getPosts()
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	async modifyPost(id: string, title: string, description: string, file: File | undefined) {
		return new Promise<any>((resolve, reject) => {

			let token = sessionStorage.getItem('token')
			let param = new HttpParams()
			param = param.append('id', `${id}`)

			//Request pour changer uniquement titre et desc
			if (file == undefined || file == null) {
				const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json')
				this.http.put(`http://localhost:3000/post/${String(id)}`, JSON.stringify({ title, description }), { 'headers': headers }).subscribe(
					(res) => {
						this.getPosts()
						resolve(res)
						this.router.navigate(['/post-list'])
					},
					(error) => {
						reject(error)
					}
				)
			} else {//si on a un file on envoie au format formData à la route post/file/:id

				const BodyFormData = new FormData()
				BodyFormData.append('data', JSON.stringify({ title: title, description: description }))
				BodyFormData.append('file', file)
				const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
				this.http.put(`http://localhost:3000/post/file/${String(id)}`, BodyFormData, { 'headers': headers }).subscribe(
					(res) => {
						this.getPosts()
						this.router.navigate(['/post-list'])
						resolve(res)
					},
					(error) => {
						reject(error)
					}
				)
			}
		})
	}
}
