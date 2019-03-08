import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PageheaderComponent } from './components/pageheader/pageheader.component';
import { FormerrorComponent } from './components/formerror/formerror.component';

@NgModule({
  declarations: [BreadcrumbComponent, PageheaderComponent, FormerrorComponent],
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
    PageheaderComponent,
    FormerrorComponent
  ]
})
export class SharedModule { }
