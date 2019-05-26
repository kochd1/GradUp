import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { BiovotionConnector, BiovotionSensor, BatteryInformation, SensorDataType, SensorDataEntry, SENSORDATATYPE } from '@ionic-native/biovotion-connector';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';

//#MIDATA imports
import { MidataService } from '../../services/MidataService';
import { HeartRate, StepsCount, Observation } from 'Midata';
import * as Globals from '../../../typings/globals';

//components
import { PopoverComponent } from '../../components/popover/popover';

//resources import
import { RespirationRateObs } from '../../resources/respirationRate';
import { GalvanicSkinResponseObs } from '../../resources/galvanicSkinResponse';
import { HeartRateVariabilityObs } from '../../resources/heartRateVariability';
import { InterBeatIntervalObs } from '../../resources/interBeatInterval';
import { EnergyExpenditureObs } from '../../resources/energyExpenditure';
import { SkinTemperatureObs } from '../../resources/skinTemperature';

//TODO kochd1: daten mittels der .buffer() filtern und allenfalls zusätzlich filter bei der midata load() anpassen.


/**
 * Generated class for the WelcomeConnectPage page.
 * @author kochd1
 */
@IonicPage()
@Component({
  selector: 'page-onboarding-biovotion',
  templateUrl: 'onboarding-biovotion.html',
})
export class OnboardingBiovotionPage {

  /**
   * name of this sensor
   */
  sensor1: BiovotionSensor;

  /**
   * Indicates, if the Biovotion Everion Sensor is connected to GradUp.
   * Default -> false
   */
  isConnectedToSensor: boolean = false;

  /**
  * key for local storage of isConnectedToSensor value
  */
  key_sensor: string = "isConnectedToSensor";

  /**
   * toggle value -> true if toggled, false if not
   */
  isToggled: boolean = false;

  /**
   * key for local storage of isToggled value
   */
  key_toggle: string = "isToggled";

  isPermitted: boolean = false;

  /**
   * not in use at the moment
   * Stores the current heart rate.
   */
  currentHeartRate: number;

  /**
   * not in use at the moment
   * amount of steps during 10 seconds
   */
  amountOfSteps: number;

  /**
   * #MIDATA -> array for the heart rate, value: number }>;
     store the raw data in this array.
   */
  heartRateData: Array<{ date: Date, value: number }>;

