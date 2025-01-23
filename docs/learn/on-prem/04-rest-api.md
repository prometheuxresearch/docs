# REST API

The Prometheux Engine offers a simple RESTful API, which allows you to carry out
its main operations.

Below is a list of the provided endpoints:

### `/evaluate`

It evaluates a Vadalog program and returns the results as a JSON blob.

- **URL**: `/evaluate`
- **Method**: `POST`
- **Data Params**: the first query param contains the entire program and the
  second contains other programs it depends on as a module:
  `program=[Vadalog-Program], otherPrograms=[[Vadalog-Programs]]`
- **Response**: `{ "id" : [integer], "resultSet" : { "atom_name" : [list of
result values] }, "types" : { "atom_name" : { list of result types } },
"columnNames" : { "atom_name : { list of result column names } } }`

* **Status Codes:**
  - `200 OK`: Successful evaluation of the Vadalog program.
  - `400 BAD_REQUEST`: Indicates a malformed Vadalog program in the request
    body. The response includes an error message detailing the issue.
  - `500 INTERNAL_SERVER_ERROR`: Occurs when the evaluation encounters runtime
    or other exceptions. The response contains an error message specifying the
    encountered exception.

- **Sample Call**:
  ```bash
  curl -X POST 'http://localhost:8080/evaluate' --data 'program=a(1,3).b(X,Y):-a(X,Y).@output("b").'
  ```
  gives the following response:
  ```json
  {
    "id": 1,
    "resultSet": { "b": [[1, 3]] },
    "types": { "b": ["INT", "INT"] },
    "columnNames": { "b": ["X", "Y"] }
  }
  ```
- **Sample Call with modules**:
  ```bash
  curl 'http://localhost:8080/evaluate?program=@module(%22m1%22).@include(%22m2%22).a(1).&otherPrograms=@module(%22m2%22).b(X):-a(X).@output(%22b%22).&modules=@module(%22m3%22).b(X):-a(X).@output(%22b%22).'
  ```
  gives the following response:
  ```json
  {
    "id": 1,
    "resultSet": { "b": [[1]] },
    "types": { "b": ["INT"] },
    "columnNames": { "b": ["X"] }
  }
  ```

### `/evaluateFromRepoWithParams`

It evaluates a Vadalog program, using the values for X and Y specified as
parameters, and returns the results as a JSON blob (this endpoint is used for
the 'close links' example).

- **URL**: `/evaluateFromRepoWithParams`
- **Method**: `POST`
- **Data Params**: the first query param contains the path to the program from
  the `repository` folder and the second is a string that represents the params
  X and Y: `programName=[Path-to-Vadalog-Program], params=[string ("X=value,
Y=value")]`
- **Response**: `{ "id" : [integer], "resultSet" : { "atom_name" : [list of
result values] }, "types" : { "atom_name" : [list of result types] },
"columnNames" : { "atom_name : [list of result column names] } }`

* **Status Codes:**
  - `200 OK`: Successful evaluation of the Vadalog program.
  - `400 BAD_REQUEST`: Indicates a malformed Vadalog program in the request
    body. The response includes an error message detailing the issue.
  - `500 INTERNAL_SERVER_ERROR`: Occurs when the evaluation encounters runtime
    or other exceptions. The response contains an error message specifying the
    encountered exception.

- **Sample Call**:

  ```bash
  curl -X POST 'http://localhost:8080/evaluateFromRepoWithParams' --data \
  'programName=program.vada' --data 'params=X=1,Y=3'
  ```

  gives the following response:

  ```json
  {
    "id": 1,
    "resultSet": { "c": [[1, 3]] },
    "types": { "c": ["INT", "INT"] },
    "columnNames": { "c": ["A", "B"] }
  }
  ```

#### `/evaluateFromRepoWithParamsProps`

It sets specified properties in the `vada.properties` file, evaluates a Vadalog
program, using the values for X and Y specified as parameters, and returns the
results as a JSON blob.

