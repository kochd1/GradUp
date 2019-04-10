import { NgModule } from '@angular/core';
import { TestComponent } from './test/test';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { PopoverComponent } from './popover/popover';
@NgModule({
	declarations: [TestComponent,
    AccordionListComponent,
    PopoverComponent],
	imports: [],
	exports: [TestComponent,
    AccordionListComponent,
    PopoverComponent]
})
export class ComponentsModule {}
