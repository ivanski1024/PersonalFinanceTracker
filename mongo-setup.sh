  # 1. Add the MongoDB GPG key                                                                                 
  curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor                                                         
                                                                                                             
  # 2. Add the repo                                                                                            
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

  # 3. Update and install
  sudo apt-get update && sudo apt-get install -y mongodb-org

  # 4. Start the service
  sudo systemctl start mongod