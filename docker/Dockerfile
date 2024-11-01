# Start with PHP 8.2 FPM Alpine base image
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    bash \
    shadow \
    docker \
    docker-compose \
    nginx

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql bcmath gd

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Initial Docker group setup
RUN mkdir -p /var/run && \
    addgroup -g 999 docker || true && \
    addgroup www-data docker || true

# Give www-data user shell access
RUN usermod -s /bin/bash www-data

# Set working directory
WORKDIR /var/www/html

# Set working directory and clone repository
RUN rm -rf * && \
    git clone https://github.com/jox51/pocketbase-manager.git . && \
    chown -R www-data:www-data .

# Create and configure Laravel .env file
RUN cp .env.example .env && \
    chown www-data:www-data .env && \
    chmod 666 .env

# Set up pb-manager-scripts environment
WORKDIR /var/www/html/scripts/pb-manager-scripts
RUN touch .env && \
    echo "DOMAIN=localhost:8080" > .env && \
    echo "EMAIL=admin@example.com" >> .env && \
    chown www-data:www-data .env && \
    chmod 666 .env

# Set proper permissions for scripts
RUN chmod -R 755 . && \
    chown -R www-data:www-data .

# Install PHP dependencies
WORKDIR /var/www/html
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Create SQLite database
RUN touch database/database.sqlite && \
    chmod -R 777 database

# Run migrations and optimize
RUN php artisan migrate --force && \
    php artisan key:generate

# Install Node.js dependencies and build frontend
WORKDIR /var/www/html/pb-manager
RUN npm install && npm run build

# Configure Nginx and required directories
RUN mkdir -p /var/lib/nginx/tmp/client_body \
    /var/lib/nginx/tmp/proxy \
    /var/lib/nginx/tmp/fastcgi \
    /var/lib/nginx/tmp/uwsgi \
    /var/lib/nginx/tmp/scgi \
    /run/nginx \
    /var/log/nginx && \
    chown -R www-data:www-data /var/lib/nginx \
    /run/nginx \
    /var/log/nginx && \
    chmod -R 755 /var/lib/nginx \
    /run/nginx \
    /var/log/nginx

# Set Laravel directory permissions
WORKDIR /var/www/html
RUN mkdir -p storage/framework/{sessions,views,cache} && \
    mkdir -p storage/logs && \
    chown -R www-data:www-data storage && \
    chmod -R 775 storage && \
    chown -R www-data:www-data bootstrap/cache && \
    chmod -R 775 bootstrap/cache

# Copy and configure Nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN chown www-data:www-data /etc/nginx/nginx.conf && \
    chmod 644 /etc/nginx/nginx.conf

# Create entrypoint script with better error handling
RUN echo '#!/bin/sh' > /usr/local/bin/docker-entrypoint.sh && \
    echo 'set -e' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'if [ -e /var/run/docker.sock ]; then' >> /usr/local/bin/docker-entrypoint.sh && \
    echo '  DOCKER_GID=$(stat -c "%g" /var/run/docker.sock || echo 999)' >> /usr/local/bin/docker-entrypoint.sh && \
    echo '  if [ "$DOCKER_GID" != "0" ]; then' >> /usr/local/bin/docker-entrypoint.sh && \
    echo '    groupmod -g "$DOCKER_GID" docker || true' >> /usr/local/bin/docker-entrypoint.sh && \
    echo '  fi' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'fi' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'usermod -aG docker www-data || true' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'chmod 666 /var/run/docker.sock || true' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'chown root:docker /var/run/docker.sock || true' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'exec "$@"' >> /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Enable shell_exec
RUN echo "shell_exec enable" > /usr/local/etc/php/conf.d/shell_exec.ini

# Set entrypoint and CMD
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]