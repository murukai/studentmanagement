import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GuardianComponent } from './list/guardian.component';
import { GuardianDetailComponent } from './detail/guardian-detail.component';
import { GuardianUpdateComponent } from './update/guardian-update.component';
import { GuardianDeleteDialogComponent } from './delete/guardian-delete-dialog.component';
import { GuardianRoutingModule } from './route/guardian-routing.module';

@NgModule({
  imports: [SharedModule, GuardianRoutingModule],
  declarations: [GuardianComponent, GuardianDetailComponent, GuardianUpdateComponent, GuardianDeleteDialogComponent],
})
export class GuardianModule {}
