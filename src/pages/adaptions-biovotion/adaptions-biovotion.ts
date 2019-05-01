import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AdaptionsPage } from '../adaptions/adaptions';
import { TabsPage } from '../tabs/tabs';
import { BiovotionConnector, BiovotionSensor, BatteryInformation, SensorDataType, SensorDataEntry, SENSORDATATYPE } from '@ionic-native/biovotion-connector';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';

//#MIDATA imports
import { MidataService } from '../../services/MidataService';
import { HeartRate, StepsCount, Observation } from 'Midata';
import * as Globals from '../../../typings/globals';

//resources import
import { RespirationRateObs } from '../../resources/respirationRate';
import { GalvanicSkinResponseObs } from '../../resources/galvanicSkinResponse';
import { HeartRateVariabilityObs } from '../../resources/heartRateVariability';
import { InterBeatIntervalObs } from '../../resources/interBeatInterval';
import { EnergyExpenditureObs } from '../../resources/energyExpenditure';

//TODO kochd1: daten mittels der .buffer() filtern und allenfalls zusätzlich filter bei der midata load() anpassen.


/**
 * Generated class for the WelcomeConnectPage page.
 * @author kochd1
 */
@IonicPage()
@Component({
  selector: 'page-adaptions-biovotion',
  templateUrl: 'adaptions-biovotion.html',
})
export class AdaptionsBiovotionPage {

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
      console.log('ionViewWillEnter -> isToggled?:', value);
    });

    this.storage.get(this.key_sensor).then((value) => {
      this.isConnectedToSensor = value;
      console.log('ionViewWillEnter -> isConnectedToSensor?:', value);
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

    }
  }

  /**
   * Popup to ask user for permission to connect the sensor.
   */
  askUserPermission() {
    console.log("askUserPermission() called");

    let alert = this.alertCtrl.create({
      title: 'Verbindung mit Sensor',
      subTitle: 'GradUp möchte eine Bluetooth-Verbindung zu Ihrem Biovotion Everion Sensor herstellen.',
      buttons: [
        {
          text: 'Erlauben',
          handler: () => {
            console.log("askUserPermission() -> permission ok");
            this.isPermitted = true;
            this.connectSensor();
            /*if(!this.isConnectedToSensor)
            {
              this.isToggled = false; //in trial
            }*/
          }
        },
        {
          text: 'Abbrechen',
          handler: () => {
            this.isToggled = false;
            this.gotoAdaptionsPage();
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

    //if(this.isPermitted){

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
          //dataToRequest.push(SENSORDATATYPE //skinTemperature
          dataToRequest.push(SENSORDATATYPE.cTemp);
          dataToRequest.push(SENSORDATATYPE.localTemp);
          dataToRequest.push(SENSORDATATYPE.objectTemp);
          dataToRequest.push(SENSORDATATYPE.gsrElectrode);
          dataToRequest.push(SENSORDATATYPE.heartRateVariability);
          //dataToRequest.push(SENSORDATATYPE) //Inter-Beat-Interval
          dataToRequest.push(SENSORDATATYPE.energy);

          this.biovotion.readLiveData(dataToRequest)
            .subscribe((liveData: SensorDataEntry) => {

              //heart rate
              console.log("heart rate (bpm):", liveData.heartRate.value);
              var heartRate = Number(liveData.heartRate.value); //Midata -> only for first test

              //heart rate variability
              console.log("heart rate variability (ms): ", liveData.heartRateVariability.value);
              console.log("heart rate variability quality: ", liveData.heartRateVariability.quality);
              console.log("heart rate variability object: ", liveData.heartRateVariability);
              var heartRateVariability = Number(liveData.heartRateVariability.value);

              //inter-beat-interval

              //steps
              console.log("steps/s: ", liveData.steps.value);
              var amountOfSteps = Number(liveData.steps.value); //Midata -> only for first test

              //respiration rate
              console.log("respiration rate:", liveData.respirationRate);
              console.log("respiration rate (tag):", liveData.respirationRate.tag);
              console.log("respiration rate (value):", liveData.respirationRate.value);
              console.log("respiration rate (quality)", liveData.respirationRate.quality);
              var respirationRate = Number(liveData.respirationRate.value);

              //skin temperature
              console.log("cTemp: ", liveData.cTemp); //?
              console.log("localTemp: ", liveData.localTemp); //?
              console.log("objectTemp: ", liveData.objectTemp); //?

              //galvanic skin response (also electrodermal activity)
              console.log("galvanic skin response: ", liveData.gsrElectrode.value);
              var galvanicSkinResponse = Number(liveData.gsrElectrode.value);

              //energy expenditure
              console.log("energy expenditure: ", liveData.energy);
              console.log("energy expenditure (tag): ", liveData.energy.tag);
              console.log("energy expenditure (kCal): ", liveData.energy.value);
              console.log("energy expenditure (quality): ", liveData.energy.quality);
              var energyExpenditure = Number(liveData.energy.value);

              this.saveHeartRateValueToMidata(heartRate); //works, do not save at the moment
              //this.saveStepAmountToMidata(amountOfSteps); //works do not save at the moment
              //this.saveRespirationRateToMIDATA(respirationRate); //works, do not save at the moment
              //this.saveSkinTemperatureToMIDATA(); //it is not clear, which variable it is!
              //this.saveGalvanicSkinResponseToMIDATA(galvanicSkinResponse); //do not save at the moment
              //this.saveHeartRateVariabilityValuesToMidata(heartRateVariability); //do not save at the moment
              //this.saveInterBeatIntervalValuesToMidata(); //TODO: code must be registered on MIDATA by BFH dev team!
              //this.saveEnergyExpenditureToMIDATA(energyExpenditure); //works, do not save at the moment

            });



          this.navCtrl.push(TabsPage, {});
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


    //this.navCtrl.push(TabsPage, {});
    //}
    //console.log("no permission to connect!");
    //this.isToggled = false; //in trial
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
      this.presentToast();

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

    else if (!this.isConnectedToSensor) { //disconnectSensor()
      console.log("isConnectedToSensor:?", this.isConnectedToSensor);
      toastMessage = "Sensor erfolgreich getrennt";
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
  saveHeartRateValueToMidata(heartRate: number) {
    let MessageDate = new Date();

    //#MIDATA persistence
    this.midataService.save(new HeartRate(heartRate, MessageDate.toISOString()));

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
    this.saveInterBeatIntervalToMIDATA(Number(interBeatInterval.toFixed(4))); //must be overthinked for the potential clinical trial
  }

  /**
   * Saves the calculated inter-beat-interval values to MIDATA.
   *
   * @param interBeatInterval
   */
  saveInterBeatIntervalToMIDATA(interBeatInterval: number) {

    console.log("saveInterBeatIntervalToMIDATA() -> interBeatInterval [ms] to fixed(4): ", interBeatInterval);
    this.midataService.save(new InterBeatIntervalObs(interBeatInterval));

  }

  /**
   * Saves the heart rate variability rate values to MIDATA.
   *
   * @param heartRateVariability
   */
  saveHeartRateVariabilityValuesToMidata(heartRateVariability: number) {

    //#MIDATA persistence
    this.midataService.save(new HeartRateVariabilityObs(heartRateVariability));
  }

  /**
   * Saves the inter-beat-interval values to MIDATA.
   *
   * @param interBeatInterval
   */
  saveInterBeatIntervalValuesToMidata(interBeatInterval: number) {

    //#MIDATA persistence
    this.midataService.save(new InterBeatIntervalObs(interBeatInterval));
  }

  /**
   * save a new amount of steps to MIDATA.
   *
   * @param amountOfSteps
   */
  saveStepAmountToMidata(amountOfSteps: number) {
    let MessageDate = new Date();

    //#MIDATA persistence
    this.midataService.save(new StepsCount(amountOfSteps, MessageDate.toISOString()));
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
      console.error("Error in save request:", error);
    });

    console.log("respiration rate: " + respirationRate);
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
      console.error("Error in save request:", error);
    });

    console.log("respiration rate: " + galvanicSkinResponse);
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
      console.error("Error in save request:", error);
    });

    console.log("respiration rate: " + energyExpenditure);
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
    this.navCtrl.push(TabsPage, {});
  }

  public gotoAdaptionsPage() {
    //this.navCtrl.push(AdaptionsPage, {});
    this.navCtrl.popToRoot();
  }

}
