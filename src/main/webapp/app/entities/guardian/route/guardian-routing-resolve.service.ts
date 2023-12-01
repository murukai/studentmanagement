import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGuardian } from '../guardian.model';
import { GuardianService } from '../service/guardian.service';

@Injectable({ providedIn: 'root' })
export class GuardianRoutingResolveService implements Resolve<IGuardian | null> {
  constructor(protected service: GuardianService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGuardian | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((guardian: HttpResponse<IGuardian>) => {
          if (guardian.body) {
            return of(guardian.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
