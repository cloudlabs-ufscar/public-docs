---
sidebar_position: 0
sidebar_label: "Configurando a rede do cluster"
---

## Passos para deploy completo do openstack usando MAAS + juju + lxd
1. Fazer a instalação/configuração dos nós no MAAS.
2. Fazer a configuração do DHCP das redes e as redes nos nós via MAAS.

> Para configurar as redes nos nós é preciso atribuir IPs fixos nas interfaces do controller e dos computes.

> Para criar o servidor DHCP será usado o MAAS posteriormente (o dhcp da rede de pxe e bmc será provido via maas).

> Para a rede de management, é necessário criar uma bridge, que será usada pelo lxd para conectar suas VMs à rede. (a bridge padão do lxd não pode ser controlada pelo MAAS).
> A configuração que antes era manual dentro dos controllers e computes agora é feita via maas que já injeta as configurações no netplan durante o deploy

3. Configuração do lxd no controller, e do lxd host no MAAS.
4. Configuração do juju
5. Deploy do bundle
6. Deploy dos overlays do Cinder e Nova Computes 

Desta maneira, mãos à massa.

# Configurando a rede do cluster
## Organização da rede
O primeiro passo da implantação será estabelecer as configurações de rede do cluster. Como indicado anteriormente, existirão quatro redes no cluster:

* Rede do BMC `vlan 100`: usada pelo MAAS para gerenciar os nós físicos via ipmi.
* Rede do PXE `vlan 101`: usada pelo MAAS para gerenciar os nós físicos e fazer boot pxe.
* Rede da DMZ `vlan 102`: usada para acessar os `controllers` e também para prover IPs públicos a instâncias da cloud.
* Rede de MGT `vlan 103`: usada pelo Maas, Juju, Lxd e OpenStack para prover os serviços da cloud.
A rede seguirá o seguinte diagrama:

![imagem redes do cluster](/guia-implantacao/4-aquitetura-da-rede.png)
