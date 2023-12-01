import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEducator } from '../educator.model';
import { EducatorService } from '../service/educator.service';

@Injectable({ providedIn: 'root' })
export class EducatorRoutingResolveService implements Resolve<IEducator | null> {
  constructor(protected service: EducatorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEducator | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((educator: HttpResponse<IEducator>) => {
          if (educator.body) {
            return of(educator.body);
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
