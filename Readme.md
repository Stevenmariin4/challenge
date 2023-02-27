# Challenge

This project is to allow the uploading of files in CSV, JSON lines, or TXT format, analyze their content, and return the information in JSON format.

## Dependency

You should have mongodb community server or docker of mongo

- [Mongo Download Windows](https://www.mongodb.com/try/download/community)
- [Mongo Docker](https://hub.docker.com/_/mongo)

### Environment Variables

In file .env you should change the params dependency of your environment, unique dependency of project is DB_HOST
`DB_HOST` = your Ipaddress

## Installation With Docker

Clone this project get in folder Challenge

To use this project, you must have Docker installed and run the following command:

```bash
 docker-compose up
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/Stevenmariin4/challengeProject
```

Go to the project directory

```bash
  cd Challenge
```

```bash
  cd Service
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

### Postman Docs

All documentation of api
[Postman Docs](https://documenter.getpostman.com/view/3693350/SVn3raYf "Postman Docs")

## Send Data

You should load the file as follows.

- In body is the format form-data
- key is file
- the next field you should upload your file

## Screenshots

Data to send to service

![App Screenshot](https://firebasestorage.googleapis.com/v0/b/jsmsoftware-70b6b.appspot.com/o/Captura%20de%20pantalla%202023-02-26%20181547.png?alt=media&token=582aed52-481d-4012-9cf7-c94b2dcc71e8)

Response

![App Screenshot](https://firebasestorage.googleapis.com/v0/b/jsmsoftware-70b6b.appspot.com/o/Captura%20de%20pantalla%202023-02-26%20181753.png?alt=media&token=dd108ca4-8f71-48da-8db3-ea8fe49441b5)

- Message: Status operation
- Data: Object with all data of process
- \_id: Id process
- status: exist three status: init, inProcess, end
- totalItems: all items in file
- itemsSuccessfull: array with data process successful, and all data of items analysis
- itemsError: array with data process error, and cause of error

## Authors

- [@Jonnathan Steven Arevalo Marin](https://github.com/Stevenmariin4)

## License

[MIT](https://choosealicense.com/licenses/mit/)
