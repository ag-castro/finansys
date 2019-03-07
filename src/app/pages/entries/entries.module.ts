import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import {EntryFormComponent} from './entry-form/entry-form.component';
import {CalendarModule} from 'primeng/calendar';
import {IMaskModule} from 'angular-imask';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@NgModule({
  declarations: [EntryListComponent, EntryFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EntriesRoutingModule,
    CalendarModule,
    ToastModule,
    IMaskModule
  ],
  providers: [
    MessageService
  ]
})
export class EntriesModule { }
