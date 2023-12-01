import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEducator } from '../educator.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-educator-detail',
  templateUrl: './educator-detail.component.html',
})
export class EducatorDetailComponent implements OnInit {
  educator: IEducator | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ educator }) => {
      this.educator = educator;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
