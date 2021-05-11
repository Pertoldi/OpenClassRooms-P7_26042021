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

	isAuthObservable = new Observable((observer) => {
		this.observer = observer;
		let token = sessionStorage.getItem('token')
		let userId = sessionStorage.getItem('userId')

		if (token == null || userId == null) {
			this.observer.next(false)
		}
		fetch('http://localhost:3000/auth/isConnect', {
			method: 'POST',
			body: JSON.stringify({ token, userId }),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		}).then((data: Response) => {
			data.json().then((value) => {
				console.log('value of observable is :', value)
				this.observer.next(value)
			})
		})
			.catch(error => { throw error })
	})

	constructor(private http: HttpClient, private router: Router, private postsService: PostsService) { }

	createNewUser(firstName: string, lastName: string, email: string, password: string) {
		return new Promise<void>(
			(resolve, reject) => {
				fetch('http://localhost:3000/auth/signup', {
					method: 'POST',
					body: JSON.stringify({ firstName, lastName, email, password }),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				})
					.then(() => {
						resolve()
					})
					.catch((error) => {
						reject(error)
					})
			}
		)
	}

	signInUser(email: string, password: string) {
		return new Promise<void>(
			async (resolve, rejects) => {
				let dataFetch = await fetch('http://localhost:3000/auth/signin', {
					method: 'POST',
					body: JSON.stringify({ email, password }),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).then((data: Response) => {
					this.observer.next(true)
					return data.json()
				})
					.catch(error => rejects(error))

				sessionStorage.setItem('token', dataFetch.token)
				sessionStorage.setItem('userId', dataFetch.userId)
				console.log('ON A MIS LE TOKEN');
				this.isAuthObservable.subscribe()
				resolve()
			}
		)
	}

	isConnect(): boolean | Promise<boolean> {
		let token = sessionStorage.getItem('token')
		let userId = sessionStorage.getItem('userId')
		if (token == null || userId == null) return false

		return new Promise<boolean>(
			async (resolve, rejects) => {
				let dataFetch = await fetch('http://localhost:3000/auth/isConnect', {
					method: 'POST',
					body: JSON.stringify({ token, userId }),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				}).then((data: Response) => {
					return data.json()
				})
					.catch(error => rejects(error))
				return resolve(dataFetch)
			}
		)
	}

	async getOneUser(id: string | null): Promise<any> {
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
					//TODO lier isAuth observable à faux ici aussi
					this.router.navigate(['/auth/signup'])
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

}
