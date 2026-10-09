# NORTHCODERS NEWS API

A PSQL API that alongside a front-end project will be used to create a mini Reddit style news website/ forum.

## Background

This project is a receration of the first API I created whilst on my Northcoders bootcamp. It was created during the back-end portoin of the course in which I am revisting to see how much I have improved and get some practice in.

The project is created using the MVC (model, view, controller) design method.

## Getting Started

Clone Repo BerniHarris/be-nc-news2.

Install Dependencies by running `npm install`.

## .env Files

To access the correct databases locally, create the 2 env files withion the root directory. The files to add are:

### .env.development

Inside `.env.development` st the database to `PGDATABASE = nc_news`

### .env.test

Inside `.env.development` st the database to `PGDATABASE = nc_news_test`

An example has been created called .env-example.

## Setting up Database

Before running locally, you will need to run the command `npm run setup-dbs`. This will reset any existing databases and by default run in the development environment.

Once they have been reset, run the command `npm run seed` in order to reset and populate your tables.

You are then able to run locally by using the command `node server.js` and visiting `http://localhost:9090/api/`.

## Testing

Jest and Supertest are used for testing. In order to run tests, use the command `npm test`. This will run by default using the test environment.

To view test coverage, use the command `npm test -- --coverage`.

## Endpoints

Details can be seen in `endpoints.json`, however as a brief overview, the endpoints included are:

- **GET /api** - Serves up a json representation of all the available endpoints of the api
- **GET /api/topics** - Serves an array of all topics
