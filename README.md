# Service Booking System

A comprehensive Laravel-based service booking platform with React frontend that allows users to browse services, make bookings, and manage their appointments. The application uses Laravel Sanctum for secure API authentication and features separate interfaces for customers and administrators.

## Project Overview

The Service Booking System is designed to facilitate booking services online. It provides:

- **User Authentication**: Register, login, and profile management
- **Service Management**: Browse available services with details and pricing
- **Booking System**: Book services for specific dates and times
- **Admin Dashboard**: Manage services and bookings
- **API Endpoints**: Secure API endpoints for all functionality

## Technologies Used

- **Backend**: Laravel 12 with PHP 8.2
- **Frontend**: React 19 with TypeScript and Tailwind CSS 4
- **Authentication**: Laravel Sanctum for API token authentication
- **Testing**: Pest PHP for feature and unit testing

## Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/Zidny000/Service-Booking-System.git
   cd service-booking-system
   ```

2. **Install dependencies**
   ```
   composer install
   npm install
   ```

3. **Environment configuration**
   ```
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure your database in the .env file**
   ```
   DB_CONNECTION=
   DB_HOST=
   DB_PORT=
   DB_DATABASE=
   DB_USERNAME=
   DB_PASSWORD=
   ```

5. **Run migrations and seed the database**
   ```
   php artisan migrate
   php artisan db:seed
   ```

6. **Build frontend assets**
   ```
   npm run dev    # For development with hot reload
   # OR
   npm run build  # For production
   ```

7. **Start the development server**
   ```
   php artisan serve
   ```

8. **Access the application**
   Open your browser and go to http://localhost:8000

## API Testing Instructions

The Service Booking System provides a comprehensive set of API endpoints that can be tested using tools like Postman or cURL.

### Authentication

#### Register a new user
```
POST /api/register

Body:
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password",
    "password_confirmation": "password"
}
```

#### Login to get access token
```
POST /api/login

Body:
{
    "email": "test@example.com",
    "password": "password"
}

Response includes:
{
    "token": "YOUR_ACCESS_TOKEN"
}
```

### Using Authentication Token

For all authenticated endpoints, include the token in the request header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Customer Endpoints

#### Get user information
```
GET /api/get-user
```

#### Get all services
```
GET /api/services
```

#### Create a new booking
```
POST /api/bookings

Body:
{
    "service_id": 1,
    "booking_date": "2025-09-01T10:00:00",
    "notes": "Optional notes about the booking"
}
```

#### Get user bookings
```
GET /api/bookings
```

#### Logout (revoke token)
```
POST /api/logout
```

### Admin Endpoints

The following endpoints require an admin user:

#### Get all services (admin view)
```
GET /api/admin/services
```

#### Create a new service
```
POST /api/services

Body:
{
    "name": "Service Name",
    "description": "Service Description",
    "price": 99.99,
    "status": "active"
}
```

#### Update a service
```
PUT /api/services/{id}

Body:
{
    "name": "Updated Service Name",
    "description": "Updated Description",
    "price": 149.99,
    "status": "active"
}
```

#### Delete a service
```
DELETE /api/services/{id}
```

#### Get all bookings (admin view)
```
GET /api/admin/bookings
```

#### Update booking status
```
PUT /api/admin/bookings/{id}/status

Body:
{
    "status": "confirmed"  // Options: pending, confirmed, cancelled, completed
}
```

## Running Tests

The application includes a test suite built with Pest PHP. To run the tests:

```
php artisan test
```

## License

This project is open-sourced software.
