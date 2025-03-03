FROM node:lts-buster

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    apt-get upgrade -y && \
    npm i -g pm2 && \
    rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /root/ernest

# Clone repository inside working directory
RUN git clone https://github.com/PeaseErnest12287/roleen.git .

# Copy package.json and install dependencies
COPY package.json .  
RUN npm install --legacy-peer-deps

# Copy the remaining project files
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
