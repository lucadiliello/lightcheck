## lightcheck

# Server-Devices Http APIs
- POST /devices
 - Comment: Get the database id of a point. If the point does not exists, it will be created
 - BODY
  - Parameters
   - lat: float
   - lng: float

 - RESPONSE
  - Parameters
   - id: integer

- PUT /devices/:id
 - Comment: update the values and status of a point
 - RESPONSE
  - Parameters
   - status: string



# Server-Client Socket APIs
- "init"
 - Comment: Get all the points on the map
 - RESPONSE
  - Parameters:
   - Array
    - Lat: float
    - Lng: float
    - Working: boolean
