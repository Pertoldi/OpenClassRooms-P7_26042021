import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
				console.log('value is :', value)
				this.observer.next(value)
			})
		})
			.catch(error => { throw error })
	})

	constructor() { }

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


}
