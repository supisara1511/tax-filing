import { TaxFilingType } from '../../../../core/enum/tax.enum';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  PENALTY_ADDITIONAL_RATE,
  PENALTY_ORDINARY_RATE,
  SURCHARGE_ADDITIONAL_RATE,
  SURCHARGE_ORDINARY_RATE,
  VAT_RATE,
} from 'src/app/core/const/tax.const';
import { TaxModel } from 'src/app/core/domain/tax.interface';
import { generateMonthArray, getMonthNumber } from 'src/app/core/util/mouth';
import { getListYear } from 'src/app/core/util/year';

@Component({
  selector: 'app-create-tag-filing',
  templateUrl: './create-tag-filing.component.html',
  styleUrls: ['./create-tag-filing.component.scss'],
})
export class CreateTagFilingComponent {
  public form: FormGroup;
  public taxData?: TaxModel;
  private currentDate: Date = new Date();
  private startYear: number = 2020;
  public selectStep: number = 0;
  public isSumited: boolean = false;
  public years: number[] = getListYear(this.startYear);
  public months: { name: string; value: string; disabled: boolean }[] =
    generateMonthArray(undefined, 1);
  public filingTypeSouece: { [name: string]: { text: string; value: string } } =
    {
      [TaxFilingType.Ordinary]: {
        text: 'Ordinary Filing',
        value: TaxFilingType.Ordinary,
      },
      [TaxFilingType.Additional]: {
        text: 'Additional Filing',
        value: TaxFilingType.Additional,
      },
    };
  public filingTypes = Object.keys(this.filingTypeSouece).map((key) => key);

  public step = [
    {
      name: 'Input Detail',
    },
    {
      name: 'Review & Confirm',
    },
  ];

  get TaxFilingType() {
    return TaxFilingType;
  }
  get filingType() {
    return this.form.get('filingType');
  }
  get month() {
    return this.form.get('month');
  }
  get year() {
    return this.form.get('year');
  }
  get saleAmount() {
    return this.form.get('saleAmount');
  }
  get taxAmount() {
    return this.form.get('taxAmount');
  }
  get surcharge() {
    return this.form.get('surcharge');
  }
  get penalty() {
    return this.form.get('penalty');
  }
  get totalAmount() {
    return this.form.get('totalAmount');
  }
  get isShowVaildate(): boolean {
    return this.isSumited && this.form.invalid;
  }

  constructor() {
    this.form = new FormGroup({
      filingType: new FormControl(TaxFilingType.Ordinary, Validators.required),
      month: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required),
      saleAmount: new FormControl(null, Validators.required),
      taxAmount: new FormControl(null, [
        Validators.required,
        this.validatorPenalty(),
      ]),
      surcharge: new FormControl(null),
      penalty: new FormControl(PENALTY_ORDINARY_RATE),
      totalAmount: new FormControl(),
    });
  }

  private validatorPenalty(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.parent) {
        const saleAmount = this.saleAmount?.value;
        const taxAmount = parseFloat((saleAmount * 0.07).toFixed(2));
        const minTaxAmount = taxAmount - 20;
        const maxTaxAmount = taxAmount + 20;
        if (control.value < minTaxAmount || control.value > maxTaxAmount) {
          return { invalid: true };
        }
      }
      return null;
    };
  }

  public onYearChange() {
    const year = parseInt(this.year?.value);
    this.months = generateMonthArray(year);
    const isCurrentYear = year === this.currentDate.getFullYear();
    const month = getMonthNumber(this.month?.value);
    if (isCurrentYear && month) {
      const isInvalid = month > this.currentDate.getMonth();
      if (isInvalid) this.month?.setValue(null);
    }
  }

  private calculateSurcharge() {
    const rate =
      this.filingType?.value === TaxFilingType.Ordinary
        ? SURCHARGE_ORDINARY_RATE
        : SURCHARGE_ADDITIONAL_RATE;
    const taxAmount = this.taxAmount?.value || 0;
    const surcharge = parseFloat((taxAmount * rate).toFixed(2));
    this.surcharge?.setValue(surcharge);
  }

  private calculatePenalty() {
    const rate =
      this.filingType?.value === TaxFilingType.Ordinary
        ? PENALTY_ORDINARY_RATE
        : PENALTY_ADDITIONAL_RATE;
    this.penalty?.setValue(rate);
  }

  public calculateTaxAmount() {
    const saleAmount = this.saleAmount?.value || 0;
    const taxAmount = parseFloat((saleAmount * VAT_RATE).toFixed(2));
    this.taxAmount?.setValue(taxAmount);
  }

  public calculateTotalAmount() {
    const taxAmount = this.taxAmount?.value || 0;
    const surcharge = this.surcharge?.value || 0;
    const penalty = this.penalty?.value || 0;
    const totalAmount = parseFloat(
      (taxAmount + surcharge + penalty).toFixed(2)
    );
    this.totalAmount?.setValue(totalAmount);
  }

  public calculateVat() {
    this.calculateTaxAmount();
    this.calculateTax();
  }

  public calculateTax() {
    this.calculateSurcharge();
    this.calculatePenalty();
    this.calculateTotalAmount();
  }

  public submit(form: FormGroupDirective) {
    if (form.valid) {
      this.taxData = form.value;
      this.isSumited = false;
      this.selectStep = 1;
    } else {
      this.isSumited = true;
    }
  }

  onBackStep() {
    // โจทย์ไม่ชัดเจน
  }
  public onShowDetail() {
    window.alert(JSON.stringify(this.taxData));
  }
}
