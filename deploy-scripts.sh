git pull
npm run test
npm run build
aws s3 cp ./dist s3://safemystuff-client/ --recursive