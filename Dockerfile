FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production
RUN npm run email-build

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]