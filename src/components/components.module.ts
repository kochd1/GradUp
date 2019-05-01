import { NgModule } from '@angular/core';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { PopoverComponent } from './popover/popover';
@NgModule({
  declarations: [
    AccordionListComponent,
    PopoverComponent],
  imports: [],
  exports: [
    AccordionListComponent,
    PopoverComponent]
})
export class ComponentsModule { }
