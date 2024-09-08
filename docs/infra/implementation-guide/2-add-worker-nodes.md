---
sidebar_position: 2
sidebar_label: "Adicionando Worker Nodes"
---

# Adicionando computes
Com o MAAS configurado, agora já é possível adicionar os nós _workers_ ao MAAS.

## Preparando ambiente do MAAS
Apesar das facilidades do MAAS, o kernel padrão para pxe provido por ele não suporta nossas máquinas.
Para resolver isso vamos substituir o arquivo _lpxelinux.0_ padrão do MAAS por arquivo que dê suporte para nossas
máquinas.
1. Para isso, baixe ou clone o repositório do projeto (este que você está lendo agora) para o seu computador.

2. Copie o arquivo _lpxelinux.0_ para o nó controller
 ```sh
 scp -P 2002 path/to/lpxelinux.0 ubuntu@stratus.dc.ufscar.br:/home/ubuntu
 ```
3. Pare os serviços do maas
```sh
sudo snap stop maas
```
4. Apague a arquivo atual do _lpxelinux.0_
```sh
sudo rm /var/snap/maas/common/maas/boot-resources/snapshot-X-Y/bootloader/pxe/i386/lpxelinux.0
```
(onde X e Y são numeros aleatorios de cada instalação, use tab ao colocar `snapshot-` para autocompletar)

6. Mova o novo arquivo _lpxelinux.0_ para o mesmo path do que você apagou \
```sh
sudo mv {path arquivo}/lpxelinux.0 /var/snap/maas/common/maas/boot-resources/snapshot-X-Y/bootloader/pxe/i386/
```
7. Reinicie os serviços do MAAS
```sh
sudo snap restart maas
```
Atualizado o arquivo de PXE, o MAAS já deve ser capaz de operar as máquinas.
## Adicionando as máquinas físicas
O próximo passo é encontrar o IP dos BMCs das máquinas. BMC é um "mini computador" que fica atrelado ao nós
do cluster para fazer o gerenciamento e monitoramento das máquinas. Em nosso caso, queremos fazer um boot PXE 
nos nós, ou seja, um boot pela rede, de modo que consigamos gerenciar as máquinas remotamente.

Com o DHCP configurado na etapa anterior, os BMCs já receberam IPs que podem ser encontrados pelo controller.
Para isso, verifique usando o nmap
```sh
sudo nmap {Subnet do BMC} -T5
```
> Note aqui que o range vai ser definido pelo range que definimos nas etapas anteriores

> Note também que após achar duas máquinas e passar um tempo sem achar novas, pode-se parar o comando com `ctrl + c`

> Caso não seja possível usar o nmap, pode-se verificar o ip das máquinas no arquivo de concessões do MAAS, em
> `/var/snap/maas/common/maas/dhcp/dhcpd.leases`

Após achar os ips, deve-se verificar se os IPs encontrados são realmente de BMCs
```sh
ipmitool -I lanplus -H {IP do BMC} -U root -P root
```
Caso ele responda "no commands provides" este é o IP que estamos procurando

Reinicie as máquinas encontradas para ter certeza que o MAAS as encontrará
```sh
ipmitools -I lanplus -H {IP do BMC} -U root -P root power reset
```
Caso não tenha encontrado ainda, pode-se reiniciar o BMC delas
```sh
ipmitool -I lanplus -H {IP do BMC} -U root -P root mc reset cold
```
Agora no dashboard, pode-se adicionar as novas máquinas
1. Na aba `Machines`, clique em `Add hardware` e depois em `Machine`
2. Preencha as seguintes informações. Isso deve ser feito para os dois nós encontrados
* `Machine name`: _worker_ (0 ou 1, depende da máquina que estiver adicionando)
* `Power type`: IPMI
* `IP Address`: IP da máquinas que encontrou
* `Power user`: user do BMC
* `Power password`: senha do user do BMC
> Em nosso cluster, estamos usando o usuário e senha "root" por default
3. Deixe as demais configurações default, e clique em `Save machine`

A partir de agora o MAAS vai fazer o comissionamento das máquinas. Este é um processo na qual o MAAS
faz o levantamento de todos os recursos do da máquina, como rede e disco
