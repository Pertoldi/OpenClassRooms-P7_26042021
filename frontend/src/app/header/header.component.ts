import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	isAuth: boolean = true
	constructor() { }

	ngOnInit(): void {
		//promise qui vérifie le token d'authentification si isOk alors isAuth = true
	}

	onSignOut(): void {
		this.isAuth = false
	}

}