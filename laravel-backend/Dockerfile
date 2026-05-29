FROM php:8.2-fpm-alpine

# Install system dependencies & nginx
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    oniguruma-dev \
    postgresql-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring xml gd pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Nginx configuration
COPY docker-config/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

# Copy application files
COPY . .

# Set up storage and cache directories and set permissions
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache && \
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Install dependencies
RUN composer install --no-interaction --prefer-dist --no-scripts --optimize-autoloader --ignore-platform-reqs

EXPOSE 80

CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
