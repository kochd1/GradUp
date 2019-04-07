import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SecureStorage } from "@ionic-native/secure-storage";
import { Network } from "@ionic-native/network";
import { NativeStorage } from '@ionic-native/native-storage';
import { IonicStorageModule } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { WelcomePage } from '../pages/welcome/welcome';
import { WelcomeAppexplanationPage } from '../pages/welcome-appexplanation/welcome-appexplanation';
import { OnboardingProfileCapturePage } from '../pages/onboarding-profile-capture/onboarding-profile-capture';
import { WelcomeContactPage } from '../pages/welcome-contact/welcome-contact';
import { WelcomeContact2Page } from '../pages/welcome-contact2/welcome-contact2';
import { WelcomeContact3Page } from '../pages/welcome-contact3/welcome-contact3';
import { WelcomeConnectPage } from '../pages/welcome-connect/welcome-connect';

import { WeightReminderNotificationPage } from '../pages/weight-reminder-notification/weight-reminder-notification';

//journal pages
import { JournalPage } from '../pages/journal/journal';
import { JournalEntryPage } from '../pages/journal-entry/journal-entry';
import { JournalDeletePage } from '../pages/journal-delete/journal-delete';

import { InformationPage } from '../pages/information/information';
import { InformationAnorexiaPage } from '../pages/information-anorexia/information-anorexia';
import { InformationPsychePage } from '../pages/information-psyche/information-psyche';

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


@NgModule({
  declarations: [
    MyApp,   

    // pages
    TabsPage,
    WelcomePage,
    WelcomeAppexplanationPage,
    OnboardingProfileCapturePage,
    WelcomeContactPage,
    WelcomeContact2Page,
    WelcomeContact3Page,
    WelcomeConnectPage,
    WeightReminderNotificationPage,
    TabsPage,

    JournalPage,
    JournalEntryPage,
    JournalDeletePage,
    InformationPage,

    InformationAnorexiaPage,
    InformationPsychePage,

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
    AccordionListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    WelcomePage,
    WelcomeAppexplanationPage,
    OnboardingProfileCapturePage,
    WelcomeContactPage,
    WelcomeContact2Page,
    WelcomeContact3Page,
    WelcomeConnectPage,
    WeightReminderNotificationPage,
    TabsPage,

    JournalPage,
    JournalEntryPage,
    JournalDeletePage,

    InformationPage,
    InformationAnorexiaPage,
    InformationPsychePage,

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
    Contacts,
    DatabaseProvider,
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
