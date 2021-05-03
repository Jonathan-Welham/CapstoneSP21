# FROM - Grab the latest node image and set it as a variable
FROM node:latest as build

# WORKDIR - Tells us where the directory inside the docker container we will be working in
WORKDIR /app/frontend

# COPY - Copy HOST location -> Container location
COPY ./frontend ./

# Installs npm and builds our application into production code
RUN npm install -g npm@7.10.0
RUN npm run build

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