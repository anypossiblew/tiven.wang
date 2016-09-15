import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { TodoComponent }   from './todo.component';

@NgModule({
  imports: [ 
  	BrowserModule,
  	FormsModule 
  ],
  declarations: [ TodoComponent ],
  bootstrap:    [ TodoComponent ]
})
export class AppModule { }
