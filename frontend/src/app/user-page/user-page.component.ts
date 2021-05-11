import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-user-page',
	templateUrl: './user-page.component.html',
	styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

	userId = sessionStorage.getItem('userId')
	userForm!: FormGroup
	errorMessage!: string
	UserUrl = '../../assets/people-2388584_1280.png'
	firstName = ''
	lastName = ''
	isOkToModif: boolean = false
	file: File | undefined = undefined

	constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

	ngOnInit(): void {
		this.initForm()
	}

	async initForm() {
		this.userForm = this.formBuilder.group({
			lastName: [null, Validators.required],
			firstName: [null, Validators.required],
			userImg: [null, Validators.required]
		})
		//On récupère les résultats du profil et on les affiches sur la page et dans les placeholders correspondants
		await this.authService.getOneUser(this.userId).then((result) => {
			this.lastName = result[0].lastName
			this.firstName = result[0].firstName
			if (result[0].photo_URL != null) this.UserUrl = result[0].photo_URL
			this.userForm = this.formBuilder.group({
				lastName: [result[0].lastName, Validators.required],
				firstName: [result[0].firstName, Validators.required],
				userImg: [null, Validators.required]
			})

		}).catch((err) => {
			throw err
		});
	}

	onModifyProfil() {
		this.isOkToModif = true
	}

	onFileAdded(event: Event | any) {
		if (event == null) { console.log('FILE IS NOT UPLOADED !') }
		else {
			this.file = event.target.files[0]
		}
	}

	onSubmit() {
		const lastName = this.userForm.get('lastName')!.value
		const firstName = this.userForm.get('firstName')!.value
		this.authService.modifyOneUser(lastName, firstName, this.file)
	}

	OnDelete() {
		if (confirm('Etes vous sur de vouloir supprimer votre profil ?')) {
			this.authService.deleteOneUser()
		}
	}

}
