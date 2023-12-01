import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEducator, NewEducator } from '../educator.model';

export type PartialUpdateEducator = Partial<IEducator> & Pick<IEducator, 'id'>;

export type EntityResponseType = HttpResponse<IEducator>;
export type EntityArrayResponseType = HttpResponse<IEducator[]>;

@Injectable({ providedIn: 'root' })
export class EducatorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/educators');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(educator: NewEducator): Observable<EntityResponseType> {
    return this.http.post<IEducator>(this.resourceUrl, educator, { observe: 'response' });
  }

  update(educator: IEducator): Observable<EntityResponseType> {
    return this.http.put<IEducator>(`${this.resourceUrl}/${this.getEducatorIdentifier(educator)}`, educator, { observe: 'response' });
  }

  partialUpdate(educator: PartialUpdateEducator): Observable<EntityResponseType> {
    return this.http.patch<IEducator>(`${this.resourceUrl}/${this.getEducatorIdentifier(educator)}`, educator, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEducator>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEducator[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEducatorIdentifier(educator: Pick<IEducator, 'id'>): number {
    return educator.id;
  }

  compareEducator(o1: Pick<IEducator, 'id'> | null, o2: Pick<IEducator, 'id'> | null): boolean {
    return o1 && o2 ? this.getEducatorIdentifier(o1) === this.getEducatorIdentifier(o2) : o1 === o2;
  }

  addEducatorToCollectionIfMissing<Type extends Pick<IEducator, 'id'>>(
    educatorCollection: Type[],
    ...educatorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const educators: Type[] = educatorsToCheck.filter(isPresent);
    if (educators.length > 0) {
      const educatorCollectionIdentifiers = educatorCollection.map(educatorItem => this.getEducatorIdentifier(educatorItem)!);
      const educatorsToAdd = educators.filter(educatorItem => {
        const educatorIdentifier = this.getEducatorIdentifier(educatorItem);
        if (educatorCollectionIdentifiers.includes(educatorIdentifier)) {
          return false;
        }
        educatorCollectionIdentifiers.push(educatorIdentifier);
        return true;
      });
      return [...educatorsToAdd, ...educatorCollection];
    }
    return educatorCollection;
  }
}
