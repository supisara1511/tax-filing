import { Routes, RouterModule } from '@angular/router';
import { CreateTagFilingComponent } from './create-tag-filing/create-tag-filing.component';

const routes: Routes = [
  {
    path: '',
    component: CreateTagFilingComponent,
  },
];

export const CreateTagFilingRoutes = RouterModule.forChild(routes);