- **URL**: `/evaluateFromRepoWithParamsProp`
- **Method**: `POST`
- **Data Params**: the first query param contains the path to the program from
  the `repository` folder, the second is a string that represents the params X
  and Y and the third is a string that represents the vada properties set:
  `programName=[Path-to-Vadalog-Program], params=[string ("X=value, Y=value")],
prop=[string ["propertyName=value"]]`
- **Response**: `{ "id" : [integer], "resultSet" : { "atom_name" : [list of
result values] }, "types" : { "atom_name" : [list of result types] },
"columnNames" : { "atom_name : [list of result column names] } }`

* **Status Codes:**
  - `200 OK`: Successful evaluation of the Vadalog program.
  - `400 BAD_REQUEST`: Indicates a malformed Vadalog program in the request
    body. The response includes an error message detailing the issue.
  - `500 INTERNAL_SERVER_ERROR`: Occurs when the evaluation encounters runtime
    or other exceptions. The response contains an error message specifying the
    encountered exception.

- **Sample Call**:

  ```bash
  curl -X POST 'http://localhost:8080/evaluateFromRepoWithParamsProp' --data \
  'programName=program.vada' --data 'params=X=1,Y=3' --data \
  'prop=terminationStrategyMode=lightMode, linearization=true'
  ```

  gives the following response:

  ```json
  {
    "id": 1,
    "resultSet": { "c": [[1, 3]] },
    "types": { "c": ["INT", "INT"] },
    "columnNames": { "c": ["A", "B"] }
  }
  ```

### `/actuator/health`

This endpoint validates the health status of the system its various components,
including Vadalog Distributed Evaluation, disk space, and a simple ping check.

- **URL**: `/actuator/health`
- **Method**: `GET`
- **Response**: `{ "status": "System Status (UP/DOWN/UNKNOWN)", "components": {
"Vadalog Distributed": { "status": "Component Status (UP/DOWN/UNKNOWN)",
"details": { "Vadalog Distributed with Local/Spark Standalone/YARN/Livy":
  "Component Detail Status" } }, "diskSpace": { "status": "Component Status
    (UP/DOWN/UNKNOWN)", "details": { "total": "Component Detail Status",
    "free": "Component Detail Status", "threshold": "Component Detail Status",
      "exists": true/false } }, "ping": { "status": "Component Status
    (UP/DOWN/UNKNOWN)" } } } `
- **Sample Call**:
  ```bash
    curl http://localhost:8080/actuator/health
  ```

### `/config-info/set`
This endpoint allows you to set a single key-value pair for configuration. It is useful for dynamically setting credentials such as database connection details or AWS access keys for S3 buckets.
Refer to the [Prometheux Configuration Guide](../on-prem/03-configuring-prometheux.md) to review the available configuration properties.

- URL: `/config-info/set`

- Method: `POST`

- Request Body:
  ```json
  {
    "key": "propertyName",
    "value": "propertyValue"
  }
  ```
  - `key`: The configuration key you wish to set (e.g., database.password, aws.accessKey).
  - `value`: The value to be assigned to the given key (e.g., myDBPassword, myAWSAccessKey).
- Response: `{ "status": "SUCCESS/FAILURE", "message": "Operation details" }`

Sample Call:
```bash
curl -X POST "http://localhost:8080/config-info/set" \
  -H "Content-Type: application/json" \
  -d '{"key": "database.password", "value": "myDBPassword"}'
```

## `/config-info/setAll`
This endpoint allows you to set multiple key-value pairs for configuration at once. The key-value pairs should be provided in the request body as a JSON object.

Refer to the [Prometheux Configuration Guide](../on-prem/03-configuring-prometheux.md) to review the available configuration properties.

- URL: `/config-info/setAll`

Method: `POST`

Request Body:

```json
{
  "propertyName1": "propertyValue1",
  "propertyName2": "propertyValue2",
  "propertyName3": "propertyValue3"
}
```
Each key represents a configuration property (e.g., database.password, aws.accessKey), and each value represents the value assigned to that property.

Response: `{ "status": "SUCCESS/FAILURE", "message": "All properties set successfully or error details"}`

Sample Call:
```bash
curl -X POST "http://localhost:8080/config-info/setAll" \
  -H "Content-Type: application/json" \
  -d '{
    "database.password": "myDBPassword",
    "s3AaccessKey": "myAWSAccessKey",
    "s3ASecretKey": "myAWSSecretKey"
  }'
```