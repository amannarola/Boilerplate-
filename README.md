# backend REST API

This project contains REST API for backend project.

## Requirements

For development, you will only need Node.js and a node global package, installed in your environement.

### Node

- #### Node installation on Windows

Just go on [official Node.js website](https://nodejs.org/) and download the installer.

Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

You can install nodejs and npm easily with apt install, just run the following commands.

\$ sudo apt install nodejs

\$ sudo apt install npm

- #### Other Operating Systems

You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

\$ node --version

v10.16.3

\$ npm --version

6.9.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

\$ npm install npm -g

### MongoDB

- #### MongoDB installation on Windows

Just go on [official MongoDB website](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) and download the installer.

- #### MongoDB installation on Ubuntu

  Just go on [official MongoDB website](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) and download the installer.

- #### Other Operating Systems

You can find more information about the installation on the [official MongoDB website](https://docs.mongodb.com/manual/administration/install-community/).

## Install

$ git clone https://gitlab.com/boiler-plate1/node/node-login-ragister-and-google-login-boiler-plate.git
$ cd node-login-ragister-and-google-login-boiler-plate
\$ npm install

## Running the project in development

\$ npm run start:dev

## Simple build for production

\$ npm run build

## Running the project with docker

Download [Docker for Window](https://docs.docker.com/docker-for-windows/install/). [Docker for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu)

Then run below cmd
\$ docker-compose up

## Running ESLINT

\$ npm run lint

## Git commit message guidelines

[Commit guidelines](http://karma-runner.github.io/1.0/dev/git-commit-msg.html)

## Heroku Deployment

[Download Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

login into heroku cli

\$ heroku login

create heroku app[if already not created]

\$ heroku create

set heroku remote

\$ heroku git:remote -a <heroku_app_name:random-name-97933>

deploy on heroku

\$ git push heroku master

check heroku logs

\$ heroku logs --tail | findstr "LOGS"
