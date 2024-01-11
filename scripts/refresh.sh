echo "Refreshing..."
docker-compose down --volumes --remove-orphans
docker-compose up --build -d
npx prisma db pull
npx prisma generate