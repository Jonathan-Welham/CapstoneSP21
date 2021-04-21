# Spin up the frontend and build it into static files
FROM node:latest as build
WORKDIR /app/frontend
COPY ./frontend ./
RUN npm install
# RUN npm run server

RUN npm run build
# CMD ["npm start"]

# Create the backend image 
FROM python:3.7
WORKDIR /app/backend
COPY ./backend/requirements.txt ./
RUN pip install --upgrade pip && \
    pip install -r requirements.txt	
COPY ./backend ./

# Copy the static frontend files to the backend
COPY --from=build /app/frontend/build ./build

# start the server
ENTRYPOINT ["python3"]
CMD ["app.py"]