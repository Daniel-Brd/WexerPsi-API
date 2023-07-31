# Wexer Psi API for Patient and Medical Reports Management

This is the README for the API for patient and medical reports management in a psychology clinic. The API was developed using Node.js and various JavaScript ecosystem libraries to provide a robust and secure system.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- JSON Web Token (JWT)
- Yup
- Multer
- bcrypt
- Jest (for testing)

## Features

The API offers the following main features:

1. User registration and authentication (psychologists and clinic professionals).
2. Patient registration and editing.
3. Creation and management of timelines for each patient.
4. Recording occurrences in each timeline (sessions and relevant facts).
5. Attaching files to occurrences (images, documents, etc.).
6. Secure storage for uploaded files.

## Data Model

The project utilizes MongoDB as the database and follows the following data model:

## Entity "User"

The "User" entity represents the users of the system.

### Attributes

| Name      | Type     | Required | Unique | Description               |
| --------- | -------- | -------- | ------ | ------------------------- |
| name      | String   | Yes      | No     | Username                  |
| email     | String   | Yes      | Yes    | User email address        |
| password  | String   | Yes      | No     | User password (encrypted) |
| file      | ObjectId | No       | No     | Profile picture id        |
| createdAt | Date     | Default  | No     | Record creation date      |
| updatedAt | Date     | Default  | No     | Record update date        |

### Example

```javascript
{
    "_id": "64b5ef00e46d467958e85036",
    "name": "John Doe",
    "email": "jhondoe@example.com",
    "password": "***********",
    "patients": [
      "64ade415e74a64a236800fb1"
    ],
		"file": "64b5ef00e46d467958e85034",
    "createdAt": "2021-05-17T18:30:00.000Z",
    "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## Entity "Patient"

The entity "Patient" represents the patients registered in the system.

### Attributes

| Name                | Type       | Required | Unique | Description                      |
| ------------------- | ---------- | -------- | ------ | -------------------------------- |
| user                | ObjectId   | Yes      | No     | Record Owner User ID             |
| timelines           | ObjectId[] | Yes      | No     | Patient timelines ID's           |
| name                | String     | Yes      | No     | Patient name                     |
| contact             | String     | Yes      | No     | Patient contact (Phone/E-mail)   |
| birthdate           | Date       | Yes      | No     | Patient's date of birth          |
| demands             | String     | No       | No     | Patient demands for treatment    |
| personalAnnotations | String     | No       | No     | Personal notes about the patient |
| createdAt           | Date       | Default  | No     | Record creation date             |
| updatedAt           | Date       | Default  | No     | Record update date               |

### Example

```javascript
{
  "_id": "64ade415e74a64a236800fb1",
  "user": "64b5ef00e46d467958e85036",
  "timelines": [
    "60a2a68c7b4f4d004e9a25d9"
  ],
  "name": "John Doe",
  "birthdate": "1980-01-01T00:00:00.000Z",
  "contact": "(21) 99999-8888",
  "demands": "Back pain",
  "personalAnnotations": "Patient with a history of back problems.",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## Entity "Timeline"

The "Timeline" entity represents the timelines related to the patients registered in the system.

### Attributes

| Name        | Type       | Required | Unique | Description               |
| ----------- | ---------- | -------- | ------ | ------------------------- |
| name        | String     | Yes      | No     | Timeline name             |
| occurrences | ObjectId[] | Yes      | No     | Timeline occurrences ID's |
| createdAt   | Date       | Default  | No     | Record creation date      |
| updatedAt   | Date       | Default  | No     | Record update date        |

### Example

```javascript
{
  "_id": "60a2a68c7b4f4d004e9a25d9",
  "occurrences": [
    "64ae18fea7f2a21ff1dd2510",
    "60a2a68c7b4f4d004e9a25da",
    "60a2a68c7b4f4d004e9a25db"
  ],
  "name": "Physiotherapy",
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```

## Entity "Occurrence"

The entity "Occurrence" represents an occurrence of a therapy session or a relevant fact about a patient. It contains information such as title, content, type and attachment files.

### Attributes

| Name      | Type       | Required | Unique | Description              |
| --------- | ---------- | -------- | ------ | ------------------------ |
| name      | String     | Yes      | No     | Occurrence name          |
| content   | String     | Yes      | No     | Occurrence description   |
| kind      | String     | Yes      | No     | Session or Relevant Fact |
| files     | ObjectId[] | Yes      | No     | files ID's               |
| createdAt | Date       | Default  | No     | Record creation date     |
| updatedAt | Date       | Default  | No     | Record update date       |

### Example

```javascript
{
  "name": "Session 1",
  "content": "Today we talked about...",
  "kind": "session",
  "files": [
    "61711d13c799a3347f3ec6f3"
  ],
  "createdAt": "2021-05-17T18:30:00.000Z",
  "updatedAt": "2021-05-17T18:30:00.000Z"
}
```
