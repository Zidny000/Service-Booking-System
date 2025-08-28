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
   git clone https://github.com/Zidny000/Service-test.git
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
  