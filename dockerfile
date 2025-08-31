# how backend should run insdie the container (base image, dependencies, what to expose how to start)

# use the Node.js image as the base, lts - stable Node version, alpine - lightweight linux distrubution - keeps your image small
FROM node:lts-alpine

# Sets the working directory inside the container, every following command will run relative to this directory
WORKDIR /src
# if /src not exist, docker creates it.

# copy only package*.json into the container at /scr, installing dependecies only needs these files
#! Docker cashes layer - if the source code changes but not packge.json, dependencies won't reinstall - faster builds
COPY package*.json ./ 

# install all dependencies listed in package.json
#! they get installed inside the container's filesystem under src/app/node_modules
RUN npm ci

RUN npm run build
# Copy the rest of the project files from my machine into the container 
COPY . . 

EXPOSE 3000
CMD [ "npm", "run", "start" ]
