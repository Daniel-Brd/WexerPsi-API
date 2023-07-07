export class CreatePatientDto {
  name: String;
  birthdate: Date;
  contact: String;
  demands?: String;
  personalAnnotations?: String;
}
