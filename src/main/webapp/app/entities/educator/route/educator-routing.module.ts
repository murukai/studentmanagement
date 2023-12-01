import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EducatorComponent } from '../list/educator.component';
import { EducatorDetailComponent } from '../detail/educator-detail.component';
import { EducatorUpdateComponent } from '../update/educator-update.component';
import { EducatorRoutingResolveService } from './educator-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const educatorRoute: Routes = [
  {
    path: '',
    component: EducatorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EducatorDetailComponent,
    resolve: {
      educator: EducatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EducatorUpdateComponent,
    resolve: {
      educator: EducatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EducatorUpdateComponent,
    resolve: {
      educator: EducatorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(educatorRoute)],
  exports: [RouterModule],
})
export class EducatorRoutingModule {}
