import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private formBuilder: FormBuilder, private postsService: PostsService, private router:Router) { }

  ngOnInit(): void {
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
    await this.postsService.getOnePost(urlParam).then((data) => {
      this.postFormModify = this.formBuilder.group({
        title: [`${data.title}`, Validators.required],
        description: [`${data.description}`, Validators.required],
        postImg: [null, Validators.required]
      })
    }).catch((error) => { throw error })
  }

  getURLParam(): string {
    let url = window.location.href
    let urls = url.split('/')
    url = urls[urls.length - 1]
    return url
  }

  onSubmit() {
    const title = this.postFormModify.get('title')!.value
    const description = this.postFormModify.get('description')!.value
    const id = this.getURLParam()

    this.postsService.modifyPost(id, title, description, this.file).then(() => {
      this.router.navigate(['/post-list'])
    }).catch((error) => {
      this.errorMessage = error.error.message
    })
  }

  onFileAdded(event: Event | any) {
    if (event == null) { console.log('FILE IS NOT UPLOADED !') }
    else {
      this.file = event.target.files[0]
    }
  }

}
