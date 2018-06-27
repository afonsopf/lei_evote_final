
set -ev

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d ca.org1.ec.com ca.org2.ec.com orderer.ec.com peer0.org1.ec.com peer0.org2.ec.com couchdb

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}


# Create the channel
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.ec.com/msp" cli peer channel create -o orderer.ec.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx

# Join peer0.org1.ec.com to the channel.
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.ec.com/msp" cli peer channel join -b mychannel.block


# Join peer0.org2.ec.com to the channel.
#docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.ec.com/msp" cli peer channel join -b mychannel.block

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.ec.com/msp" -it peer0.org1.ec.com sh -c "cd /host/var/run && peer channel create -o orderer.ec.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx && peer channel join -b mychannel.block" 

docker exec -e "CORE_PEER_LOCALMSPID=Org2MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.ec.com/msp" -it peer0.org2.ec.com sh -c "cd /host/var/run && peer channel join -b mychannel.block" 