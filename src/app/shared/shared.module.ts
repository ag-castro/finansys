import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageheaderComponent } from './components/pageheader/pageheader.component';

@NgModule({
  declarations: [BreadcrumbComponent, PageheaderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    PageheaderComponent
  ]
})
export class SharedModule { }