  /**
  * #MIDATA -> array for the steps, value: number }>;
    store the raw data in this array.
  */
  stepData: Array<{ date: Date, value: number }>;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private biovotion: BiovotionConnector,
    private storage: Storage,
    private midataService: MidataService,
    private alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    private toastCtrl: ToastController) {

    // set toggle to isConnectedToSensor
    //this.biovotion.isConnected().then((connectionState: boolean) => {

    //}) ;

    this.currentHeartRate = -1;
    this.amountOfSteps = -1;

    //#MIDATA
    //this.dailyData = this.navParams.get('data');
    this.heartRateData = new Array<{ date: Date, value: number }>();
    this.stepData = new Array<{ date: Date, value: number }>();
  }

  ionViewWillEnter() {
    this.storage.get(this.key_toggle).then((value) => {
      this.isToggled = value;
      console.log('ionViewWillEnter() -> isToggled?:', value);
    });

    this.storage.get(this.key_sensor).then((value) => {
      this.isConnectedToSensor = value;
      console.log('ionViewWillEnter() -> isConnectedToSensor?:', value);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomeConnectPage');

    //#MIDATA -> load the elements
    this.loadData();
  }

  /**
   * Handles the sensor connection
   * calls connectSensor(), if isConnectedToSensor == false
   * otherwise calls disconnectSensor()
   */
  handleSensorConnection() {

    //this.storage.set(this.key_toggle, this.isToggled);
    this.storage.get(this.key_toggle).then((value) => {
      console.log('handleSensorConnection() -> storage -> isToggled?:', value);
    });

    console.log("handleSensorConnection() -> sensor connected?:", this.isConnectedToSensor);

    if (this.isConnectedToSensor) {
      console.log("about to disconnect from sensor...");
      this.disconnectSensor();

    } else {
      console.log("about to connect to sensor...");
      this.askUserPermission();
      //this.connectSensor(); //false -> connect
    }
  }

  /**
 * Popup to ask user for permission to connect the sensor.
 */
  askUserPermission() {
    let alert = this.alertCtrl.create({
      title: 'Verbindung mit Sensor',
      subTitle: 'GradUp möchte eine Bluetooth-Verbindung zu deinem Biovotion Everion Sensor herstellen.',
      buttons: [
        {
          text: 'Abbrechen',
          handler: () => {

            this.isToggled = false;
            let subAlert = this.alertCtrl.create({
              title: 'Verbindung mit Sensor',
              subTitle: 'Du bist nicht einverstanden damit, deinen Biovotion Everion Sensor mit GradUp zu verbinden. <br>'
                + 'Falls du dies zu einem späteren Zeitpunkt trotzdem möchtest, kannst du es unter dem Tab «Mehr» nachholen.',
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    this.gotoTabsPage();
                  }
                }
              ]
            });
            subAlert.present();
          }
        },
        {
          text: 'Erlauben',
          handler: () => {
            console.log("askUserPermission() -> permission ok");
            this.isPermitted = true;
            this.connectSensor();

          }

        }
      ]
    });

    alert.present();

  }

  /**
   * Connects to sensor after toggle change and then navigates to tabsPage.
   */
  connectSensor() {
    console.log("connectSensor() called");

    this.biovotion.scan().subscribe((sensor: BiovotionSensor) => {
      this.sensor1 = sensor;
      // for now we only want to connect with this specific sensor
      if (this.sensor1.address == "FE:10:32:95:6C:08") {
        this.biovotion.connect(this.sensor1).then(() => {

          this.isConnectedToSensor = true;

          this.storage.set(this.key_sensor, this.isConnectedToSensor);
          this.storage.get(this.key_sensor).then((value) => {
            console.log('storage -> isConnectedToSensor?:', value);
          });

          this.storage.set(this.key_toggle, this.isToggled); //in trial

          console.log("connectSensor() -> sensor connected?: ", this.isConnectedToSensor);
          console.log("battery state:", this.biovotion.getBatteryState);
          this.presentToast();
          //this.isToggled = true;

          let dataToRequest: SENSORDATATYPE[] = [];
          dataToRequest.push(SENSORDATATYPE.heartRate);
          dataToRequest.push(SENSORDATATYPE.steps);
          dataToRequest.push(SENSORDATATYPE.respirationRate);
          //dataToRequest.push(SENSORDATATYPE.cTemp);
          //dataToRequest.push(SENSORDATATYPE.localTemp);
          dataToRequest.push(SENSORDATATYPE.objectTemp); //skin temperature
          dataToRequest.push(SENSORDATATYPE.gsrElectrode);
          dataToRequest.push(SENSORDATATYPE.heartRateVariability);
          //dataToRequest.push(SENSORDATATYPE) //Inter-Beat-Interval
          dataToRequest.push(SENSORDATATYPE.energy);

          this.biovotion.readLiveData(dataToRequest)
            .subscribe((liveData: SensorDataEntry) => {

              //heart rate
              console.log("heart rate (bpm):", liveData.heartRate.value);
              var heartRate = Number(liveData.heartRate.value);

              //heart rate variability
              console.log("heart rate variability (ms): ", liveData.heartRateVariability.value);
              console.log("heart rate variability quality: ", liveData.heartRateVariability.quality);
              console.log("heart rate variability object: ", liveData.heartRateVariability);
              var heartRateVariability = Number(liveData.heartRateVariability.value);

              //steps
              console.log("steps/s: ", liveData.steps.value);
              var amountOfSteps = Number(liveData.steps.value);

              //respiration rate
              console.log("respiration rate:", liveData.respirationRate);
              console.log("respiration rate (tag):", liveData.respirationRate.tag);
              console.log("respiration rate (value):", liveData.respirationRate.value);
              console.log("respiration rate (quality)", liveData.respirationRate.quality);
              var respirationRate = Number(liveData.respirationRate.value);

              //skin temperature
              console.log("objectTemp (skin temperature): ", liveData.objectTemp);
              var skinTemperature = Number(liveData.objectTemp.value);

              //galvanic skin response (also electrodermal activity)
              console.log("galvanic skin response: ", liveData.gsrElectrode.value);
              var galvanicSkinResponse = Number(liveData.gsrElectrode.value);

              //energy expenditure
              console.log("energy expenditure: ", liveData.energy);
              console.log("energy expenditure (tag): ", liveData.energy.tag);
              console.log("energy expenditure (kCal): ", liveData.energy.value);
              console.log("energy expenditure (quality): ", liveData.energy.quality);
              var energyExpenditure = Number(liveData.energy.value);

              this.saveHeartRateValueToMIDATA(heartRate);
              this.saveStepAmountToMIDATA(amountOfSteps);
              this.saveRespirationRateToMIDATA(respirationRate);
              this.saveSkinTemperatureToMIDATA(skinTemperature);
              this.saveGalvanicSkinResponseToMIDATA(galvanicSkinResponse);
              this.saveHeartRateVariabilityValuesToMIDATA(heartRateVariability);
              this.saveEnergyExpenditureToMIDATA(energyExpenditure);


            });


          this.storage.set('DidOnboarding', true);
          //this.navCtrl.push(TabsPage, {}); -> Goal presentation error
        }).catch(error => {
          console.log("Connection Error: " + error);
          this.isToggled = false;  //in trial
        });

        //this.measureData();

      }


    }, (error) => {
      console.log(error);
      this.isToggled = false; // in trial
      console.log("scanError: connectSensor() -> is Toggled:?", this.isToggled);
      this.presentToast();

    });

    this.gotoTabsPage(); //dirty load (workaround) -> load TabsPage before the sensor is connected
  }

  measureData() {
    console.log("about to measure data...")


  }

  /**
   * Disconnects the Sensor after toggle change.
   */
  disconnectSensor() {

    this.biovotion.disconnect().then(() => {
      this.isConnectedToSensor = false;

      this.storage.set(this.key_sensor, this.isConnectedToSensor);
      this.storage.get(this.key_sensor).then((value) => {
        console.log('storage -> isConnectedToSensor?:', value);
      });

      this.storage.set(this.key_toggle, this.isToggled); //in trial

      console.log('disconnectSensor() -> sensor connected:?', this.isConnectedToSensor);
      console.log('disconnectSensor() -> isToggled:?', this.isToggled);
    }).catch(error => {
      console.log("Error: " + error);
    });

  }

  /**
 * Present a Toast based on the sensor connection.
 */
  public presentToast() {
    let toastMessage: string = "";
    let toastDuration: number;

    if (this.isConnectedToSensor) { //connectSensor()
      console.log("isConnectedToSensor:?", this.isConnectedToSensor);
      toastMessage = "Sensor erfolgreich verbunden";
      toastDuration = 3000;
    }

    else {
      console.log("else");
      toastMessage = "Sensor konnte nicht verbunden werden. Prüfen Sie u. a., ob bei Ihrem Gerät Bluetooth und/oder GPS aktiviert ist sowie ob der Sensor eingeschaltet ist.";
      toastDuration = 5000;
    }

    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: toastDuration,
      position: 'bottom',
      cssClass: 'toast' //not working at the moment
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    })

    toast.present();
  }

  /**
   * save a new heart rate value to MIDATA.
   *
   * @param heartRate
   */
  saveHeartRateValueToMIDATA(heartRate: number) {
    let MessageDate = new Date();

    //#MIDATA persistence
    this.midataService.save(new HeartRate(heartRate, MessageDate.toISOString())).then((response) => {
      // we can now access the midata response
      console.log("HeartRateObs fired on MIDATA");


    }).catch((error) => {
      console.error("Heart rate -> error in save request:", error);
    });

    this.calculateIBI(heartRate);
  }

  /**
   * Caluclates the inter-beat-interval based on the measured heart beat (plugin does not support the direct reading from the sensor)
   *
   * @param heartRate
   */
  calculateIBI(heartRate: number) {

    let interBeatInterval = (60 / heartRate) * 1000; //*1000 -> ms
    console.log("calculateIBI() -> interBeatInterval [ms]", interBeatInterval);
    this.saveInterBeatIntervalValuesToMIDATA(Number(interBeatInterval.toFixed(4))); //must be reconsidered for the potential clinical trial
  }


  /**
   * Saves the heart rate variability rate values to MIDATA.
   *
   * @param heartRateVariability
   */
  saveHeartRateVariabilityValuesToMIDATA(heartRateVariability: number) {

    //#MIDATA persistence
    this.midataService.save(new HeartRateVariabilityObs(heartRateVariability)).then((response) => {
      // we can now access the midata response
      console.log("HeartRateVariabilityObs fired on MIDATA");


    }).catch((error) => {
      console.error("HRV -> error in save request:", error);
    });
  }

  /**
   * Saves the inter-beat-interval values to MIDATA.
   *
   * @param interBeatInterval
   */
  saveInterBeatIntervalValuesToMIDATA(interBeatInterval: number) {

    //#MIDATA persistence
    this.midataService.save(new InterBeatIntervalObs(interBeatInterval)).then((response) => {
      // we can now access the midata response
      console.log("interbeat interval fired on MIDATA");


    }).catch((error) => {
      console.error("IBI -> error in save request:", error);
    });
  }

  /**
   * save a new amount of steps to MIDATA.
   *
   * @param amountOfSteps
   */
  saveStepAmountToMIDATA(amountOfSteps: number) {
    let MessageDate = new Date();

    //#MIDATA persistence
    this.midataService.save(new StepsCount(amountOfSteps, MessageDate.toISOString())).then((response) => {

      console.log("Amount of steps fired on MIDATA");


    }).catch((error) => {
      console.error("Amount of steps -> Error in save request:", error);
    });
  }

  /**
   * save the respiraton rates to MIDATA.
   *
   * @param respirationRate
   */
  saveRespirationRateToMIDATA(respirationRate: number) {

    //let MessageDate = new Date();

    //#MIDATA persistence
    this.midataService.save(new RespirationRateObs(respirationRate)).then((response) => {
      // we can now access the midata response
      console.log("RespirationRateObs fired on MIDATA");


    }).catch((error) => {
      console.error("respiration rate -> Error in save request:", error);
    });

    console.log("respiration rate: " + respirationRate);
  }

  /**
   * saves the skin temperature values to MIDATA.
   *
   * @param skinTemperature
   */
  saveSkinTemperatureToMIDATA(skinTemperature: number) {

    //let MessageDate = new Date();

    //#MIDATA persistence
    this.midataService.save(new SkinTemperatureObs(skinTemperature)).then((response) => {
      // we can now access the midata response
      console.log("SkinTemperatureObs fired on MIDATA");


    }).catch((error) => {
      console.error("skin temperature -> error in save request:", error);
    });

    console.log("skin temperature: " + skinTemperature);
  }

  /**
   * Saves the galvanicSkinResponses to MIDATA.
   *
   * @param galvanicSkinResponse
   */
  saveGalvanicSkinResponseToMIDATA(galvanicSkinResponse: number) {

    //#MIDATA persistence
    this.midataService.save(new GalvanicSkinResponseObs(galvanicSkinResponse)).then((response) => {
      // we can now access the midata response
      console.log("GalvanicSkinResponseObs fired on MIDATA");


    }).catch((error) => {
      console.error("GSR -> rrror in save request:", error);
    });

    console.log("galvanic skin response: " + galvanicSkinResponse);
  }

  /**
   * Saves the energy expenditure values to MIDATA.
   *
   * @param energyExpenditure
   */
  saveEnergyExpenditureToMIDATA(energyExpenditure: number) {

    //#MIDATA persistence
    this.midataService.save(new EnergyExpenditureObs(energyExpenditure)).then((response) => {
      // we can now access the midata response
      console.log("EnergyExpenditureObs fired on MIDATA");


    }).catch((error) => {
      console.error("Energy expenditure -> error in save request:", error);
    });

    console.log("energy expenditure: " + energyExpenditure);
  }

  /**
   * #MIDATA: adds all heart rate measures to the array "heartRateData".
   *
   * @param measure
   * @param date
   */
  addHeartRateMeasure(measure: number, date: Date): void {
    /*if (moment().diff(date) >= 0){

    }*/

    //push the data to the array
    this.heartRateData.push({ date: date, value: measure });

  }

  /**
   * #MIDATA: adds all step measures to the array "stepData".
   *
   * @param measure
   * @param date
   */
  addStepMeasure(measure: number, date: Date): void {
    /*if (moment().diff(date) >= 0){

    }*/

    //push the data to the array
    this.stepData.push({ date: date, value: measure });

  }


  /**
   * #MIDATA: loads the data (FHIR Observations with code "heart rate" & "steps") from the MIDATA server
   */
  private loadData(): void {
    this.midataService.search('Observation/$lastn', { max: 1000, _sort: '-date', code: Globals.HEARTRATE.toString, patient: this.midataService.getUser().id })
      .then(response => {
        if (response.length > 0) {


          response.forEach((measure: Observation) => {
            //console.log(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
            this.addHeartRateMeasure(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
          });

          console.log(this.heartRateData);
          /* TODO:  to test */
          /* TODO: catch error */
        }
      }
      );

    this.midataService.search('Observation/$lastn', { max: 1000, _sort: '-date', code: Globals.STEPS.toString, patient: this.midataService.getUser().id })
      .then(response => {
        if (response.length > 0) {


          response.forEach((measure: Observation) => {
            //console.log(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
            this.addStepMeasure(measure.getProperty('valueQuantity')['value'], measure.getProperty('effectiveDateTime'));
          });

          console.log(this.stepData);
          /* TODO:  to test */
          /* TODO: catch error */
        }
      }
      );
  }

  public gotoTabsPage() {
    this.storage.set('DidOnboarding', true);
    this.navCtrl.push(TabsPage, {});
  }

}
