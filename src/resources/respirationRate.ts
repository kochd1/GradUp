import { Observation, OBSERVATIONSTATUS, CAT_SURVEY, registerResource, CAT_VITALSIGNS } from '.../../../node_modules/Midata';
//import { ObservationEffective, ObservationStatus, Resource, registerResource} from '.../../../node_modules/Midata';

@registerResource('code', '9279-1')
export class RespirationRateObs extends Observation {

  // Implement a constructor
  // Check the hl7 fhir documentation of the resource
  // to find out the required fields of the resource.
  // It's recommended that you define these already in the constructor
  // so there will be no way to save a resource without the required stuff

  constructor(respirationRate: number) {

    /*effectiveType: ObservationEffective,
    status: ObservationStatus,
    category: fhir.CodeableConcept
    code: fhir.CodeableConcept*/

    let code = {
      coding: [
        {
          "system": "http://loinc.org",
          "code": "9279-1",
          "display": "Respiratory rate"
        }
      ]
    };

    let valueQuantity = {
      "valueQuantity": {
        "value": respirationRate
      }
    };



    // call the super constructor for the definition of the resource type (as string)
    super({ effectiveDateTime: new Date().toISOString() },
      OBSERVATIONSTATUS.preliminary,
      CAT_VITALSIGNS,
      code, valueQuantity);

  }

}
