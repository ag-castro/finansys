import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Entry} from '../shared/entry.model';
import {EntryService} from '../shared/entry.service';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

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

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
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
      type: [null, [Validators.required]],
      amout: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getEntry(+params.get('id')))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        error => alert('Ocorreu um erro no servidor, tente novamente!')
        );
    }
  }

  private setPageTitle() {
    this.currentAction === 'new'
      ? this.pageTitle = 'Cadastro de Nova Lançamento'
      : this.pageTitle = `Editando Lançamento: ${this.entry.name || ''}`;
  }

  submitForm() {
    this.submittingForm = true;
    this.currentAction === 'new'
      ? this.createEntry()
      : this.updateEntry();
  }

  private createEntry() {
    const entry: Entry = Object.assign(
      new Entry(),
      this.entryForm.value
    );
    this.entryService.create(entry)
      .subscribe(
        created => this.actionsForSuccess(created, 'criado'),
        error => this.actionsForError(error, 'criar')
      );
  }

  private updateEntry() {
    const entry: Entry = Object.assign(
      new Entry(),
      this.entryForm.value
    );
    this.entryService.update(entry)
      .subscribe(
        created => this.actionsForSuccess(created, 'editado'),
        error => this.actionsForError(error, 'editar')
      );
  }

  private actionsForSuccess(entry: Entry, msg: string) {
    toastr.success(`Lançamento ${msg} com sucesso!`);
    this.router.navigateByUrl('entries', {skipLocationChange: true})
      .then(
        () => this.router.navigate(['entries', entry.id, 'edit'])
      );
  }

  private actionsForError(error, msg: string) {
    toastr.error(`Error ao tentar ${msg} o lançamento!`);
    this.submittingForm = false;
    error.status === 422
      ? this.serverErrorMessages = JSON.parse(error.body).errors
      : this.serverErrorMessages = ['Falha na comunicação com o servidor. Tente novamente.'];
  }
}
