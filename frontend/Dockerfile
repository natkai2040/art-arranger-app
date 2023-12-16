FROM node:alpine
#stripped down node with alpine installed. 

RUN npm install -g pm2 
# also install pm2 runtime

WORKDIR /usr/app

#place we can identify and find

COPY ./package.json ./

RUN npm install

#Make sure you delere node_modules on host before building the image.

COPY ./ ./

#SVLETE MUST BUILD

RUN npm run build

CMD ["npm", "run", "docker-start"]