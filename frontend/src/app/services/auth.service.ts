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

				// this.httpClient.post('http://localhost:3000/auth/signup', JSON.stringify({ firstName, lastName, email, password }))
				// .subscribe(
				// 	() => {
				// 		console.log('Enregistrement terminé !')
				// 		resolve()
				// 	},
				// 	(error) => {
				// 		console.log('Erreur ! : ' + error)
				// 		reject(error)
				// 	}
				// )
			}
		)
	}

	signInUser(email: string, password: string) {
		return new Promise<void>(
			(resolve, rejects) => {
				fetch('http://localhost:3000/auth/signin', {
					method: 'POST',
					body: JSON.stringify({ email, password }),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).then((data) => {
					let res = JSON.parse(data.toString())
					console.log(res);
					
					localStorage.setItem('token', res)
					resolve()
				})
					.catch(error => rejects(error))
			}
		)
	}

}
