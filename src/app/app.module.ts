import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SecureStorage } from "@ionic-native/secure-storage";
import { Network } from "@ionic-native/network";
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

//onboarding Pages
import { WelcomePage } from '../pages/welcome/welcome';
import { WelcomeAppexplanationPage } from '../pages/welcome-appexplanation/welcome-appexplanation';
import { OnboardingProfileCapturePage } from '../pages/onboarding-profile-capture/onboarding-profile-capture';
import { OnboardingContactCapturePage } from '../pages/onboarding-contact-capture/onboarding-contact-capture';
import { OnboardingReferencePersonContactCapturePage } from '../pages/onboarding-referenceperson-contact-capture/onboarding-referenceperson-contact-capture';
import { OnboardingSpecialistContactCapturePage } from '../pages/onboarding-specialist-contact-capture/onboarding-specialist-contact-capture';
import { OnboardingBiovotionPage } from '../pages/onboarding-biovotion/onboarding-biovotion';

import { WeightReminderNotificationPage } from '../pages/weight-reminder-notification/weight-reminder-notification';

//journal Pages
import { JournalPage } from '../pages/journal/journal';
import { JournalEntryFormPage } from '../pages/journal-entry-form/journal-entry-form';
import { JournalEntryListPage } from '../pages/journal-entry-list/journal-entry-list';

import { StateOfMindPage } from '../pages/state-of-mind/state-of-mind';

//information & documentation pages
import { InformationDocumentationPage } from '../pages/information-documentation/information-documentation';
import { InformationAnorexiaPage } from '../pages/information-anorexia/information-anorexia';
import { DocumentationFearsDelightsPage } from '../pages/documentation-fears-delights/documentation-fears-delights';

//goals management page
import { GoalsManagementPage } from '../pages/goals-management/goals-management';

//support pages
import { SupportPage } from '../pages/support/support';
import { SupportSelfHelpPropositionsPage } from '../pages/support-self-help-propositions/support-self-help-propositions';
import { SupportCopingStrategiesPage } from '../pages/support-coping-strategies/support-coping-strategies';

//more pages
import { MorePage } from '../pages/more/more';
import { MoreProfileAdaptionsPage } from '../pages/more-profile-adaptions/more-profile-adaptions';
import { MoreContactsAdaptionsPage } from '../pages/more-contacts-adaptions/more-contacts-adaptions';
import { MoreBiovotionPage } from '../pages/more-biovotion/more-biovotion';
import { MoreImpressumPage } from '../pages/more-impressum/more-impressum';
import { MorePrivacyPage } from '../pages/more-privacy/more-privacy';
import { MoreTermsPage } from '../pages/more-terms/more-terms';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TitleLogoComponent } from '../components/title-logo/title-logo';

import { Contacts } from '@ionic-native/contacts';

import { DatabaseProvider } from '../providers/database/database';
import { CallNumber } from '@ionic-native/call-number';
import { SMS } from '@ionic-native/sms';
import { EmailComposer } from '@ionic-native/email-composer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BiovotionConnector } from '@ionic-native/biovotion-connector';

//Accordion
import { AccordionListComponent } from '../components/accordion-list/accordion-list';
import { HttpModule } from '@angular/http';
import { CustomMaxlengthModule } from 'custom-maxlength';

import { MidataService } from '../services/MidataService';
import { MidataStepsService } from '../services/midata-steps.service';
import { MidataPulseService } from '../services/midata-pulse.service';
import { PulseStepsService } from '../services/pulse-steps.service';
import { NotificationService } from '../services/notification.service';
import { PhotoProvider } from '../providers/photo/photo';
import { PopoverComponent } from '../components/popover/popover';
import { FearDelightDocumentationEntryDatabaseProvider } from '../providers/database/fearDelightDocumentationEntryDB';
import { DocumentationViewsBeliefsPage } from '../pages/documentation-views-beliefs/documentation-views-beliefs';
import { ViewBeliefDocumentationEntryDatabaseProvider } from '../providers/database/viewBeliefDocumentationEntryDB';
import { DocumentationFurtherThoughtsPage } from '../pages/documentation-further-thoughts/documentation-further-thoughts';
import { FurtherThoughtDocumentationEntryDatabaseProvider } from '../providers/database/furtherThoughtDocumentationEntryDB';
import { DocumentationSetbackSuccessPage } from '../pages/documentation-setback-success/documentation-setback-success';
import { SetbackSuccessDocumentationEntryDatabaseProvider } from '../providers/database/setbackSuccessDocumentationEntryDB';
import { CopingStrategyEntryDatabaseProvider } from '../providers/database/copingStrategyEntryDB';
import { GoalEntryDatabaseProvider } from '../providers/database/goalEntryDB';
import { MoreAwardsPage } from '../pages/more-awards/more-awards';
import { AwardService } from '../services/awards.service';


