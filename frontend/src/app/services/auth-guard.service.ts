import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService {

	constructor(private authService: AuthService) { }

	canActivate(): Observable<boolean> | Promise<boolean> | boolean {
		return this.authService.isConnect()
	}
}
