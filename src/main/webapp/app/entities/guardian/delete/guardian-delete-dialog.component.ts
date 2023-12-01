import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGuardian } from '../guardian.model';
import { GuardianService } from '../service/guardian.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './guardian-delete-dialog.component.html',
})
export class GuardianDeleteDialogComponent {
  guardian?: IGuardian;

  constructor(protected guardianService: GuardianService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.guardianService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
