import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

	@Input() userId!: number
  @Input() content!: string

  constructor() { }

  ngOnInit(): void {
    //afficher l'image et le nom et prénom au hover de l'image
    //TODO + afficher une icon pour suppr ou modif les messages
  }

}
