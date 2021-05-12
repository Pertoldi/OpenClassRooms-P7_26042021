import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MessagesService {

	constructor(private http: HttpClient) { }

	async getMessages(postId: number): Promise<any> {
		return new Promise((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.get(`http://localhost:3000/message/${String(postId)}`, { 'headers': headers }).subscribe(
				(res) => {
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	async deleteMessage(id: number): Promise<any> {
		return new Promise((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.delete(`http://localhost:3000/message/${String(id)}`, { 'headers': headers }).subscribe(
				(res) => {
					resolve(res)
				},
				(error) => {
					reject(error)
				}
			)
		})
	}

	async modifyMessage(id: number, newContent: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const token = sessionStorage.getItem('token')
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
			this.http.put(`http://localhost:3000/message/${String(id)}`, { content: newContent }, { 'headers': headers }).subscribe(
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
