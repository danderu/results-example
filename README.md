# Slacker
Typeform Hackathon Challenge 2017

## Getting started

### Deploy to Heroku

You can deploy your application to Heroku in one click using the button below and following the instructions.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/danderu/slacker/tree/master)

### Development

#### Requirements

- More or less recent versions of Node.js and NPM installed
- [Heroku CLI client](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) (needed if you plan to work with Heroku)

#### Installation
To install the application and its dependencies:

```
$ git clone https://github.com/danderu/slacker.git

$ cd slacker
$ npm install
```

#### Running
To run the application you would need to setup some environment variables. The easiest way is to create a `.env` file and then export it's contents before running the application:

```
$ cat .env
APPLICATION_URL=http://localhost:3000
CLIENT_ID=<your_slack_client_id>
CLIENT_SECRET=<your_slack_client_secret>

$ export $(cat .env)
```

And finally to run the application:

```
$ npm start
```

#### [Re-]deploying to Heroku

In order to be able to deploy your changes to Heroku, you need to add a Heroku remote to your git repository:

```
$ heroku git:remote -a <your_heroku_application_name>
```

To deploy the changes to Heroku just push them to the `heroku` remote:

```
$ git push heroku master
```
