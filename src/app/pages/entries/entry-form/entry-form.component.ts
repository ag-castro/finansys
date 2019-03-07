import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Entry} from '../shared/entry.model';
import {EntryService} from '../shared/entry.service';
import { switchMap } from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {Category} from '../../categories/shared/category.model';
import {CategoryService} from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();
  categories: Array<Category>;
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };
  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    this.route.snapshot.url[0].path === 'new'
      ? this.currentAction = 'new'
      : this.currentAction = 'edit';
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        error => alert('Ocorreu um erro no servidor, tente novamente!')
        );
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  private setPageTitle() {
    this.currentAction === 'new'
      ? this.pageTitle = 'Cadastro de Nova Lançamento'
      : this.pageTitle = `Editando Lançamento: ${this.entry.name || ''}`;
  }

  private createEntry() {
    const entry: Entry = Entry.fromJson(this.entryForm.value);
    this.entryService.create(entry)
      .subscribe(
        created => this.actionsForSuccess(created, 'criado'),
        error => this.actionsForError(error, 'criar')
      );
  }

  private updateEntry() {
    const entry: Entry = Entry.fromJson(this.entryForm.value);
    this.entryService.update(entry)
      .subscribe(
        created => this.actionsForSuccess(created, 'editado'),
        error => this.actionsForError(error, 'editar')
      );
  }

  private actionsForSuccess(entry: Entry, msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Service Message',
      detail: `Lançamento ${msg} com sucesso!`
    });
    this.router.navigateByUrl('entries', {skipLocationChange: true})
      .then(
        () => this.router.navigate(['entries', entry.id, 'edit'])
      );
  }

  private actionsForError(error, msg: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Service Message',
      detail: `Error ao tentar ${msg} o lançamento!`
    });
    this.submittingForm = false;
    error.status === 422
      ? this.serverErrorMessages = JSON.parse(error.body).errors
      : this.serverErrorMessages = ['Falha na comunicação com o servidor. Tente novamente.'];
  }

  submitForm() {
    this.submittingForm = true;
    this.currentAction === 'new'
      ? this.createEntry()
      : this.updateEntry();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {text, value};
      }
    );
  }

}
