import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LayoutRoutingModule } from './layout.routing';

@NgModule({
  imports: [CommonModule, RouterModule, LayoutRoutingModule],
})
export class LayoutModule {}
