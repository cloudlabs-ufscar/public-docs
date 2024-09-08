---
slug: "deployment_guide"
---

# Guia de Implantação
## O que é OpenStack
OpenStack é um conjunto de serviços (uma stack) usado pra servir uma cloud, indo desde serviços como provisionamento de VMs (ou instâncias), gerenciamento de redes e armazenamento. No deployment a seguir, será provisionada uma instalação completa, com serviços de compute através do nova, serviços de rede através do neutron, etc.

## Visão geral
O coração deste deploy é o Juju: ele é uma ferramenta de orquestração capaz de lançar e monitorar serviços através de charms, sendo capaz de instanciar tanto máquinas físicas como VMs de maneira transparente e integrada.

Como subtrato para o Juju, optamos por usar uma combinação de MAAS e LXD, de modo que usaremos os serviços base do OpenStack ficam em VMs no nó de controller e os serviços de compute e storage são distribuídos nas demais máquinas físicas, o _worker nodes_

## Organização física
Em nosso cluster, contamos com 3 nós físicos, que irão exercer os seguintes papeis:
* Controller - provisiona os serviços, mantém os serviços essenciais da cloud e serve de ponto de controle para as máquinas
* Workers - Sobem instâncias (compute) para os clientes e também executam os serviços de storage.

## Organização das redes
Para que todos serviços funcionem de maneira ideal, a rede do cluster foi segmentada em três:
* BMC - usada para gerenciamento dos nós workers pelo MAAS
* Gerenciamento - usada para comunicação dos Lxd, JUJU, Juju e os serviços do OpenStack
* Externa - usada para acesso no controller, assim como atribuição de IPs públicos a instâncias dos clientes
Deste modo, a arquitetura da rede será a seguinte:
![Arquitetura da rede do cluster](/guia-implantacao/1-arquitetura-da-rede.png)

## Organização dos serviços
Como mencionado, o Juju usará como substrato uma cloud de Lxd e MAAS. Ambas tecnologias apresentam uma integração muito grande, o que permite que todo o processo de provisionamento de máquinas (físicas e virtuais) seja feito de maneira transparente para o Juju. Além disso, o MAAS também disponibiliza serviços de redes, que serão usados durante todo o deployment

Para o Juju, será usado um bundle que faz todas as integrações, além de lançar os serviços nas localizações corretas.
Deste modo, a arquitetura basica do deploy é esta:
![Arquitetura dos serviços](/guia-implantacao/2-arquitetura-dos-serviços.png)

