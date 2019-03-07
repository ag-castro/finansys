import { Injectable, Injector } from '@angular/core';
import {Observable} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import { Entry } from './entry.model';
import {CategoryService} from '../../categories/shared/category.service';
import {BaseResourceService} from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
) {
    super('api/entries', injector);
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(item => entries.push(
      Object.assign(new Entry(), item)
    ));
    return entries;
  }

  private jsonDataToEntry(jsondata: any): Entry {
    return Object.assign(new Entry(), jsondata);
  }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }

}
