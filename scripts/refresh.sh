echo "Refreshing..."
sudo kill -9 $(sudo lsof -t -i:3000)
sudo kill -9 $(sudo lsof -t -i:5433)
docker-compose down --volumes --remove-orphans
docker-compose up --build