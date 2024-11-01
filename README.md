# Pocketbase Manager

<p align="center">
  <img src="https://github.com/jox51/Pocketbase-Manager/blob/main/resources/assets/dashboard.png" alt="Pocketbase Manager Dashboard" width="100%">
</p>

Pocketbase Manager is a powerful web application that simplifies the creation and management of multiple Pocketbase instances. Built with Laravel and React, it provides a user-friendly interface to control your Pocketbase deployments.

## Features

-   🚀 Create and manage multiple Pocketbase instances
-   🔄 Start, stop, and restart instances
-   📊 Monitor instance status
-   ⚡ Run performance speed tests
-   🖥️ Built-in terminal interface
-   🔒 Secure authentication system
-   🌐 Centralized management dashboard

## Requirements

-   PHP >= 8.2
-   Composer
-   Node.js & NPM
-   Docker

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/jox51/pocketbase-manager.git
cd pb-manager
```

2. If you don't have Composer installed, [install it from here](https://getcomposer.org/download/)

3. If you don't have Node.js installed, [install it from here](https://nodejs.org/)

4. Install dependencies:

```bash
composer install
npm install
```

5. Create and configure your environment file:

```bash
cp .env.example .env
```

Update the following variables in your `.env` file:

```
# Base URL for your Pocketbase instances
# Use localhost for local development
POCKETBASE_BASE_URL=http://localhost
SPEED_TEST_INSTANCE_NAME=speedrun    # Name of the instance used for testing
SPEED_TEST_ADMIN_EMAIL=admin@example.com    # Admin email for test instance
SPEED_TEST_ADMIN_PASSWORD=superpassword    # Admin password for test instance
SPEED_TEST_RECORDS=100    # Number of records to create during the test
```

These settings control how the speed test operates:

-   The test creates a dedicated Pocketbase instance for performance testing
-   It automatically creates and deletes records to measure write speeds
-   You can adjust the number of test records to suit your needs
-   Results help you optimize your server configuration

````

6. Start the development server:

```bash
# Terminal 1
npm run dev

# Terminal 2
php artisan serve
````

7. Visit `http://localhost:8000` in your browser

## License

This project is open-sourced software licensed under the MIT license.

## Issues and Feedback

Found a bug? Have a feature request? I'd love to hear from you! Feel free to:

-   🐛 Open an issue on [GitHub Issues](https://github.com/jox51/pocketbase-manager/issues)
-   💡 Suggest new features
-   🔧 Submit pull requests

Your feedback helps make Pocketbase Manager better for everyone! Thanks!
