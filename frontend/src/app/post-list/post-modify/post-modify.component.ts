import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-modify',
  templateUrl: './post-modify.component.html',
  styleUrls: ['./post-modify.component.scss']
})
export class PostModifyComponent implements OnInit {

  postFormModify!: FormGroup
  errorMessage!: string
  file: File | undefined = undefined

  constructor(private formBuilder: FormBuilder, private postsService: PostsService) { }

  async ngOnInit(): Promise<any> {
    //TODO requete sur le post en question + ajouter les values dans le formulaire et envoyer en put
    this.initForm()


  }

  async initForm() {
    this.postFormModify = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      postImg: [null, Validators.required]
    })
    //On ajoute les valeurs du post dans leurs placeholders
    let urlParam = this.getURLParam()
    await this.postsService.getOnePost(urlParam).then((post) => {
      console.log('data is :', post)

      const getKeyValue = < U extends keyof T,T extends object>(key: U) => (obj: T) =>
      obj[key];
      const getPostTitle = getKeyValue<keyof Post, Post>("title")(post);
      console.log('getPostTitle is :', getPostTitle)
      
      this.postFormModify = this.formBuilder.group({
        title: [`${post.title}`, Validators.required],
        description: [`${post.description}`, Validators.required],
        postImg: [null, Validators.required]
      })
    }).catch((error) => {throw error})
    

   //TODO post dans post service est bon mais data is undefined
    //On ajoute les valeurs dans les placeholders correspondant
  }

  getURLParam():string {
    let url = window.location.href
    let urls = url.split('/')
    url = urls[urls.length - 1]
    return url
  }

  onSubmit() {
    const title = this.postFormModify.get('title')!.value
		const description = this.postFormModify.get('description')!.value
    const id = this.getURLParam()

		this.postsService.modifyPost(id ,title, description, this.file)
  }

  onFileAdded(event: Event | any) {
		if (event == null) { console.log('FILE IS NOT UPLOADED !') }
		else {
			this.file = event.target.files[0]
		}
  }

}
