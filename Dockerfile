FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd zip

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Install NPM dependencies and build assets
RUN if [ -f "package.json" ]; then \
        npm install && \
        npm run build; \
    fi

# Set proper permissions
RUN chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV SESSION_DRIVER cookie
ENV CACHE_DRIVER file
ENV QUEUE_CONNECTION database

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Copy deploy script
COPY scripts/00-laravel-deploy.sh /var/www/html/deploy.sh

# Make the script executable
RUN chmod +x /var/www/html/deploy.sh

# Create start script
RUN echo '#!/bin/bash\n\
/var/www/html/deploy.sh\n\
php -S 0.0.0.0:$PORT -t /var/www/html/public\n\
' > /var/www/html/start.sh && \
chmod +x /var/www/html/start.sh

EXPOSE 8080
CMD ["/var/www/html/start.sh"]