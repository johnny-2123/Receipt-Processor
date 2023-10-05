# Receipt-Processor

An API that processes receipt data and calculates points based on specific rules for the given receipts.

## Built With
List of languages and tools used to develop the project

[![My Skills](https://skillicons.dev/icons?i=js,nodejs,sequelize,sqlite,docker)](https://skillicons.dev)
- JavaScript
- Node
- Sequelize
- SQLite3
- Docker

## Rebuild the Project with Docker
### Prerequisites 
* Docker -
  [Install Docker](https://docs.docker.com/get-docker/)
* Git -
  [Install Git](https://git-scm.com/downloads)
### Installation
1. Open terminal and clone the repository
  ```sh
  git clone https://github.com/johnny-2123/Receipt-Processor.git
  ```
2. cd into the root directory
  ```sh
  cd Receipt-Processor
  ```
3. Ensure that docker desktop is open and running before attempting to build the image
4. Run docker build in the project's root directory to build the docker image
  ```sh
  docker build -t avilajohnny/receipt-processor:1.0 .
  ```
5. Run a docker container from the built image and map port 3000 on your local machine to port 3000 in the container
  ```
  docker run -p 3000:3000 avilajohnny/receipt-processor:1.0
  ```
6. The server should now be running and listening for requests at port 3000

## Endpoints
### Endpoint: Process Receipts
#### POST /receipts/process

* Live Path: `https://johnny-avila-receipt-processor.fly.dev/receipts/process`
* Local Path: `http://localhost:3000/receipts/process`
* Method: `POST`
* Payload: Receipt JSON
* Response: JSON containing an id for the receipt.

**Description:**

Takes in a JSON receipt and returns a JSON object with an ID generated by your code.

The ID returned is the ID that should be passed into `/receipts/{id}/points` to get the number of points the receipt
was awarded.

**Example Request:** 

```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },{
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },{
      "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}
```

**Example Response:**
```json
{ "id": "7fb1377b-b223-49d9-a31a-5a02701dd310" }
```

### Endpoint: Get Points
#### GET /receipts/{id}/points
* Live Path: `https://johnny-avila-receipt-processor.fly.dev/receipts/{id}/points`
* Local Path: `http://localhost:3000/receipts/{id}/points`
* Path: `/receipts/{id}/points`
* Method: `GET`
* Response: A JSON object containing the number of points awarded.

A simple Getter endpoint that looks up the receipt by the ID and returns an object specifying the points awarded.

**Example Response:**
```json
{ "points": 32 }
```
How many points should be earned are defined by the rules below.
* One point for every alphanumeric character in the retailer name.
* 50 points if the total is a round dollar amount with no cents.
* 25 points if the total is a multiple of `0.25`.
* 5 points for every two items on the receipt.
* If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. The result is the number of points earned.
* 6 points if the day in the purchase date is odd.
* 10 points if the time of purchase is after 2:00pm and before 4:00pm.


## Database Schema
![image](https://github.com/johnny-2123/Receipt-Processor/assets/95261336/bef2edf0-2413-4ab0-affd-d94309b688fe)

### Relationships
**One-to-many relationship between receipts and items**
- Each receipt can have many associated items, esablished through the "receiptId" foreign key in the items table


---
