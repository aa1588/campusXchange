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
6. [Modules](#modules)
   - [Users Module](#users-module)
   - [Items Module](#items-module)
   - [Wishlist Module](#wishlist-module)
   - [Offers Module](#offers-module)
   - [Recommendations Module](#recommendations-module)
   - [Admin Module](#admin-module)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing Backend](#contributing-backend)
10. [Contributing Frontend](#contributing-frontend)
11. [License](#license)

---
## Product Vision

FOR UNT students WHO are seeking an easy, quick, and secure way to buy, sell or get rid of unused items which might come handy for other students (e.g., textbooks, laptop, desk, car, etc.) within the UNT campus community, THE CampusXchange, is a web-based second-hand marketplace THAT operates on web browsers and offers daily unique recommendation of used items via email based on the category and price of items on your wishlist. CampusXchange provides a small, localized, and student-friendly platform specifically designed for students considering their needs and financial challenges. UNLIKE other options such as Facebook Marketplace, Craigslist or OfferUp, which accommodates an exceptionally large audience while lacking student-specific features, OUR PRODUCT enables students to connect locally and purchase items safely and conveniently within their academic environment. CampusXchange allows students to find the items they need for an affordable price or sell the items that are no longer useful or get rid of the unused items by donating them to local fellow students, while saving their money and time.

---
## Development Platform
- Standard PCs or laptops (Windows/macOS)
- RAM >= 8 GB, SSD >=512 GB (recommended)

---
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

---
## Testing
- Junit, TestContainers, Mockito, AssertJ, Jest

---
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

---

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

### Docker Setup (Local)

> **NOTE:** Maven Setting - Add DockerHub configuration in `settings.xml`
```bash
   <server>
      <id>registry.hub.docker.com</id>
      <username>campusxchange</username>
      <password>docker-hub-password</password>
   </server>
```
1. Build and Push Docker Image to DockerHub from the local 

```bash
   $ mvn clean compile jib:build  
```
 > **NOTE:** Automatic Build Image and Push to Registry through gitHub actions.

2. Start Infra(Database) & App (backend , frontend) from root folder (Docker Compose) - for locally accessing the application
```bash
   $ docker compose -f docker-compose.yml -f docker-compose-app.yml up -d
```


## Contributing Backend
- Run `mvn spotless:apply` before every push for spotless code

## Contributing Frontend
- Run `npm run pc` before every commit for Pre-Commit Prettier Formatting

---
## Modules

### users-module
Manages user-related functionality, including user registration, login, authentication, profile management, and user roles (e.g., admin, user(seller/buyer)). It ensures that users can securely access the marketplace, make transactions, and manage their personal information.
### items-module
Handles all operations related to items listed in the marketplace. This includes adding, editing, deleting, and viewing secondhand products. It manages item details like titles, descriptions, prices, categories, images, and availability.
### wishlist-module
Allows users to save items they are interested in for future reference. It enables users to add, remove, and view items in their wishlist, providing a convenient way to track desired products without having to revisit them constantly.
### offers-module
Manages the buying and selling process by handling offers made between buyers and sellers. It allows users to make offers on listed items, negotiate prices, and accept or decline offers, facilitating transactions between users in the marketplace.
### recommendations-module
The RecommendationService is designed to recommend items to a user based on the items they have in their wishlist. It analyzes the user's wishlist, compares the items there to other available items in the system, and generates a list of recommended items. These recommendations are intended to suggest items that are similar to the ones the user has shown interest in (by adding them to their wishlist).

`Item Comparison:`
The items in the user's wishlist are compared against all items in the database to find items that are similar to those in the wishlist.

**Similarity Calculation**

`Category Similarity:` If two items belong to the same category, they are considered more similar. This is weighted as 70% of the total similarity score.

`Price Similarity:` The price difference between two items is calculated, and a similarity score is computed based on how close the prices are. The closer the prices, the higher the similarity. This is weighted as 30% of the total similarity score.

`Weighted Similarity Formula:`
- categorySimilarity is either 1 (if the categories match) or 0 (if they don't).
- priceSimilarity is calculated using the formula 1 / (1 + priceDiff), where priceDiff is the absolute difference between the prices of two items. This ensures that the closer the prices are, the higher the similarity.

The final similarity score for two items is a weighted combination of these two components:

```angular2html
similarityScore = 0.7 * categorySimilarity + 0.3 * priceSimilarity

```

`Recommendation Sorting:`
The items are sorted by their aggregated similarity scores in descending order, meaning items that are more similar to the user's wishlist will be ranked higher.
### admin-module
Provides administrative control over the platform. It enables administrators to manage users, items, and transactions.

---

## License

This project is licensed under the MIT License. See the [LICENSE] file for details.

### Contribution and Collaboration
As a group project, contributions from all team members are acknowledged. If you wish to use or modify this project, please credit the original authors and respect the terms of the chosen license.