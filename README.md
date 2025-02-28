# API Endpoints

### Register User
**POST** `/register`

#### Request Body
```json
{
  "fullname": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaGFuIERvZSIsImVtYWlsIjoiam9obmUuZG9lQGV4YW1wbGUuY29tIn0.abc123",
  "record": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### Login User
**POST** `/login`

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaGFuIERvZSIsImVtYWlsIjoiam9obmUuZG9lQGV4YW1wbGUuY29tIn0.abc123",
  "record": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### Logout User
**GET** `/logout`

#### Response
```json
{
  "message": "Logged out successfully"
}
```

## OTP Validation Endpoint

### Validate OTP
**POST** `/validate-otp`

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "otp": "123456"
}
```

#### Response
```json
{
  "message": "OTP is valid"
}
```

### Create Chatbot
**POST** `/create-bot`

#### Request Body
```json
{
  "name": "PARI",
  "description": "boAt Airdopes 311 Pro, 50HRS Battery, Fast Charge, Dual Mics ENx Tech, Transparent LID, Low Latency, IPX4, IWP Tech, v5.3 Bluetooth Earbuds, TWS Ear Buds Wireless Earphones with mic (Active Black)",
  "information": "Up to 50 hours of Playback: Stay entertained non-stop with up to 50 hours of massive playtime. Pop in boAt Airdopes 311 Pro TWS Earbuds and make commutes fun with your favorite tunes for company ENx Technology: ENx-powered dual mics in these earbuds make attending calls in public spaces a breeze.Speak and listen from busy roads, airport lounges, cafés, and more without pesky background sounds.ASAP Charging: Charge for just 10 minutes and hit play on entertainment for 150 minutes. Finish the latest OTT releases or relive your old favorites with swift charging"
}
```

#### Response
```json
{
  "result": {
    "userId": "67893ff11eda63315ad8a418",
    "name": "PARI",
    "requestCount": 0,
    "description": "boAt Airdopes 311 Pro wireless earbuds with 50HR battery, fast charge, dual mics, and low latency.",
    "information": "Up to 50 hours of playback\nENx Technology (dual mics)\nASAP Charging: 10 minutes = 150 minutes",
    "status": "active",
    "_id": "678b35af3d77885e98430fce",
    "created_at": "2025-01-18T05:01:35.888Z",
    "__v": 0
  },
  "API_URL": "http://localhost:5000/chatbot/generate",
  "APIKEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGF0Ym90SWQiOiI2NzhiMzVhZjNkNzc4ODVlOTg0MzBmY2UiLCJpYXQiOjE3MzcxNzY0OTV9.7mJLEs29l0A3cSPp-ibvqPOe5FyqQMif-CDg7UghRZs"
}
```

### Endpoint Documentation: `/generate`

#### Description
The `/generate` endpoint processes a user prompt to generate a concise response based on the product description and information stored for a specific chatbot. This endpoint ensures users get accurate and context-relevant answers using AI.

---

## HTTP Method
**POST**

---

## Request

### Headers
- **Autherisation**: `bearer <token>`

### Body
The request body must include the following fields:

```json
{
  "prompt": "<user_question>",
  "apiKey": "<api_key_for_chatbot>"
}
```

#### Fields:
- **prompt** (string, required): The user query to generate a response for.
- **apiKey** (string, required): The API key associated with the chatbot. This key validates the chatbot and ensures access control.

### Example Request:
```json
{
  "prompt": "whats the use of this product?",
  "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGF0Ym90SWQiOiI2NzhlOTMyODQzN2IyMDRjOTBhZWFkNzkiLCJpYXQiOjE3MzczOTcwMzN9.BFTp6BZoktEy0V7w7pmtR6VX0nHjWaTBE4azR37OAg"
}
```

---

## Response

### Success Response
If the request is successful, the endpoint returns a JSON object with the generated response.

#### Response Fields:
- **response** (string): The AI-generated response based on the chatbot’s description and information.

#### Example Success Response:
```json
{
  "response": "True Wireless earbuds with active noise cancellation for listening to music or other audio on laptops, mobiles, or tablets."
}
```

