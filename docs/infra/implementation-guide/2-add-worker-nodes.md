---
sidebar_position: 2
sidebar_label: "Adicionando Worker Nodes"
---

# Adicionando computes
Com o MAAS configurado, agora já é possível adicionar os nós _workers_ ao MAAS.
<!---
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
--->

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

# Configurando as redes:
Agora aba `Network`dentro das máquinas no maas, pode-se configurar as redes:
1. Na interface, no canto esquerdo clique na seta e depois `Edit Physical`
2. Selecione a fabric correta, tag da vlan se ela for tagged, subnet.
3. Configure ip de forma estática ou via dhcp:
   - para atribuiçao de endereços usando dhcp (dhcp snippets pode ser usado)
   - para atribuiçao de ips escolha `Static Assign`
   - para atribuiçao de ips automaticamente `Auto Assign` (mas nesse caso não temos controle do ip q a instância vai receber)
4. Para rede de management do openstack clique em Create Bridge e realize a mesma configuração.

Faça isso para todas as redes de todas as máquinas. E após esse processo faça o deploy das máquinas.

# Configurando o storage:
Agora aba `Storage` dentro das máquinas no maas, pode-se configurar os discos:
1. Na interface, crie uma partição `/` com pelo menos 200gb para o Controller
2. Crie uma partição para o OpenStack com pelo menos 500gb para criar as máquinas com serviços do OpenStack. (deixe como unformatted)
3. Crie uma partição para o Cinder para criar a VM do Cinder. (deixe como unformatted)

# Deploy das máquinas:
1. Na aba `Machines`, selecione as instâncias. **(Os compute nodes devem permanecer no estado Ready sem Deploy para posterior provisionamento)**
2. Clique em `Actions` > `Deploy`

# Criar o Rack Controller
1. Na aba `Controller`, clique em `Add controller`
2. Dentro da máquina que será o controller realize o processo indicado:
```sh
sudo snap install maas --channel=3.5
```
e depois
```sh
sudo maas init rack --maas-url http://{IP do Controller central}:5240/MAAS --secret {Token de Segredo do MAAS}
```
# Pós intalação

## Configuração de NAT para a rede de management
Apesar da rede de management ser local, ainda é necessário que as máquinas desta rede tenham acesso à internet. Para resolver isso, uma alternativa é usar um NAT,
ou seja, um protocolo que faz com que as máquinas dentro dessa rede "emprestem" o IP do gateway e possam se comunicar com o mundo externo.
Para fazer isso, pode-se usar o nftables.

Primeiramente, crie um diretório a qual possa se adicionar novos arquivos de configuração do nftables
```sh
sudo mkdir /etc/nftables.d
```

Agora, crie um novo arquivo com o NAT da rede 10.42.1.0/24
```sh
sudo nano /etc/nftables.d/nat_rede_mgmt.conf
```
Adicione a seguinte tabela
```conf
table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;
        ip saddr {bridge do openstack}/24 oif "eno2" snat to {IP público do controller};
    }
}
```
Adicione um import dessas configurações no arquivo principal do nftables
```sh
sudo nano /etc/nftables.conf
```
O arquivo deve ficar desta maneira
```diff
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
        chain input {
                type filter hook input priority 0;
        }
        chain forward {
                type filter hook forward priority 0;
        }
        chain output {
                type filter hook output priority 0;
        }
}

+ include "/etc/nftables.d/*.conf"
```
Por fim, reinicie o serviço do nftables
```sh
sudo systemctl restart nftables.service
```
E verifique se o serviço está funcionando
```sh
sudo systemctl status nftables.service
```
## Liberar forward entre as bridges
Por último, mas não menos importante, é necessário liberar forward de pacotes no sistema. Para isso, abra o arquivo de configurações do sysctl
```sh
sudo vim /etc/sysctl.conf
```
Adicione as seguintes linhas
```diff
# Uncomment the next line to enable packet forwarding for IPv4
# net.ipv4.ip_forward=1
+  net.ipv4.ip_forward=1

# Uncomment the next line to enable packet forwarding for IPv6
#  Enabling this option disables Stateless Address Autoconfiguration
#  based on Router Advertisements for this host
# net.ipv6.conf.all.forwarding=1
+  net.ipv6.conf.all.forwarding=1
```
> Dica: no vim a pesquisa é feita usando `Esc` -> `\` -> `Texto a ser pesquisado` ->
> `Enter` \
> Dica: no Nano, a pesquisa é feita usando `Ctrl + w` -> `Texto a ser pesquisado` -> `Enter`

Para aplicar as configurações, rode
```sh
sudo sysctl --system
```

Se tudo ocorreu bem, temos nossa rede pronta e funcionando. Agora podemos continuar prosseguindo com nossas configurações do cluster

> Faça o mesmo processo de provisionar dhcp via maas dessa vez usando o rack controller criado