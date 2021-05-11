import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesService } from 'src/app/services/messages.service';


@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

	@Input() userId!: number
	@Input() content!: string
	@Input() messageId!: number

	firstName: string = ''
	lastName: string = ''
	userUrl: string = '../../../assets/people-2388584_1280.png'

	isMyComment: boolean = false
	isDelete: boolean = false

	constructor(private authService: AuthService, private messagesService: MessagesService, private router: Router) { }

	ngOnInit(): void {
		//afficher l'image et le nom et prénom au hover de l'image
		//TODO + afficher une icon pour suppr ou modif les messages
		this.isMycomment()
		this.getUserInfo(this.userId)
	}

	getUserInfo(id: number) {
		this.authService.getOneUser(this.userId).then(
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
		if (actualUserId == String(this.userId)) {	//Si l'utilisateur actuel est celui qui écrit le post alors il a acces a la modif/supp de celui-ci
			this.isMyComment = true
		}
	}

	onMessageSetting(elem: HTMLElement) {
		if (elem.classList.contains("display-message-settings")) {
			elem.classList.remove("display-message-settings")
		} else {
			elem.classList.add("display-message-settings")
		}
	}

	onModify() {

	}

	onDelete() {
		if (confirm('Etes vous sur de vouloir supprimer ce post ?')) {
			this.messagesService.deleteMessage(this.messageId).then(() => {
				this.isDelete = true
			}
			)

		}
	}
}
