# Use the slim version of the node 14 image as our base
FROM node:18-alpine

# Create a directory for our application in the container 
RUN mkdir -p /app

# Set this new directory as our working directory for subsequent instructions
WORKDIR /app

# Copy all files in the current directory into the container
COPY . .

# Set the PYTHONPATH environment variable, which is occasionally necessary for certain node packages
# 'PWD' is an environment variable that stores the path of the current working directory
ENV PYTHONPATH=${PYTHONPATH}:${PWD}

# Set the environment variable for the application's port
# (Be sure to replace '4200' with your application's specific port number if different)
ENV PORT 8080

ENV HOST 0.0.0.0

# Install 'serve', a static file serving package globally in the container
RUN yarn global add serve

# Install all the node modules required by the React app
RUN yarn
# Build the React app
RUN yarn build

# Serve the 'build' directory on port 4200 using 'serve'
CMD ["serve", "-s", "-l", "8080", "./dist"]