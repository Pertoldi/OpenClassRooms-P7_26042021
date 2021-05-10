import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { PostFormComponent } from './post-list/post-form/post-form.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostModifyComponent } from './post-list/post-modify/post-modify.component';
import { AuthGuardService } from './services/auth-guard.service'

const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'post-list', canActivate: [AuthGuardService], component: PostListComponent },
  { path: 'post-list/post-form', canActivate: [AuthGuardService], component: PostFormComponent },
  { path: 'post-list/post-modify/:id', canActivate: [AuthGuardService], component: PostModifyComponent },
  { path: 'not-found', component: FourOhFourComponent },
	{ path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