###  List All Chatbots
#### **Endpoint:**
```
GET /chatbot
/list-bots
```
#### **Headers:**
```json
{
    "Authorization": "Bearer <your_token>"
}
```
#### **Response:**
```json
[
    {
        "_id": "67b56adcf2adee6f6359b6dd",
        "userId": "67b56a56f2adee6f6359b6d5",
        "name": "Samsung Book 4",
        "requestCount": 1,
        "description": "The Samsung Galaxy Book4 in Gray features 16GB RAM, 512GB SSD, 15.6 Full HD display, Intel Core i5 processor, Windows 11 Home, MS Office 2021, fingerprint reader, Intel Iris XE graphics, and RJ45 LAN port.",
        "information": "The Samsung Galaxy Book4 is a portable laptop with a 15.6-inch Full HD display, an Intel Core i5 processor at 1.3 GHz, 16GB LPDDR4X RAM, and a 512GB SSD storage. It has Dolby Atmos speakers, Intel Iris Xe Graphics, runs on Windows 11 Home, and features a 54Wh lithium-ion battery. Connectivity options include Bluetooth, Wi-Fi (802.11ax), two USB 3.0 ports, and an HDMI port. The device weighs 1.55 kg and comes with a 45W charger, USB-C to C cable, and a quick start guide made in China.",
        "status": "active",
        "created_at": "2025-02-19T05:23:40.390Z",
        "__v": 0
    }
]
```

---

###  Get Chatbot by ID
#### **Endpoint:**
```
GET /chatbot/get-bot/:id
```
#### **Headers:**
```json
{
    "Authorization": "Bearer <your_token>"
}
```
#### **Response:**
```json
{
    "_id": "67b56adcf2adee6f6359b6dd",
    "userId": "67b56a56f2adee6f6359b6d5",
    "name": "Samsung Book 4",
    "requestCount": 1,
    "description": "The Samsung Galaxy Book4 in Gray features 16GB RAM, 512GB SSD, 15.6 Full HD display, Intel Core i5 processor, Windows 11 Home, MS Office 2021, fingerprint reader, Intel Iris XE graphics, and RJ45 LAN port.",
    "information": "The Samsung Galaxy Book4 is a portable laptop with a 15.6-inch Full HD display, an Intel Core i5 processor at 1.3 GHz, 16GB LPDDR4X RAM, and a 512GB SSD storage. It has Dolby Atmos speakers, Intel Iris Xe Graphics, runs on Windows 11 Home, and features a 54Wh lithium-ion battery. Connectivity options include Bluetooth, Wi-Fi (802.11ax), two USB 3.0 ports, and an HDMI port. The device weighs 1.55 kg and comes with a 45W charger, USB-C to C cable, and a quick start guide made in China.",
    "status": "active",
    "created_at": "2025-02-19T05:23:40.390Z",
    "__v": 0
}
```

---

###  Update Chatbot
#### **Endpoint:**
```
POST /chatbot/update-bot
```
#### **Headers:**
```json
{
    "Authorization": "Bearer <your_token>",
    "Content-Type": "application/json"
}
```
#### **Request Body:**
```json
{
    "chatbotId": "67b578deb5c3b6a38dd4c285",
    "name": "My Updated Chatbot",
    "description": "The XYZ Smartphone is a sleek and powerful device designed for modern users. Featuring a high-resolution display, a fast processor, and a long-lasting battery, it ensures smooth performance for work and entertainment. With its advanced camera system, capture stunning photos and videos effortlessly. The phone also offers 5G connectivity, ample storage, and the latest security features for a seamless and secure user experience. Perfect for those who demand performance, style, and innovation in one device.",
    "information": "The XYZ Smartphone is a sleek and powerful device designed for modern users. Featuring a high-resolution display, a fast processor, and a long-lasting battery, it ensures smooth performance for work and entertainment. With its advanced camera system, capture stunning photos and videos effortlessly. The phone also offers 5G connectivity, ample storage, and the latest security features for a seamless and secure user experience. Perfect for those who demand performance, style, and innovation in one device."
}
```
#### **Response:**
```json
{
    "message": "Chatbot Updated.",
    "chatbot": {
        "_id": "67b578deb5c3b6a38dd4c285",
        "userId": "67b56a56f2adee6f6359b6d5",
        "name": "My Updated Chatbot",
        "requestCount": 3,
        "description": "The XYZ Smartphone is designed for modern users with a high-resolution display, fast processor, long-lasting battery, advanced camera system, 5G connectivity, ample storage, and latest security features.",
        "information": "The XYZ Smartphone:\n\n* High-resolution display\n* Fast processor\n* Long-lasting battery\n* Advanced camera system\n* 5G connectivity\n* Ample storage\n* Latest security features",
        "status": "active",
        "created_at": "2025-02-19T06:23:26.813Z",
        "__v": 0
    }
}
```

