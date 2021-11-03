# Use Node v8 as the base image.
FROM node:10.20.0

#COPY [--chown=root:root] . .
COPY . .


RUN npm install --save

CMD ["npm", "run", "serve"]