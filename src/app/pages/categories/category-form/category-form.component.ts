import {Component, Injector} from '@angular/core';
import { Validators } from '@angular/forms';
import {BaseResourceFormComponent} from '../../../shared/components/base-resource-form/base-resource-from.component';
import {Category} from '../shared/category.model';
import {CategoryService} from '../shared/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})

export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, categoryService , Category.fromJson, new Category());
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null]
    });
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Nova Categoria';
  }

  protected editionPageTitle(): string {
    return `Editando Categoria: ${this.resource.name || ''}`;
  }
}