---

###  Delete Chatbot
#### **Endpoint:**
```
POST /chatbot/delete-bot
```
#### **Headers:**
```json
{
    "Authorization": "Bearer <your_token>",
    "Content-Type": "application/json"
}
```
#### **Request Body:**
```json
{
    "botId": "67b56adcf2adee6f6359b6dd"
}
```
#### **Response:**
```json
{
    "message": "Chatbot deleted successfully."
}
```

---



###  Get Activities
**GET** `/activities/recentActivities`

## Description
This API retrieves recent user activities, allowing sorting and limiting the number of results.

## Request Format
```http
GET /activities/recentActivities?order=desc&limit=10 HTTP/1.1
Host: localhost:5000
```

### Query Parameters
| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `order`   | string | No       | Sorting order (`asc` for oldest first, `desc` for newest first, default: `desc`). |
| `limit`   | number | No       | Number of records to return (default: 10). |

## Response Format
```json
{
    "success": true,
    "data": [
        {
            "_id": "67c203fd79e1b7f1d4fef2ce",
            "userId": "67b56a56f2adee6f6359b6d5",
            "action": "ACTIVATED BOT",
            "details": "Bot ID: 67beeb0b3c3a2fad699061c8",
            "createdAt": "2025-02-28T18:44:13.627Z"
        },
        {
            "_id": "67c203f979e1b7f1d4fef2c8",
            "userId": "67b56a56f2adee6f6359b6d5",
            "action": "CREATED BOT",
            "details": "Bot ID: 67c203cf79e1b7f1d4fef2be",
            "createdAt": "2025-02-28T18:43:27.808Z"
        }
    ]
}
```

## Notes
- Helps track user actions such as bot activations, deactivations, and creations.
- Useful for logging and monitoring recent operations. 🚀




### Error Responses
If the request fails, an appropriate error message and status code are returned.

#### Example Error Responses:

1. **Invalid API Key:**
   - **Status Code:** 404
   - **Body:**
     ```json
     {
       "message": "Invalid API key."
     }
     ```

2. **Inactive Chatbot:**
   - **Status Code:** 403
   - **Body:**
     ```json
     {
       "message": "Chatbot is not active."
     }
     ```

3. **Insufficient Credit:**
   - **Status Code:** 403
   - **Body:**
     ```json
     {
       "message": "Insufficient credit. Please recharge your account."
     }
     ```

4. **Server Error:**
   - **Status Code:** 500
   - **Body:**
     ```json
     {
       "message": "An error occurred while processing your request.",
       "error": "<error_details>"
     }
     ```

---

## Notes
1. **API Key Validation:** The `apiKey` is decoded to extract the `chatbotId`. This `chatbotId` is used to retrieve the corresponding chatbot details.
2. **Chatbot Conditions:** The chatbot must have an `active` status to proceed.
3. **Credit Check:** The user associated with the chatbot must have sufficient credit to use this endpoint.
4. **Logging:** Each request is logged, and the `requestCount` for the chatbot is incremented. The user’s `totalRequestCount` is incremented, and `credit` is decremented.

---

## Example Use Case
### Scenario:
A user wants to know the primary use of the product described in the chatbot.

#### Request:
```json
{
  "prompt": "whats the use of this product?",
  "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGF0Ym90SWQiOiI2NzhlOTMyODQzN2IyMDRjOTBhZWFkNzkiLCJpYXQiOjE3MzczOTcwMzN9.BFTp6BZoktEy0V7w7pmZtR6VX0nHjWaTBE4azR37OAg"
}
```

#### Response:
```json
{
  "response": "True Wireless earbuds with active noise cancellation for listening to music or other audio on laptops, mobiles, or tablets."
}
```

---

## Additional Information
- **Rate Limits:** Ensure that usage adheres to the assigned credits in the user account.
- **Error Handling:** Provide meaningful error messages to guide users in correcting their requests.

---





#### Authentication
This endpoint requires user authentication. The `AuthMiddleware.userAuth` middleware verifies the user's credentials before allowing access to this endpoint. A valid authentication token must be provided in the request headers.

#### Controller
This endpoint is handled by the `chatController.createBot` controller function.
