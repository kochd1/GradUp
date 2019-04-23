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

//onboarding
import { WelcomePage } from '../pages/welcome/welcome';
import { WelcomeAppexplanationPage } from '../pages/welcome-appexplanation/welcome-appexplanation';
import { OnboardingProfileCapturePage } from '../pages/onboarding-profile-capture/onboarding-profile-capture';
import { OnboardingContactCapturePage } from '../pages/onboarding-contact-capture/onboarding-contact-capture';
import { OnboardingReferencePersonContactCapturePage } from '../pages/onboarding-referenceperson-contact-capture/onboarding-referenceperson-contact-capture';
import { OnboardingSpecialistContactCapturePage } from '../pages/onboarding-specialist-contact-capture/onboarding-specialist-contact-capture';
import { WelcomeConnectPage } from '../pages/welcome-connect/welcome-connect';

import { WeightReminderNotificationPage } from '../pages/weight-reminder-notification/weight-reminder-notification';

//journal
import { JournalPage } from '../pages/journal/journal';
import { JournalEntryFormPage } from '../pages/journal-entry-form/journal-entry-form';
import { JournalEntryListPage } from '../pages/journal-entry-list/journal-entry-list';

import { StateOfMindPage } from '../pages/state-of-mind/state-of-mind';

//information & documentation
import { InformationDocumentationPage } from '../pages/information-documentation/information-documentation';
import { InformationAnorexiaPage } from '../pages/information-anorexia/information-anorexia';
import { DocumentationFearsDelightsPage } from '../pages/documentation-fears-delights/documentation-fears-delights';

//support
import { HelpPage } from '../pages/help/help';
import { HelpPointsofcontactPage } from '../pages/help-pointsofcontact/help-pointsofcontact';
import { HelpCopingPage } from '../pages/help-coping/help-coping';

//adaptions
import { AdaptionsPage } from '../pages/adaptions/adaptions';
import { ProfileCustomisationPage } from '../pages/profile-customisation/profile-customisation';
import { ProfileCustomizecontactsPage } from '../pages/profile-customizecontacts/profile-customizecontacts';
import { ProfileBiovotionPage } from '../pages/profile-biovotion/profile-biovotion';
import { ProfileImpressumPage } from '../pages/profile-impressum/profile-impressum';
import { ProfilePrivacyPage } from '../pages/profile-privacy/profile-privacy';
import { ProfileTermsPage } from '../pages/profile-terms/profile-terms';

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
    WelcomeConnectPage,
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

    HelpPage,
    HelpPointsofcontactPage,
    HelpCopingPage,

    AdaptionsPage,
    ProfileCustomisationPage,
    ProfileCustomizecontactsPage,
    ProfileBiovotionPage,
    ProfileImpressumPage,
    ProfilePrivacyPage,
    ProfileTermsPage,

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
    WelcomeConnectPage,
    WeightReminderNotificationPage,
    TabsPage,
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

    HelpPage,
    HelpPointsofcontactPage,
    HelpCopingPage,
    
    AdaptionsPage,
    ProfileCustomisationPage,
    ProfileCustomizecontactsPage,
    ProfileBiovotionPage,
    ProfileImpressumPage,
    ProfilePrivacyPage,
    ProfileTermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MidataService,
    NotificationService,
    MidataPulseService,
    MidataStepsService,
    PulseStepsService,
    NativeStorage,
    SecureStorage,
    Network,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    InAppBrowser,
    Contacts,
    DatabaseProvider,
    FearDelightDocumentationEntryDatabaseProvider,
    ViewBeliefDocumentationEntryDatabaseProvider,
    FurtherThoughtDocumentationEntryDatabaseProvider,
    SetbackSuccessDocumentationEntryDatabaseProvider,
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
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.backgroundColorByHexString('#ffffff');
  }
}
