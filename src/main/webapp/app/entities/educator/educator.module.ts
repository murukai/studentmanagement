import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EducatorComponent } from './list/educator.component';
import { EducatorDetailComponent } from './detail/educator-detail.component';
import { EducatorUpdateComponent } from './update/educator-update.component';
import { EducatorDeleteDialogComponent } from './delete/educator-delete-dialog.component';
import { EducatorRoutingModule } from './route/educator-routing.module';

@NgModule({
  imports: [SharedModule, EducatorRoutingModule],
  declarations: [EducatorComponent, EducatorDetailComponent, EducatorUpdateComponent, EducatorDeleteDialogComponent],
})
export class EducatorModule {}
