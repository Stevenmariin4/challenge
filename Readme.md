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

# Theory

## Procesos, hilos y corrutinas

- Un caso en el que usarías procesos para resolver un problema y por qué
  Una aplicación que envía correos electrónicos masivos a los usuarios, en esta aplicación podemos usar el proceso para enviar correos electrónicos masivos en diferentes procesos sin bloquear el hilo principal del nodo js.
  Esto con el fin de evitar la sobresaturación del hilo principal de nodejs
- Un caso en el que usarías threads para resolver un problema y por qué
  En procesamiento de imagenes o visualización de stream de una camara, ya que son procesos que consumen un alto recurso de cpu y al tener varias fuentes en 1 solo hilo su nivel de procesamiento seria elevado a demas de poder ocacionar una perdia del stream
  Se usaria un hilo por cada visualizacion del stream de una camara para poder realizar procesamiento de video y optimizacion del stream en cada uno de los hilos y con ello generar una mejor calidad de video en el stream
- Un caso en el que usarías corrutinas para resolver un problema y por qué.
  Una corrutina se puede usar para ejecutar multiples request, ejecutandose en paralelo, al final de la corrutina se recopila las respuesta. esto permite optimizar los tiempos de ejecución de la aplicación.

## Optimización de recursos del sistema operativo

- Se puede utilizar una cola de solicitudes para procesar en segundo plano, anexo a eso utilizara child_process para poder aprovechar mejor los recursos de la cpu al dividir el proceso en varios subprocesos y asi poder manejar varias solicitudes en simultaneo, usaria una base de datos no relacional como mongo db por su escalabilidad horizontal, el cual permite el manejo de volumenes de datos de manera mas eficiente.

## Análisis de complejidad

### First exercise

- Principalmente me enfocaria en el algoritmo D su complejidad O(n log n) lo que significa que su tiempo de ejecucion crece en tamaño del problema, es decir a medida que el volumen de datos aumenta el tiempo de ejecución pero a un ritmo mas lento que los otros algoritmos.
- Por otro lado descartaria el algorimo C de complejidad O(2^n) el que difiere que el tiempo de ejecución crecera exponencial con el tamaña del volumen de datos que valla a procesar, esto lo hace ineficiente para el manejo de grandes volumenes de datos
- Los algoritmos A y B son cuadraticos y cubicos, lo que refiere que sus tiempos de ejecucion seran aceptables en procesamiento de mediamos volumenes de datos pero en el incremento de los volumenes de datos sus tiempos no seran aceptables.

### Second exercise

- AlfaDB: Esta base de datos seria adecuada para procesos que requieran una gran cantidad de lectura de datos pero un baja cantidad de escritura ya que su complejidad algorimica en el proceso de escritura hace que se demore escribiendo grandes volumenes de datos, pero su complejidad algorimica en lectura es baja lo que significa que podra leer datos rapidamente.

Un ejemplo para esta base de datos es una aplicacion para el control de inventario de una tienda en el cual su nivel de lectura es mayor el nivel de escritura. ya que apesar de que constantemente este agregando elementos al inventarios, son mayor las solicitudes de lectura para indicar el stock que existe en la tienda

- BetaDB: Esta base de datos seria adecuada para casos en los cuales sea necesario un nivel alto de escritura como de lectura, ya que su complejidad algoritmica es baja,a unque puede tardar mas que AlfaDB en escribir datos sigue siendo bastante eficiente.

Un ejemplo para esta base de datos puede ser una aplicacion de chat de una red social. los mensajes de los usuarios son almacenados en la base de datos y cada ves que un usuario abre un chat este requiere que se lean todos los mensajes de esta conversación.

## Authors

- [@Jonnathan Steven Arevalo Marin](https://github.com/Stevenmariin4)

## License

[MIT](https://choosealicense.com/licenses/mit/)
