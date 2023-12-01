import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGuardian } from '../guardian.model';

@Component({
  selector: 'jhi-guardian-detail',
  templateUrl: './guardian-detail.component.html',
})
export class GuardianDetailComponent implements OnInit {
  guardian: IGuardian | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ guardian }) => {
      this.guardian = guardian;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
