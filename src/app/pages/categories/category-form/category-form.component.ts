import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Category} from '../shared/category.model';
import {CategoryService} from '../shared/category.service';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    this.route.snapshot.url[0].path === 'new'
      ? this.currentAction = 'new'
      : this.currentAction = 'edit';
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getCategory(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);
        },
        error => alert('Ocorreu um erro no servidor, tente novamente!')
        );
    }
  }

  private setPageTitle() {
    this.currentAction === 'new'
      ? this.pageTitle = 'Cadastro de Nova Categoria'
      : this.pageTitle = `Editando Categoria: ${this.category.name || ''}`;
  }

  submitForm() {
    this.submittingForm = true;
    this.currentAction === 'new'
      ? this.createCategory()
      : this.updateCategory();
  }

  private createCategory() {
    const category: Category = Object.assign(
      new Category(),
      this.categoryForm.value
    );
    this.categoryService.create(category)
      .subscribe(
        created => this.actionsForSuccess(created, 'criada'),
        error => this.actionsForError(error)
      );
  }

  private updateCategory() {
    const category: Category = Object.assign(
      new Category(),
      this.categoryForm.value
    );
    this.categoryService.update(category)
      .subscribe(
        created => this.actionsForSuccess(created, 'editada'),
        error => this.actionsForError(error)
      );
  }

  private actionsForSuccess(category: Category, msg: string) {
    toastr.success(`Categoria ${msg} com sucesso!`);
    this.router.navigateByUrl('categories', {skipLocationChange: true})
      .then(
        () => this.router.navigate(['categories', category.id, 'edit'])
      );
  }

  private actionsForError(error) {
    toastr.error('Error ao tentar criar a nova categoria!');
    this.submittingForm = false;
    error.status === 422
      ? this.serverErrorMessages = JSON.parse(error.body).errors
      : this.serverErrorMessages = ['Falha na comunicação com o servidor. Tente novamente.'];
  }
}
