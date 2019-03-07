import {BaseResourceModel} from '../models/base-resource.model';
import {Injector} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';



export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  protected constructor(
    protected apiPath: string,
    protected injector: Injector
  ) {
    this.http = injector.get(HttpClient);
  }

  protected handleError(error: any): Observable<any> {
    console.log(`Erro na requisição => ${error}`);
    return throwError(error);
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(item => resources.push(item as T));
    return resources;
  }

  protected jsonDataToResource(jsondata: any): T {
    return jsondata as T;
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this.http.put(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => true)
    );
  }

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

}
