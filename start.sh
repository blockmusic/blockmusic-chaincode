CONTRACT_NAME="chaincode"
clear
rm -r wallet

docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)


docker rmi $(docker images |grep 'peer0')


cd ./network/basic-network
./start.sh


cd ..
cd ./configuration/cli
docker-compose -f docker-compose.yml up -d cliFabric

sleep 5

echo "Installing chaincode..."
docker exec cliFabric peer chaincode install -n ${CONTRACT_NAME} -v 0 -p /opt/gopath/src/github.com -l node
echo "Instantiating chaincode..."
docker exec cliFabric peer chaincode instantiate -n ${CONTRACT_NAME} -v 0 -l node -c '{"Args":[""]}' -C mychannel -P "AND ('Org1MSP.member')"
echo "Invoking chaincode..."
sleep 10
docker exec cliFabric peer chaincode invoke -n ${CONTRACT_NAME} -c '{"function":"createAlbum","Args":["About me", "Me", "How i know", "Me"]}' -C mychannel
sleep 10
echo "Querying chaincode..."
docker exec cliFabric peer chaincode query -C mychannel -n ${CONTRACT_NAME}  -c '{"Args":["queryAssetsByType", "Album"]}'

