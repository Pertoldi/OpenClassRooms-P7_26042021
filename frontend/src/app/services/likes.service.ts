import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LikesService {

	constructor(private http: HttpClient) { }

	getLikes(postId: number) {
		console.log('postId is :', postId)
		return new Promise((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			console.log('headers is :', headers)
			this.http.get(`http://localhost:3000/like/${String(postId)}`, { 'headers': headers }).subscribe(
				(res) => {
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	createLike(postId: number) {
		return new Promise((resolve, reject) => {
			const userId = sessionStorage.getItem('userId')
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			console.log('headers is :', headers)
			this.http.post(`http://localhost:3000/like`, { userId: Number(userId), postId } , { 'headers': headers }).subscribe(
				(res) => {
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

}