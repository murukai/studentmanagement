import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GuardianComponent } from '../list/guardian.component';
import { GuardianDetailComponent } from '../detail/guardian-detail.component';
import { GuardianUpdateComponent } from '../update/guardian-update.component';
import { GuardianRoutingResolveService } from './guardian-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const guardianRoute: Routes = [
  {
    path: '',
    component: GuardianComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GuardianDetailComponent,
    resolve: {
      guardian: GuardianRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GuardianUpdateComponent,
    resolve: {
      guardian: GuardianRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GuardianUpdateComponent,
    resolve: {
      guardian: GuardianRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(guardianRoute)],
  exports: [RouterModule],
})
export class GuardianRoutingModule {}
