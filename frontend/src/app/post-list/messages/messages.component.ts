import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';


@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

	@Input() messageUserId!: number
	@Input() content!: string
	@Input() messageId!: number

	@Output() oneLessMessage = new EventEmitter()					//Output, pour pouvoir transmettre l'information au parent

	firstName: string = ''
	lastName: string = ''
	userUrl: string = '../../../assets/people-2388584_1280.png'

	isMyComment: boolean = false
	isDelete: boolean = false
	IsSettingOpen: boolean = false
	isInModification: boolean = false

	modifyMessageForm!: FormGroup
	errorMessage!: string

	constructor(private authService: AuthService, private messagesService: MessagesService, private router: Router, private formBuilder: FormBuilder) { }

	ngOnInit(): void {
		this.isMycomment()
		this.authService.isAdmin().then(												//Si l'utilisateur est Admin, il peut modifier ou supprimer le message
			(isAdmin: boolean) => {
				if (isAdmin) {
					this.isMyComment = true
				}
			}
		)
		this.getUserInfo(this.messageUserId)
		this.initForm()
	}

	getUserInfo(id: number) {
		this.authService.getOneUser(this.messageUserId).then(
			(data) => {
				this.firstName = data[0].firstName
				this.lastName = data[0].lastName
				if (data[0].photo_URL != null) {
					this.userUrl = data[0].photo_URL
				}
			}
		)
	}
	isMycomment(): void {
		const actualUserId = sessionStorage.getItem('userId')
		if (actualUserId == String(this.messageUserId)) {	//Si l'utilisateur actuel est celui qui écrit le post alors il a acces a la modif/supp de celui-ci
			this.isMyComment = true
		}
	}

	initForm(): void {
		this.modifyMessageForm = this.formBuilder.group({
			message: [this.content, Validators.required]
		})
	}

	onMessageSetting(): void {
		if (this.IsSettingOpen) {
			this.IsSettingOpen = false
			this.isInModification = false
		} else {
			this.IsSettingOpen = true
		}
	}

	onModify(): void {
		if (this.isInModification == false) {
			this.isInModification = true
		} else {
			this.isInModification = false
		}
	}

	onDelete(): void {
		if (confirm('Etes vous sur de vouloir supprimer ce message ?')) {
			this.messagesService.deleteMessage(this.messageId).then(() => {
				this.isDelete = true
				this.oneLessMessage.emit()
			})
		}
	}

	onSubmitModifyForm() {
		const newContent = this.modifyMessageForm.get('message')!.value
		this.messagesService.modifyMessage(this.messageId, newContent).then(() => {
			this.errorMessage = ''
			this.content = newContent
			this.onMessageSetting()
		}).catch((error) => {
			this.errorMessage = error.error.message
		})
	}

}
