import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private httpClient: HttpClient) { }

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
					return data.json()
				})
					.catch(error => rejects(error))

				localStorage.setItem('token', dataFetch.token)
				localStorage.setItem('userId', dataFetch.userId)
				resolve()
			}
		)
	}

	isConnect(): boolean | Promise<boolean> {
		let token = localStorage.getItem('token')
		let userId = localStorage.getItem('userId')
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
