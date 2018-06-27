## Iniciar (pasta scripts):
sudo ./startFabric.sh

## Apagar (pasta network):
sudo ./teardown.sh

## Correr SDK (precisa Nodejs com fabric-client e fabric-ca-client):
node enrollAdmin.js
node registeruser.js

node query.js (ler a blockchain)
node invoke.js (inserir voto)

## Correr web service (pasta web_service):

node web_server.js

Requisitos:
npm install express

## Correr serviço invoke.js (pasta scripts) (necessário correr enrollAdmin.js e registerUser.js à mão antes) :  
node invoke.js 

Requisitos:
npm install fabric-client
npm install fabric-ca-client 
npm install express
npm install request

## Correr servidor http para a interface web (pasta web_ui):

Instalar um servidor http qualquer, ex: 

npm install http-server 

Correr o servidor (dentro da pasta web_ui) com CORS ativo, ex:

npx http-server -p 3000 --cors
(para correr na porta 3000)

## Nota:
Se os pacotes do npm não forem instalados globalmente, pode ser preciso instalar o mesmo pacote em várias pastas (todas em que é utilizado)


