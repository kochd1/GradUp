import { Component, ViewChild } from '@angular/core';
import { JournalPage } from '../journal/journal';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { HelpPage } from "../help/help";
import { AdaptionsPage } from '../adaptions/adaptions';
import { Tabs } from 'ionic-angular/umd/navigation/nav-interfaces';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1 = JournalPage;
  tab2 = InformationDocumentationPage;
  tab3 = HelpPage;
  tab4 = AdaptionsPage;

  @ViewChild('mainTabs') tabRef: Tabs;


  constructor() {
  }
  
  tabChanged($ev) {
    $ev.setRoot($ev.root);
  }

}
