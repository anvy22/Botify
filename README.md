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
