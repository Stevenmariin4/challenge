# Challenge

this project is to allow the uploading of files in CSV, JSON lines, or TXT format, analyze their content, and return the information in JSON format.

## Installation

Clone this project get in folder Challenge

To use this project, you must have Docker installed and run the following command:

```bash
 docker-compose up
```

## Usage/Examples

Exist two endpoints available currently

```
- http://localhost:5000/files?processsync=true
- http://localhost:5000/files?processsync=false
- http://localhost:5000/proccess/idprocess
```

## Processsync

- First EndPoint

  if this params is true, the process is execution in background return a number of process for be use in other endpoint, if this params is false, the process is execute in realtime the end the process return all data save in database

- Second EndPoint
  this endpoint return, the status and data saved in database of the process, this method is util when you send request with params Procession in true y you want see status the process

## Authors

- [@Jonnathan Steven Arevalo Marin](https://github.com/Stevenmariin4)

## License

[MIT](https://choosealicense.com/licenses/mit/)
