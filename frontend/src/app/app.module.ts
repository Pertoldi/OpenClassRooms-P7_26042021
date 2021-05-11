import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { HttpClientModule } from '@angular/common/http';
import { PostListComponent } from './post-list/post-list.component';
import { SinglePostComponent } from './post-list/single-post/single-post.component';
import { PostFormComponent } from './post-list/post-form/post-form.component';
import { PostsService } from './services/posts.service';
import { PostModifyComponent } from './post-list/post-modify/post-modify.component';
import { UserPageComponent } from './user-page/user-page.component';
import { MessagesComponent } from './post-list/messages/messages.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SigninComponent,
    SignupComponent,
    FourOhFourComponent,
    PostListComponent,
    SinglePostComponent,
    PostFormComponent,
    PostModifyComponent,
    UserPageComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
		AuthGuardService,
    PostsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
