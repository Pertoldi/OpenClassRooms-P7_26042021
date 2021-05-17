import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PostsService } from './posts.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	observer: any;

	isAuthObservable = new Observable((observer) => {			//Pour savoir si la personne est connecté ou pas
		this.observer = observer;
		let token = sessionStorage.getItem('token')
		let userId = sessionStorage.getItem('userId')

		if (token == null || userId == null) {
			this.observer.next(false)
		}
		this.observer.next(this.isConnect())						//this.isConnect renvoie un booleen
	})

	constructor(private http: HttpClient, private router: Router, private postsService: PostsService) { }

	createNewUser(firstName: string, lastName: string, email: string, password: string) {
		return new Promise<void>(
			(resolve, reject) => {
				const headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json')
				this.http.post('http://localhost:3000/auth/signup', JSON.stringify({ firstName, lastName, email, password }), { 'headers': headers }).subscribe(
					(res: any) => {
						resolve(res)
					},
					(error) => {
						reject(error)
					}
				)
			}
		)
	}

	signInUser(email: string, password: string) {
		return new Promise<any>((resolve, reject) => {
			const headers = new HttpHeaders().set('Accept', 'application/json').set('Content-Type', 'application/json')
			this.http.post('http://localhost:3000/auth/signin', JSON.stringify({ email, password }), { 'headers': headers }).subscribe(
				(res: any) => {
					sessionStorage.setItem('token', res.token)
					sessionStorage.setItem('userId', res.userId)
					this.observer.next(true)
					console.log('Observeur passe à true');
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		}
		)
	}

	isConnect(): boolean | Promise<boolean> {
		let token = sessionStorage.getItem('token')
		let userId = sessionStorage.getItem('userId')
		if (token == null || userId == null) return false

		return new Promise<boolean>(
			(resolve, reject) => {
				const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json')
				this.http.post('http://localhost:3000/auth/isConnect', JSON.stringify({ token, userId }), { 'headers': headers }).subscribe(
					(res) => {
						resolve(true)
					},
					(error) => {
						reject(false)
					}
				)
			}
		)
	}

	getOneUser(id: string | number | null): Promise<any> {
		const token = sessionStorage.getItem('token')
		return new Promise<any>((resolve, reject) => {
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.get(`http://localhost:3000/auth/${String(id)}`, { 'headers': headers }).subscribe(
				(res) => {
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	modifyOneUser(lastName: string, firstName: string, file: File | undefined) {
		return new Promise((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const userId = sessionStorage.getItem('userId')
			let bodyFormData = new FormData
			bodyFormData.append('data', JSON.stringify({ lastName: lastName, firstName: firstName }))
			if (file == null || file == undefined) {
				console.log('no file to upload !')
			} else {
				bodyFormData.append('file', file)
			}
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.put(`http://localhost:3000/auth/${String(userId)}`, bodyFormData, { 'headers': headers }).subscribe(
				(res) => {
					this.postsService.getPosts()
					this.router.navigate(['/post-list'])
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	deleteOneUser() {
		return new Promise((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const userId = sessionStorage.getItem('userId')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.delete(`http://localhost:3000/auth/${String(userId)}`, { 'headers': headers }).subscribe(
				(res) => {
					sessionStorage.removeItem('token')
					sessionStorage.removeItem('userId')
					this.observer.next(false)
					this.router.navigate(['/auth/signup'])
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	isAdmin() {
		return new Promise<boolean>((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const userId = sessionStorage.getItem('userId')
			
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Accept', 'application/json').set('Content-Type', 'application/json')
			this.http.post('http://localhost:3000/auth/isAdmin', JSON.stringify({ userId }), { 'headers': headers }).subscribe(
				(res:any) => {
					resolve(res.isAdmin)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

}
