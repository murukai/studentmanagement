import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrade } from '../grade.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-grade-detail',
  templateUrl: './grade-detail.component.html',
})
export class GradeDetailComponent implements OnInit {
  grade: IGrade | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grade }) => {
      this.grade = grade;
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
