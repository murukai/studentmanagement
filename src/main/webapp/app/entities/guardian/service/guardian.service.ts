import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGuardian, NewGuardian } from '../guardian.model';

export type PartialUpdateGuardian = Partial<IGuardian> & Pick<IGuardian, 'id'>;

export type EntityResponseType = HttpResponse<IGuardian>;
export type EntityArrayResponseType = HttpResponse<IGuardian[]>;

@Injectable({ providedIn: 'root' })
export class GuardianService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/guardians');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(guardian: NewGuardian): Observable<EntityResponseType> {
    return this.http.post<IGuardian>(this.resourceUrl, guardian, { observe: 'response' });
  }

  update(guardian: IGuardian): Observable<EntityResponseType> {
    return this.http.put<IGuardian>(`${this.resourceUrl}/${this.getGuardianIdentifier(guardian)}`, guardian, { observe: 'response' });
  }

  partialUpdate(guardian: PartialUpdateGuardian): Observable<EntityResponseType> {
    return this.http.patch<IGuardian>(`${this.resourceUrl}/${this.getGuardianIdentifier(guardian)}`, guardian, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGuardian>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGuardian[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGuardianIdentifier(guardian: Pick<IGuardian, 'id'>): number {
    return guardian.id;
  }

  compareGuardian(o1: Pick<IGuardian, 'id'> | null, o2: Pick<IGuardian, 'id'> | null): boolean {
    return o1 && o2 ? this.getGuardianIdentifier(o1) === this.getGuardianIdentifier(o2) : o1 === o2;
  }

  addGuardianToCollectionIfMissing<Type extends Pick<IGuardian, 'id'>>(
    guardianCollection: Type[],
    ...guardiansToCheck: (Type | null | undefined)[]
  ): Type[] {
    const guardians: Type[] = guardiansToCheck.filter(isPresent);
    if (guardians.length > 0) {
      const guardianCollectionIdentifiers = guardianCollection.map(guardianItem => this.getGuardianIdentifier(guardianItem)!);
      const guardiansToAdd = guardians.filter(guardianItem => {
        const guardianIdentifier = this.getGuardianIdentifier(guardianItem);
        if (guardianCollectionIdentifiers.includes(guardianIdentifier)) {
          return false;
        }
        guardianCollectionIdentifiers.push(guardianIdentifier);
        return true;
      });
      return [...guardiansToAdd, ...guardianCollection];
    }
    return guardianCollection;
  }
}
