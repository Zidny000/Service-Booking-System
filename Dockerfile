FROM richarvey/nginx-php-fpm:latest

# Install additional dependencies
RUN apk --no-cache add \
    nodejs \
    npm

WORKDIR /var/www/html

# Copy project files
COPY . .

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Install NPM dependencies and build assets
RUN if [ -f "package.json" ]; then \
        npm install && \
        npm run build; \
    fi

# Set proper permissions
RUN chown -R nginx:nginx /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV NGINX_WORKER_PROCESSES auto

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV SESSION_DRIVER cookie
ENV CACHE_DRIVER file
ENV QUEUE_CONNECTION database

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Script to deploy Laravel on container start
COPY scripts/00-laravel-deploy.sh /var/scripts/

# Make the script executable
RUN chmod +x /var/scripts/00-laravel-deploy.sh

CMD ["/start.sh"]