---
sidebar_position: 3
sidebar_label: "Instalando o LXD"
---
# Instalando o LXD

## Instalação e inicialização do LXD
Em nosso setup, vamos usar um substrato hibrido usando MAAS e LXD. O LXD será usado pelo JUJU para lançar VMs com 
aplicações do OpenStack, como o neutron e o cinder

Provavelmente o LXD já vem instalado em nosso ubuntu, entretanto caso precise instalar:
```sh
sudo snap install lxd
```
Instalado o LXD, vamos incializar seu setup
```sh
sudo lxd init
```
Para as perguntas que aparecerem no terminal seguir os seguintes passos (default só dar enter):
- _Would you like to use LXD clustering?_ \
 **default** _(no)_ (maas já possui suporte para lxd clustering)
- _Do you want to configure a new storage pool?_ \
 **default** _no_ (criaremos posteriormente)
- _Would you like to connect to a MAAS server?_ \
 **default** _(no)_ (se conectar-se ao maas ele adicionará todas as máquinas como "new machines")
- _Would you like to create a new local network bridge or host interface?_ \
 **no** (nós queremos usar a bridge que criamos)
- _Would you like to configure LXD to use an existing bridge or host interface?_ \
 **yes** (agora sim colocamos nossa bridge)
- _Name of the existing bridge or host interface:_ \
 **br-mgmt** (a bridge do LXD será de nossa rede de management)
- _Would you like the LXD server to be available over the network?_ \
 **yes** (o LXD deve estar disponível para que o MAAS e o JUJU possa usar)
- _Address to bind LXD to:_ \
 **default** _(all)_
- _Port to bind LXD to:_ \
 **default** _(8443)_
- _Trust password for new clients:_ (nem sempre aparece)\
 **4159265**
- _Again_: \
 **4159265**
- _Would you like stale cached images to be updated automatically?_ \
 **default** _(yes)_
- _Would you like a YAML "lxd init" pressed to printed?_ \
 **default** _(no)_

## Conexão do LXD ao MAAS
4. Entrar na web UI do MAAS e na barra lateral entrar em `LXD` e depois em `Add LXD host`
5. Preencher com as seguintes informações
    - `Name`: lxdHost (nome de sua preferência)
    - `Zone`: **default**
    - `Resource pool`: **default**
    - `lxd address`: (o endereço da bridge criada)
    - selecione `Generate new certificate`
6. Clique em `Next`
7. Selecione `Add trust to lxd via cmd line` e copie o comando na caixa que aparecer até `EOF`
8. No terminal colar o comando copiado, garantindo que será rodado com `sudo`
```sh
sudo lxc config trust add - <<EOF

-----BEGIN CERTIFICATE-----
MIIE3DCCAsQCEQCGRGEb...
-----END CERTIFICATE-----

EOF
```
11. Prossiga clicando em `Check authentication`. Cheque se há um indicativo de `connected`.
13. Selecionar na opção `use existing project`, escolha o `default` e clique em `Save`
Seu host LXD deve estar configurado no MAAS, entretanto precisamos ter certeza que ele atende nossos requisitos para lançar nossas aplicações do OpenStack

## Criação das pools de storage
Para criar as pools vamos usar o lvm e mapear a partição previamente criada, ou discos secundários:
```sh
lxc storage create b-cinder lvm source=/dev/sdb
```
```sh
lxc storage create c-cinder lvm source=/dev/sdc
```
```sh
lxc storage create a-openstack lvm source=/dev/sda3
```

> a pool do openstack deve ser a default pois é a que o juju vai usar na criação das VMs do OpenStack

<!---
## Configurando o overcommit do LXD
Por padrão, o LXD vai usar somente um limite baixo de recursos (número de cores e quantidade de memória RAM). Para resolver isso, vamos liberar mais recursos para esse host

12. Na aba `LXD`, clique no nome de nosso host e vá para a aba `KVM host settings`

14. Deslize a barra de `CPU overcommit` para 2.0 e clique em `Save changes`

Desta maneira, temos certeza que o JUJU tem recursos o sufiente.
--->