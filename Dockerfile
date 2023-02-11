FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production
RUN npm run email-build

# Only copy necessary items
COPY src/ src/
COPY emails_prod/ emails_prod/
COPY index.js ./

EXPOSE 8080
CMD [ "npm", "start" ]