import { Component, ViewChild } from '@angular/core';
import { JournalPage } from '../journal/journal';
import { InformationDocumentationPage } from '../information-documentation/information-documentation';
import { SupportPage } from "../support/support";
import { AdaptionsPage } from '../adaptions/adaptions';
import { Tabs } from 'ionic-angular/umd/navigation/nav-interfaces';
import { GoalsManagementPage } from '../goals-management/goals-management';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1 = JournalPage;
  tab2 = InformationDocumentationPage;
  tab3 = GoalsManagementPage;
  tab4 = SupportPage;
  tab5 = AdaptionsPage;

  @ViewChild('mainTabs') tabRef: Tabs;


  constructor() {
  }

  tabChanged($ev) {
    $ev.setRoot($ev.root);
  }

}
