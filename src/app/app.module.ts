import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';  // <-- Must be imported

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule  // <-- Must be listed here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
