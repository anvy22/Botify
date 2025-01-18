# API Endpoints

## Chatbot Endpoints

### Create Chatbot
**POST** `/create-bot`

#### Request Body
```json
{
  "name": "My Chatbot",
  "description": "A chatbot for customer support",
  "information": {
    "language": "English",
    "timezone": "UTC"
  }
}
```

#### Response
```json
{
  "result": "success",
  "API_URL": "https://api.example.com/chatbot/12345",
  "APIKEY": "abc123"
}
```

## User Endpoints

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

#### Authentication
This endpoint requires user authentication. The `AuthMiddleware.userAuth` middleware verifies the user's credentials before allowing access to this endpoint. A valid authentication token must be provided in the request headers.

#### Controller
This endpoint is handled by the `chatController.createBot` controller function.
