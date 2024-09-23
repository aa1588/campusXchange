# CampusXchange

A Campus-Focused Marketplace Addressing UNT student needs.

---

This project consists of two main parts:
- **Frontend**: A React-based UI (`campusxchange-ui`).
- **Backend**: A Spring Boot API (`campusxchange`).

## Table of Contents
1. [Product vision](#product-vision)
2. [Development Platform](#development-platform)
3. [Technologies Used](#technologies-used)
4. [System Requirements](#system-requirements)
5. [Setup Guide](#setup-guide)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Contributing Backend](#contributing-backend)
9. [Contributing Frontend](#contributing-frontend)
10. [License](#license)

## Product Vision

FOR UNT students WHO are seeking an easy, quick, and secure way to buy, sell or get rid of unused items which might come handy for other students (e.g., textbooks, laptop, desk, car, etc.) within the UNT campus community, THE CampusXchange, is a web-based second-hand marketplace THAT operates on web browsers and offers daily unique recommendation of used items via email based on the category and price of items on your wishlist. CampusXchange provides a small, localized, and student-friendly platform specifically designed for students considering their needs and financial challenges. UNLIKE other options such as Facebook Marketplace, Craigslist or OfferUp, which accommodates an exceptionally large audience while lacking student-specific features, OUR PRODUCT enables students to connect locally and purchase items safely and conveniently within their academic environment. CampusXchange allows students to find the items they need for an affordable price or sell the items that are no longer useful or get rid of the unused items by donating them to local fellow students, while saving their money and time.

## Development Platform
- Standard PCs or laptops (Windows/macOS)
- RAM >= 8 GB, SSD >=512 GB (recommended)

## Technologies Used
### Frontend
- React
- React-Bootstrap
- TypeScript

### Backend
- Java 21
- Spring Boot 3.3.4
- Spring Security (for authentication)
- Spring Data JPA (for database interaction)
- Flyway (Database Migration)
- Postgresql
- Maven (for build management)
- Docker (for containerization)

## Testing
- Junit, TestContainers, Mockito, AssertJ, Jest


### Deployment
- AWS


## System Requirements
- Node.js v20 or higher (20.9.0 used)
- npm v10.8.3 or higher
- TypeScript 5.x or (v5.6.2 used)
- Java 21
- Maven 3.x or higher (3.9.2 used)
- Postgresql 13.x
- Docker Desktop Installation

## Setup Guide
- Clone the repository 
### Frontend Setup
1. Run `$ cd campusxchange-ui`
2. Run `$ npm i`
3. Run `$ npm start` and access the application at `http://localhost:3000`

### Backend Setup

1. Run `$ docker compose up`
2. Run `$ cd campusxchange`
3. Run `$ mvn spring-boot:run` and access the application at `http://localhost:8080`

## Contributing Backend
- Run `mvn spotless:apply` before every push for spotless code

## Contributing Frontend
- Run `npm run pc` before every commit for Pre-Commit Prettier Formatting

## License

This project is licensed under the MIT License. See the [LICENSE] file for details.

### Contribution and Collaboration
As a group project, contributions from all team members are acknowledged. If you wish to use or modify this project, please credit the original authors and respect the terms of the chosen license.