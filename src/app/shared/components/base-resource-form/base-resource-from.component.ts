import {OnInit, AfterContentChecked, Injector} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {BaseResourceModel} from '../../models/base-resource.model';
import {BaseResourceService} from '../../services/base-resource.service';
import { switchMap } from 'rxjs/operators';


export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
    protected injector: Injector,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T,
    public resource: T,
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    this.currentAction === 'new'
      ? this.createResource()
      : this.updateResource();
  }

  protected abstract buildResourceForm(): void;

  protected setCurrentAction() {
    this.route.snapshot.url[0].path === 'new'
      ? this.currentAction = 'new'
      : this.currentAction = 'edit';
  }

  protected loadResource() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      ).subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource);
        },
        error => alert('Ocorreu um erro no servidor, tente novamente!')
      );
    }
  }

  protected setPageTitle() {
    this.currentAction === 'new'
      ? this.pageTitle = this.creationPageTitle()
      : this.pageTitle = this.editionPageTitle(); // `Editando Categoria: ${this.category.name || ''}`;
  }

  protected creationPageTitle(): string {
    return 'Novo';
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource)
      .subscribe(
        created => this.actionsForSuccess(created, 'criada'),
        error => this.actionsForError(error, 'criar')
      );
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource)
      .subscribe(
        updated => this.actionsForSuccess(updated, 'editada'),
        error => this.actionsForError(error, 'editar')
      );
  }

  protected actionsForSuccess(resource: T, msg: string) {
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Service Message',
    //   detail: `Categoria ${msg} com sucesso!`
    // });
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true})
      .then(
        () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
      );
  }

  protected actionsForError(error, msg: string) {
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Service Message',
    //   detail: `Error ao tentar ${msg} a categoria!`
    // });
    this.submittingForm = false;
    error.status === 422
      ? this.serverErrorMessages = JSON.parse(error.body).errors
      : this.serverErrorMessages = ['Falha na comunicação com o servidor. Tente novamente.'];
  }
}
