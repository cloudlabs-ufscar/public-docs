---
sidebar_position: 1
sidebar_label: "Instalação e configuração do MAAS"
---

# Instalação e configuração do MAAS
## Introdução ao MAAS
MAAS, ou Metal as a Service, é um serviço da canonical criada para ajudar no gerenciamento de clusteres, desde a configuração de redes, criação de servidores
DHCP até a gestão de nós físicos.

## Setup do banco de dados do MAAS
Antes de mais nada, é necessário subir um banco de dados para o MAAS. Para isso, vamos usar o postgres, que pode ser instalado usando o comando
```sh
sudo apt install postgresql-14
```
Agora crie um usuário para o MAAS no postgres
```sh
sudo -iu postgres psql --command="CREATE USER {usuário do maas} WITH ENCRYPTED PASSWORD '{senha do usuário maas}'"
```
Crie um banco de dados para o MAAS
```sh
sudo -iu postgres createdb -O {user} maas
```
Pronto, agora já se pode instalar o MAAS, usando o banco de dados criado.

## Instalando o MAAS
Para fazer a instalação do MAAS, usa-se o pacote do _snap_
```sh
sudo snap install maas --channel=3.4/edge
```
Agora faça a inicialização do MAAS, usando o endpoint do banco de dados que criamos
```sh
sudo maas init region+rack --database-uri "postgres://{user}:{password}@localhost/maas" --maas-url "http://127.0.1.1:5240/MAAS"
```
> - A url deve ser _http_ pois não existe certificado SSL ou TLS instalado nesse endereço para se utilizar https.
> - Deve-se definir a MAAS URL com o IP localhost da maquina onde estamos `http://$(hostname -i):5240/MAAS` [127.0.1.1 default]

Com o MAAS inicializado, pode-se criar um usuário administrador do MAAS
```sh
sudo maas createadmin
```
> Preencha os campos que aparecerem username, password, email.

> O Campo SSH pode-se deixar vazio, pois vamos colocar a chave posteriormente

## Setup inicial no dashboard
Criado o admin, agora pode-se acessar o dashboard e concluir o setup inicial.
Em nossa configuração, deixamos o dashboard rodando na porta 5240. Para acessá-lo, logue novamente no controller criando um tunel para
o dashboard
```sh
ssh ubuntu@stratus.dc.ufscar.br -p 2002 -L 5240:localhost:5240
```
Agora, em seu computador, você terá um bind para o serviço do MAAS em seu localhost, na porta 5240, acessível em `localhost:5240`
Agora, você pode fazer login com a senha criada no comando `create-admin`. Feito isso, vamos fazer o setup inicial do MAAS

1. Coloque o DNS padrão como 8.8.8.8 e depois clique em `save and continue`
2. Escolha a versão 22.04 do ubuntu, depois selecione `amd64` e clique em `update selection` e por fim em `continue`
Agora, crie uma chave SSH para adicionar ao MAAS.
3. No terminal, rode
```sh
ssh-keygen
```
Pressione `Enter` para deixar tudo como default, é o bastante para nós.

4. Agora copie a chave pública recém criada
```sh
cat {path da chave}.pub
```
5. No MAAS, selecione `upload` em `Source`, cole a chave que você copiou em `Public key` e clique em `Import SSH key`
6. Por fim, clique em `Finish setup` para concluir.

Pronto, agora você tem um MAAS quase pronto. Só falta configurar o DHCP

## Configurando o DHCP do MAAS
O DHCP é um protocolo usado para distribuir IPs para máquinas de maneira dinâmica. Ele é necessário para realizar o boot PXE dos nós de compute,
além de permitir que as VMs do lxd recebam IPs na rede de maneira automática.
Na configuração atual, deve-se criar dois servidores DHCPs, um para a rede do BMC e outra para a rede de _management_. Repita o processo abaixo para 
ambas as redes.
> Em nosso cluster, criamos um servidor nas redes 10.42.0.0/24 e na rede 10.42.1.0/24
1. Na barra lateral do dashboard vá em Subnets
2. Clique em untaggeed na coluna VLAN da subnet que corresponde a que você está configurando
3. Clique em `Configure DHCP`
4. Selecione `MAAS provides DHCP`
5. Selecione `Provide DHCP from rack controller(s)` e escolha o controller que acabamos de criar
6. Escolha a subnet que criamos e defina um range pegando ao menos 50 IPs, excluindo somente o IP do controller, que foi definido na etapa anterior do guia.
8. Em gateway, coloque o IP do controller
Conclua clicando em `Configure DHCP`

Com isso a configuração inicial da máquina para instalação do MAAS está concluida.
