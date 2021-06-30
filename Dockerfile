FROM node:12
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app
# Installing dependencies
COPY ./src/website/package.json ./
COPY ./src/website/package-lock.json ./
RUN npm install
# Copying source files
COPY ./src/website/. .
# Building app
RUN npm run build
EXPOSE 80
# Running the app
CMD [ "npm", "start" ]