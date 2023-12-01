import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AddressFormService, AddressFormGroup } from './address-form.service';
import { IAddress } from '../address.model';
import { AddressService } from '../service/address.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { IProvince } from 'app/entities/province/province.model';
import { ProvinceService } from 'app/entities/province/service/province.service';

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.component.html',
})
export class AddressUpdateComponent implements OnInit {
  isSaving = false;
  address: IAddress | null = null;

  countriesSharedCollection: ICountry[] = [];
  provincesSharedCollection: IProvince[] = [];

  editForm: AddressFormGroup = this.addressFormService.createAddressFormGroup();

  constructor(
    protected addressService: AddressService,
    protected addressFormService: AddressFormService,
    protected countryService: CountryService,
    protected provinceService: ProvinceService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCountry = (o1: ICountry | null, o2: ICountry | null): boolean => this.countryService.compareCountry(o1, o2);

  compareProvince = (o1: IProvince | null, o2: IProvince | null): boolean => this.provinceService.compareProvince(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ address }) => {
      this.address = address;
      if (address) {
        this.updateForm(address);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const address = this.addressFormService.getAddress(this.editForm);
    if (address.id !== null) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddress>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(address: IAddress): void {
    this.address = address;
    this.addressFormService.resetForm(this.editForm, address);

    this.countriesSharedCollection = this.countryService.addCountryToCollectionIfMissing<ICountry>(
      this.countriesSharedCollection,
      address.country
    );
    this.provincesSharedCollection = this.provinceService.addProvinceToCollectionIfMissing<IProvince>(
      this.provincesSharedCollection,
      address.province
    );
  }

  protected loadRelationshipsOptions(): void {
    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(map((countries: ICountry[]) => this.countryService.addCountryToCollectionIfMissing<ICountry>(countries, this.address?.country)))
      .subscribe((countries: ICountry[]) => (this.countriesSharedCollection = countries));

    this.provinceService
      .query()
      .pipe(map((res: HttpResponse<IProvince[]>) => res.body ?? []))
      .pipe(
        map((provinces: IProvince[]) => this.provinceService.addProvinceToCollectionIfMissing<IProvince>(provinces, this.address?.province))
      )
      .subscribe((provinces: IProvince[]) => (this.provincesSharedCollection = provinces));
  }
}
