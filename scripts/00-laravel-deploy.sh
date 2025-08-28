#!/usr/bin/env bash
echo "Running composer"
composer install --no-dev --working-dir=/var/www/html

# Wait for the database to be ready
echo "Waiting for database connection..."
php -r "
\$host = env('DB_HOST');
\$port = env('DB_PORT');
\$database = env('DB_DATABASE');
\$username = env('DB_USERNAME');
\$password = env('DB_PASSWORD');
\$maxTries = 10;
\$tries = 0;
while (\$tries < \$maxTries) {
    try {
        \$dbh = new PDO(\"mysql:host=\$host;port=\$port\", \$username, \$password);
        echo \"Database connection successful\\n\";
        break;
    } catch (PDOException \$e) {
        \$tries++;
        echo \"Waiting for database connection... (\$tries/\$maxTries)\\n\";
        sleep(5);
    }
}
if (\$tries === \$maxTries) {
    echo \"Database connection failed after \$maxTries attempts.\\n\";
    exit(1);
}
"

echo "Clearing cache..."
php artisan optimize:clear

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Running seeders..."
php artisan db:seed --force

echo "Publishing cloudinary provider..."
php artisan vendor:publish --provider="CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider" --tag="cloudinary-laravel-config" --force
