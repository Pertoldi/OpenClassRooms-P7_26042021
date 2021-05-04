import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
@Injectable({
	providedIn: 'root'
})
export class HeaderComponent implements OnInit, OnDestroy {

	isAuth: boolean = false

	constructor(private authService: AuthService, private router: Router) { }

	async ngOnInit() {
		this.authService.isAuthObservable.subscribe((isAuth:any) => {	//On souscrit à l'observable pour garder la persistance de session
			this.isAuth = isAuth
		}, (error) => {
			throw error
		})
	}

	onSignOut(): void {
		this.isAuth = false
		sessionStorage.removeItem('token')
		sessionStorage.removeItem('userId')
		this.router.navigate(['/auth/signin'])
	}

	async onSignInUp() {//TODO ne marche pas, faire un Observable
		//this.isAuth = await this.authService.isConnect()
		console.log(' onSignInUp isAuth is :', this.isAuth)
	}

	ngOnDestroy(): void {
		this.isAuth = false
		sessionStorage.removeItem('token')
		sessionStorage.removeItem('userId')
	}

}