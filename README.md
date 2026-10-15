# NORTHCODERS NEWS API

A PostgreSQL API that alongside a front-end project will be used to create a mini Reddit-style news website/forum.

## Background

This project is a recreation of the first API I created whilst on my Northcoders bootcamp. It was created during the back-end portion of the course. I am revisiting the project as I was made redundant from a role where I had worked mostly front end. I'd like to see how much I have improved and get some practice in.

The project is created using the MVC (model, view, controller) design method.

## Getting Started

Clone Repo `git clone https://github.com/BerniHarris/be-nc-news2.git`.

Install Dependencies by running `npm install`.

## .env Files

To access the correct databases locally, create the 2 env files within the root directory. The files to add are:

### .env.development

Inside `.env.development` set the database to `PGDATABASE = nc_news`

### .env.test

Inside `.env.development` set the database to `PGDATABASE = nc_news_test`

An example has been created called .env-example.

## Setting up Database

Before running locally, you will need to run the command `npm run setup-dbs`. This will reset any existing databases and by default run in the development environment.

Once they have been reset, run the command `npm run seed` in order to reset and populate your tables.

You are then able to run locally by using the command `node server.js` and visiting `http://localhost:9090/api/`. The port defaults to 9090.

## Testing

Jest and Supertest are used for testing. In order to run tests, use the command `npm test`. This will run by default using the test environment.

To testing in watch mode, use the command `npm test -- --watch`.
To view test coverage, use the command `npm test -- --coverage`.

You can also run with nodemon with command `npm run dev`

## Endpoints

Details can be seen in `endpoints.json`, however as a brief overview, the endpoints included are:

- **GET /api** - Serves up a json representation of all the available endpoints of the api

- **GET /api/topics** - Serves an array of all topics
- **GET /api/articles** - Serves an array of all articles
- **GET /api/articles/:article_id** - Responds with a complete article object including comments count
- **GET /api/articles/:article_id/comments** -Responds with an array of comment objects linked to a specified article_id
- **POST /api/articles/:article_id/comments** - Create a comment for a specific article_id and return the created comment object
- **PATCH /api/articles/:article_id** - Allows users to upvote or downvote an article and responds with the updated article object
- **GET /api/users**- Serves an array of all users
- **DELETE /api/comments/:comment_id** Allows users to delete comments by a comment_id
