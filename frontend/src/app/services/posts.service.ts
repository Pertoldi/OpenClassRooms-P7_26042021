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
		let token = sessionStorage.getItem('token')
		if (token) {
			this.getPosts()
		}
	}

	emitPosts() {
		this.postsSubject.next(this.posts)
	}

	getPosts() {
		return new Promise<void>((resolve, reject) => {
			this.posts = []
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.get('http://localhost:3000/post/all', { 'headers': headers }).subscribe(
				(res: any) => {
					for (const post of res.result) {
						if (post.userUrl == null) post.userUrl = '../../assets/people-2388584_1280.png' //image de profilt par défault
						this.posts.push(post)
					}
					resolve()
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	getOnePost(id: number | string): Promise<Post> {
		return new Promise<Post>((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.get(`http://localhost:3000/post/${id}`, { 'headers': headers }).subscribe(
				(res:any) => {
					console.log('res is :', res.result[0])
					resolve(res.result[0])
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	createNewPost(title: string, description: string, file: File) {
		return new Promise((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const userId = sessionStorage.getItem('userId')

			title = title.split('\"').join('\\"').split("\'").join("\\'")
			description = description.split('\"').join('\\"').split("\'").join("\\'")

			const bodyFormData = new FormData()
			bodyFormData.append('data', JSON.stringify({ title: title, description: description, userId: userId }))
			if (file == null || file == undefined) {
				console.log('FILE DID NOT UPLOADED !')
				reject('No file found !')
			}
			else {
				bodyFormData.append('file', file)
			}

			//WITH HTTPCLIENT
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.post('http://localhost:3000/post/', bodyFormData, { 'headers': headers }).subscribe(
				(res) => {
					this.getPosts()
					this.emitPosts()
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
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.delete(`http://localhost:3000/post/${String(id)}`, { 'headers': headers }).subscribe(
				(res) => {
					this.getPosts()
					this.emitPosts()
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

			const token = sessionStorage.getItem('token')
			title = title.split('\"').join('\\"').split("\'").join("\\'")
			description = description.split('\"').join('\\"').split("\'").join("\\'")

			//Request pour changer uniquement le titre et la desc
			if (file == undefined || file == null) {
				const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json')
				this.http.put(`http://localhost:3000/post/${String(id)}`, JSON.stringify({ title, description }), { 'headers': headers }).subscribe(
					(res) => {
						this.getPosts()
						this.emitPosts()
						this.router.navigate(['/post-list'])
						resolve(res)
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
