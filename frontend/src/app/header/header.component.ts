import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
	isAuthSubscription!: Subscription

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit() {

		this.isAuthSubscription = this.authService.isAuthSubject.subscribe(
			(isAuth: boolean) => {
				this.isAuth = isAuth
			}, (error) => {
				throw error
			}
		)
	}

	onSignOut(): void {
		this.isAuth = false
		sessionStorage.removeItem('token')
		sessionStorage.removeItem('userId')
		this.router.navigate(['/auth/signin'])
	}


	ngOnDestroy(): void {
		this.isAuth = false
		sessionStorage.removeItem('token')
		sessionStorage.removeItem('userId')
		this.isAuthSubscription.unsubscribe()
	}


}