import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTagFilingComponent } from './create-tag-filing/create-tag-filing.component';
import { CreateTagFilingRoutes } from './tax-filing.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberComponent } from '../../component/input-number/input-number.component';
import { StepComponent } from '../../component/step/step.component';
import { MonthPipe } from 'src/app/core/pipe/month.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreateTagFilingRoutes,
  ],
  declarations: [
    CreateTagFilingComponent,
    InputNumberComponent,
    StepComponent,
    MonthPipe,
  ],
  exports: [CreateTagFilingComponent],
})
export class CreateTagFilingModule {}
