import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { AwesumService } from './awesum.service';

// Load Open Sans typeface
import 'typeface-open-sans';
import { IndexComponent } from './index/index.component';
import { ListComponent } from './list/list.component';

const appRoutes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'list/:owner/:name', component: ListComponent },
  { path: 'home', component: IndexComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
  ],
  providers: [AwesumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
