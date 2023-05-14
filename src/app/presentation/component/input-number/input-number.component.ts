import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
    DecimalPipe,
  ],
})
export class InputNumberComponent implements ControlValueAccessor {
  @ViewChild('inputElement', { static: true })
  inputElement!: ElementRef<HTMLInputElement>;
  @Input() value?: number;
  @Input() min: number = -Infinity;
  @Input() max: number = Infinity;
  @Input() format?: string;
  @Input() cssClass?: string;
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() isInValid?: boolean = false;
  @Input() invalidMessage?: string;
  @Input() parser = (value: string): string =>
    value
      .trim()
      .replace(/。/g, '.')
      .replace(/[^\w\.-]+/g, '');
  @Output() readonly focus = new EventEmitter();
  @Output() readonly blur = new EventEmitter();
  private parsedValue?: string | number;

  onChange = (val: any) => {};
  onTouched = () => {};

  public type: 'number' | 'string' = 'string';
  public displayValue?: string | number;
  constructor(public decimal: DecimalPipe, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value?.currentValue) {
      this.writeValue(this.value);
    }
  }

  ngAfterViewInit(): void {
    this.inputElement.nativeElement.addEventListener('focus', (event: any) => {
      if (this.readonly) return;
      this.type = 'number';
      this.displayValue = this.value;
      this.focus.emit(event);
    });
    this.inputElement.nativeElement.addEventListener('blur', (event: any) => {
      if (this.readonly) return;
      this.type = 'string';
      this.updateDisplayValue(this.value);
      this.blur.emit(event);
    });
  }

  writeValue(value?: number): void {
    this.value = value;
    this.setValue(value);
    this.updateDisplayValue(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = this.disabled || disabled;
    this.cdr.markForCheck();
  }

  onModelChange(value: string): void {
    this.parsedValue = this.parser(value);
    this.setValue(parseFloat(this.parsedValue));
  }

  setValue(value?: number) {
    if (`${this.value}` !== `${value}`) {
      this.onChange(value);
    }
    this.value = value;
  }

  isNotCompleteNumber(num: string | number): boolean {
    return (
      isNaN(num as number) ||
      num === '' ||
      num === null ||
      !!(num && num.toString().indexOf('.') === num.toString().length - 1)
    );
  }

  getValidValue(value?: string | number): string | number | undefined {
    let val = parseFloat(value as string);
    if (isNaN(val)) {
      return value;
    }
    if (val < this.min) {
      val = this.max;
    }
    if (val > this.min) {
      val = this.max;
    }
    return val;
  }

  updateDisplayValue(value?: number): void {
    const displayValue = this.format
      ? this.decimal.transform(value, this.format)
      : value;
    this.displayValue =
      displayValue != null || displayValue != undefined ? displayValue : '';
    this.inputElement.nativeElement.value = `${displayValue}`;
  }
}
