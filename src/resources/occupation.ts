import { Observation, OBSERVATIONSTATUS, CAT_SOCIALHISTORY, registerResource } from '.../../../node_modules/Midata';

@registerResource('code', '85658-3')
export class MyResource extends Observation {

  // you can set here what you want!
  constructor(workOccupation: string) {
    //now you have to create your own coding, which has to be registered on midata
    let code = {
      coding: [
        {
          system: "http://loinc.org",
          code: "85658-3",
          display: "Occupation Type"
        }
      ]
    };

    /*let valueQuantity = {
      "valueQuantity": {
        "value": workOccupation
      }
    };*/

    //must be added as additional component
    let myComponent: fhir.ObservationComponent = {
      code: {
        coding: [{
          system: "http://loinc.org",
          code: "85658-3",
          display: "Occupation Type"
        }]
      },
      valueString: workOccupation
    };

    super({ effectiveDateTime: new Date().toISOString() },
      OBSERVATIONSTATUS.preliminary,
      CAT_SOCIALHISTORY,
      code);

    this.addComponent(myComponent);
  }

}
