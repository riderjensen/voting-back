FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Build email templates
RUN ./node_modules/.bin/maizzle build production

EXPOSE 8080
CMD [ "npm", "start" ]