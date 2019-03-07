import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import {MessageService} from 'primeng/api';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent
  ],
  imports: [
    SharedModule,
    CategoriesRoutingModule,
  ],
  providers: [
    MessageService
  ]
})
export class CategoriesModule { }
