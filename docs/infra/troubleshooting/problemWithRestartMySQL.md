# Reinicialização do MySQL InnoDB Cluster após uma Queda Total

## Background e contextualização
Apesar dos serviços do Openstack oferecerem redundância, se a máquina toda desligar (por motivos de queda de energia ou outros), será necessário inicializá-la novamente com os seus serviços, incluindo o banco de dados. A resolução desse problema será tratada aqui.

## Descrição do problema 
Considerando que o banco de dados esteja fora do ar, com mensagens do tipo `Failed to connect to MySQL` com workload `blocked`, conforme mostra a imagem abaixo:

![erro innodb](/img/infra/troubleshooting/innodb-1.jpeg)


Veremos uma forma de solucionar esse problema.

## Resolução do problema
### Inicialização do MySQL InnoDB Cluster
Independente de como os serviços do MySQL InnoDB Cluster foram encerrados, seja por desligamento forçado ou queda de energia, é necessário realizar uma etapa de reinicialização especial para colocar o banco de dados da nuvem em funcionamento. O link abaixo fornece um passo a passo completo.
- https://docs.openstack.org/charm-guide/2023.2/admin/ops-start-innodb-from-outage.html

No nosso caso, bastou utilizar os comandos abaixo:
```sh
juju run mysql-innodb-cluster/0 reboot-cluster-from-complete-outage
juju run mysql-innodb-cluster/1 reboot-cluster-from-complete-outage
juju run mysql-innodb-cluster/2 reboot-cluster-from-complete-outage
juju run mysql-innodb-cluster/leader reboot-cluster-from-complete-outage
```
O resultado obtido foi:
![inicializacao innoDB](/img/infra/troubleshooting/innodb-2.jpeg)
 

### Permitir o acesso aos dados armazenados no Vault
O próximo passo consistiu em permitir o acesso aos dados no Vault. Isso acontece sempre que ele é inicializado pela primeira vez, até que seja liberado explicitamente. Novamente, o link abaixo auxiliou nesse processo: 
- https://docs.openstack.org/project-deploy-guide/charm-deployment-guide/ussuri/app-vault.html
```sh
juju run vault/0 restart

cat vault.txt

export VAULT_ADDR="http://10.84.0.11:8200"
vault operator unseal
```
Agora, nenhum erro é encontrado, todos os clusters estão online e sem workloads `blocked`, conforme mostra a imagem abaixo:
![innoDB instanciado](/img/infra/troubleshooting/innodb-3.jpeg)


## Conclusão 
Esta foi uma das formas encontradas para solucionar essa questão. Caso alguma forma complementar seja encontrada, sinta-se a vontade para sugerir a adição ao documento.