@NgModule({
  declarations: [
    MyApp,

    // pages
    TabsPage,
    WelcomePage,
    WelcomeAppexplanationPage,
    OnboardingProfileCapturePage,
    OnboardingContactCapturePage,
    OnboardingReferencePersonContactCapturePage,
    OnboardingSpecialistContactCapturePage,
    OnboardingBiovotionPage,
    WeightReminderNotificationPage,
    TabsPage,

    JournalPage,
    JournalEntryFormPage,
    JournalEntryListPage,
    StateOfMindPage,

    InformationDocumentationPage,
    InformationAnorexiaPage,
    DocumentationFearsDelightsPage,
    DocumentationViewsBeliefsPage,
    DocumentationFurtherThoughtsPage,
    DocumentationSetbackSuccessPage,

    GoalsManagementPage,

    SupportPage,
    SupportSelfHelpPropositionsPage,
    SupportCopingStrategiesPage,

    MorePage,
    MoreProfileAdaptionsPage,
    MoreContactsAdaptionsPage,
    MoreBiovotionPage,
    MoreAwardsPage,
    MoreImpressumPage,
    MorePrivacyPage,
    MoreTermsPage,

    // components
    TitleLogoComponent,
    AccordionListComponent,
    PopoverComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }),
    //IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,
    CustomMaxlengthModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    WelcomePage,
    WelcomeAppexplanationPage,
    OnboardingProfileCapturePage,
    OnboardingContactCapturePage,
    OnboardingReferencePersonContactCapturePage,
    OnboardingSpecialistContactCapturePage,
    OnboardingBiovotionPage,
    WeightReminderNotificationPage,
    TabsPage,

    //component
    PopoverComponent,

    JournalPage,
    JournalEntryFormPage,
    JournalEntryListPage,
    StateOfMindPage,

    InformationDocumentationPage,
    InformationAnorexiaPage,
    DocumentationFearsDelightsPage,
    DocumentationViewsBeliefsPage,
    DocumentationFurtherThoughtsPage,
    DocumentationSetbackSuccessPage,

    GoalsManagementPage,

    SupportPage,
    SupportSelfHelpPropositionsPage,
    SupportCopingStrategiesPage,

    MorePage,
    MoreProfileAdaptionsPage,
    MoreContactsAdaptionsPage,
    MoreBiovotionPage,
    MoreAwardsPage,
    MoreImpressumPage,
    MorePrivacyPage,
    MoreTermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MidataService,
    NotificationService,
    MidataPulseService,
    MidataStepsService,
    PulseStepsService,
    AwardService,
    NativeStorage,
    SecureStorage,
    Network,
    LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InAppBrowser,
    Contacts,
    DatabaseProvider,
    FearDelightDocumentationEntryDatabaseProvider,
    ViewBeliefDocumentationEntryDatabaseProvider,
    FurtherThoughtDocumentationEntryDatabaseProvider,
    SetbackSuccessDocumentationEntryDatabaseProvider,
    CopingStrategyEntryDatabaseProvider,
    GoalEntryDatabaseProvider,
    BiovotionConnector,
    CallNumber,
    SMS,
    EmailComposer,
    Camera,
    //CameraOptions,
    //PhotoProvider
  ]
})
export class AppModule {

  constructor(private statusBar: StatusBar) {
    // let status bar overlay webview
    this.statusBar.overlaysWebView(false); //default = true

    // set color of status bar
    this.statusBar.backgroundColorByHexString('#2d6edd');
  }
}
