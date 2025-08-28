#!/usr/bin/env bash
echo "Running composer"
composer install --no-dev --working-dir=/var/www/html

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating app key..."
    php artisan key:generate --force
fi

# Wait for the database to be ready
echo "Waiting for database connection..."
php -r "
\$host = getenv('DB_HOST');
\$port = getenv('DB_PORT');
\$database = getenv('DB_DATABASE');
\$username = getenv('DB_USERNAME');
\$password = getenv('DB_PASSWORD');
\$connection = getenv('DB_CONNECTION');
\$maxTries = 10;
\$tries = 0;

while (\$tries < \$maxTries) {
    try {
        if (\$connection === 'pgsql') {
            \$dsn = \"pgsql:host=\$host;port=\$port;dbname=postgres\";
        } else {
            \$dsn = \"mysql:host=\$host;port=\$port\";
        }
        \$dbh = new PDO(\$dsn, \$username, \$password);
        echo \"Database connection successful\\n\";
        break;
    } catch (PDOException \$e) {
        \$tries++;
        echo \"Waiting for database connection... (\$tries/\$maxTries): \" . \$e->getMessage() . \"\\n\";
        sleep(5);
    }
}
if (\$tries === \$maxTries) {
    echo \"Database connection failed after \$maxTries attempts.\\n\";
    exit(1);
}
"

echo "Installing required dependencies for seeding..."
composer require --working-dir=/var/www/html fakerphp/faker --no-interaction

echo "Clearing cache..."
php artisan optimize:clear

# Skip route caching to avoid route duplication issues
# echo "Caching routes..."
# php artisan route:cache

echo "Running migrations..."
php artisan migrate --force

echo "Running seeders..."
php artisan db:seed --force

# Only publish Cloudinary if the package is installed
if composer show | grep -q 'cloudinarylabs/cloudinary-laravel'; then
  echo "Publishing cloudinary provider..."
  php artisan vendor:publish --provider="CloudinaryLabs\CloudinaryLaravel\CloudinaryServiceProvider" --tag="cloudinary-laravel-config" --force
fi
