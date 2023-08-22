import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NoteList } from '../note-list/note-list.component';

@NgModule({ // each component must belong to an NG module in order to be available to others
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoteList,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
