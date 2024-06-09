FROM node:18
WORKDIR /backend
COPY . .
RUN npm install
EXPOSE 8000
CMD ["node", "index.js"]
CMD ["npm", "start", "dev", "--host", "0.0.0.0", "--port", "8000"]
RUN npm run db:seeder
