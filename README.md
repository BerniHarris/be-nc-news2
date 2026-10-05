# NORTHCODERS NEWS API

A PSQL API that alongside a front-end project will be used to create a mini Reddit style news website/ forum.

## Background

This project is a receration of the first API I created whilst on my Northcoders bootcamp. It was created during the back-end portoin of the course in which I am revisting to see how much I have improved and get some practice in.

## Getting Started

Clone Repo BerniHarris/be-nc-news2.

Install Dependencies by running npm install.

## .env Files

To access the correct databases locally, create the 2 env files withion the root directory. The files to add are:

### .env.development

Inside `.env.development` st the database to `PGDATABASE = nc_news`

### .env.test

Inside `.env.development` st the database to `PGDATABASE = nc_news_test`

An example has been created called .env-example.

## Setting up Database

Before running locally, you will need to run the command `setup-dbs`. This will by default run in the development environment.
