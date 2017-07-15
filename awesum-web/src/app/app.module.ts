import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { AwesumService } from './awesum.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [AwesumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
