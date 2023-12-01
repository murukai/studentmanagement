import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'student',
        data: { pageTitle: 'Students' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'educator',
        data: { pageTitle: 'Educators' },
        loadChildren: () => import('./educator/educator.module').then(m => m.EducatorModule),
      },
      {
        path: 'grade',
        data: { pageTitle: 'Grades' },
        loadChildren: () => import('./grade/grade.module').then(m => m.GradeModule),
      },
      {
        path: 'guardian',
        data: { pageTitle: 'Guardians' },
        loadChildren: () => import('./guardian/guardian.module').then(m => m.GuardianModule),
      },
      {
        path: 'address',
        data: { pageTitle: 'Addresses' },
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule),
      },
      {
        path: 'country',
        data: { pageTitle: 'Countries' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'province',
        data: { pageTitle: 'Provinces' },
        loadChildren: () => import('./province/province.module').then(m => m.ProvinceModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
