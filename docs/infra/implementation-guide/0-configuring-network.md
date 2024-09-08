---
sidebar_position: 0
sidebar_label: "Configurando a rede do cluster"
---

# Configurando a rede do cluster
## Organização da rede
O primeiro passo da implantação será estabelecer as configurações de rede do cluster. Como indicado anteriormente, existirão três redes no cluster:
* Rede do BMC - usada pelo MAAS para gerenciar os _worker nodes_. Ela ficará na interface física `eno3` do _controller_
* Rede externa - usada para acessar o _controller_ e também para prover IPs públicos a instâncias da cloud. Ela ficará na `eno2` do _controller_.
* Rede de gerenciamento - usada pelo Maas, Juju, lxd e openstack para prover os serviços da cloud. Ela ficará na `eno1` do _controller_.
A rede seguirá o seguinte diagrama:

![imagem redes do cluster](/guia-implantacao/3-redes-do-cluster.png)

Para subir essa rede, é preciso atribuir IPs fixos nas interfaces do _controller_ para subir um servidor DHCP (que será feito usando o MAAS posteriormente).

Para a rede de management, também é necessário criar uma bridge, que será usada pelo Lxd para conectar suas VMs à rede.

Desta maneira, mãos à maassa.
## Configuração das interfaces físicas do _controller_
Primeiramente, deve-se configurar as interfaces físicas do cluster.

No terminal, examine a pasta de configurações do netplan para ver os arquivos de configuração existentes.
```sh
sudo ls /etc/netplan/
```
Aqui ficam todos os arquivos de configuração do netplan. Provavelmente haverá somente um, abra-o
```sh
sudo vim /etc/netplan/<nome do arquivo>.yaml
```
Suponha que este seja o arquivo de configuração
```yaml
network:
    ethernets:
        eno1: {}
        eno2:
            addresses:
            - {IP público do controller}
            nameservers:
                addresses:
                - {IP do gateway da rede externa}
                - 1.1.1.1
                - 8.8.8.8
            routes:
            - to: default
              via:  {IP do gateway da rede externa}
        eno3: {}
```
A interface `eno1` receberá uma bridge, por isso permanecerá inalterada neste arquivo.
Perceba que já existe um IP na `eno2`. Ele está sendo usado para acessar o _controller_ remotamente, deixe-o inalterado.

Já para a eno3, adicione o IP da rede de BMCs.
Deste modo, o arquivo ficará desta manera:
```diff
network:
    ethernets:
        eno1: {}
        eno2:
            addresses:
            - {IP público do controller}
            nameservers:
                addresses:
                - {IP do gateway da rede externa}
                - 1.1.1.1
                - 8.8.8.8
            routes:
            - to: default
              via:  {IP do gateway da rede externa}
-       eno3: {}
+       eno3:
+           addresses:
+           - {IP local da rede de BMCs}
```
> Em nosso cluster, convencionamos usar o IP 10.42.1.1/24 para o _controller_ na rede de BMCs

Saia do arquivo (`ctrl + x` -> `Y` no Nano ou `Esc` -> `:q` no vim)
## Configuração das bridges do _controller_
Por questão de organização, crie um novo arquivo para configurar a bridge
```sh
sudo vim 01-bridge-mapping.yaml
```
Nele, cole a seguinte configuração de bridge:
```yaml
network:
    bridges:
      br-mgmt:
        interfaces:
        - eno1
        addresses:
        - {IP do controller na rede de management}
```
> Em nosso cluster, convencionamos usar o IP 10.42.0.1/24 para o _controller_ a rede de _management_.

## Aplicando as novas configurações de interface
Antes de aplicar as alterações, é necessário se assegurar que o arquivo de configurações antigo, com a descrição das interfaces físicas, seja inicializado
antes que nosso arquivo com as bridges, pois, se a interface ainda não existe ainda não é possível criar uma bridge em cima dela.

Para isso, renomeie o arquivo original para um nome que começa com um numero menor do que aquele que criamos. Como o arquivo de bridges for criado com "01", 
o arquivo com as interfaces pode ser chamado, por exemplo, de "00-physical-interfaces.yaml"
```sh
sudo mv /etc/netplan/<nome-interface antiga>.yaml /etc/netplan/00-physical-interfaces.yaml
```

Agora aplique as alterações
```sh
sudo netplan try
```
> Note que aqui, como mexemos na iterface que a máquina usa para o ssh, vamos usar o `netplan try`, que reverte as alterações caso
> não haja uma confirmação do usuário.

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
sudo /etc/nftables.d/nat_rede_mgmt.conf
```
Adicione a seguinte tabela
```conf
table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;
        ip saddr 10.42.1.0/16 oif "eno2" snat to {IP público do controller};
    }
}
```
Adicione um import dessas configurações no arquivo principal do nftables
```sh
sudo /etc/nftables
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
