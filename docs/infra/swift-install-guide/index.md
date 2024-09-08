# Guia de Instalação do swift

## Planejamento do deploy

### Requisitos do swift

Por questões de redundância, o Swift pede uma implantação usando 3 zonas, ou seja, cada dado será replicado em 3 locais
diferentes, de modo que, se houve alguma problema em uma das zonas, as demais conseguem manter o funcionamento.

Para fazer isso, o Swift pede o deploy de três nós de _storage_, que será onde os dados são armazenados de fato, e um
nó de _proxy_, que servirá de interface e também de coordenador para o cluster.

### Organização dos nós

Para implantar isso em nosso cluster, temos que fazer uma adaptação: em nosso cluster, dispomos de um nó de controle
(_controller_) e de dois outros dois nós _workers_ (até o momento, nós os chamava de _compute_, mas agora também vão fazer
um papel de _storage_ nodes). Para o nó _proxy_, basta uma VM. Entretanto, para os _storage nodes_, é necessário ter discos
(físicos ou virtuais) para que o Swift possa usar diretamente. Deste modo, vamos usar cada um dos nós _workers_ e também uma
VM no controller. Esta VM é especial, pois ela terá os discos físicos dedicados a ela, como será apresentado adiante.
Portanto, resumindo:

- Swift _proxy_ - VM no controller
- Storage node 1 - nó físico 1
- Storage node 2 - nó físico 2
- Storage node 3 - VM no controller com discos dedicados a ela

### Organização dos discos

Além do desafio de não ter um terceiro nó físico, temos a seguinte questão: temos poucos discos disponíveis nos _workers_
e no _controller_ para alocar para o Swift. Mais especificamente, temos a disponibilidade de 3 discos de 280GB em cada nó
físico para usar no Swift. Logo, vamos ficar com a seguinte configuração

- _Worker node_ 1 - discos `sdb`, `sdc` e `sdc`
- _Worker node_ 2 - discos `sdb`, `sdc` e `sdc`
- _Controller node_ - discos `sdb`, `sdc` e `sdc`
  > Note que no _controller_ vamos usar os três discos para nossa VM de _storage node_

### Ferramentas

Em nosso cluster, atualmente usamos um setup de JUJU usando o MAAS e LXD como substrato. O MAAS vai gerencia as máquinas
físicas, enquanto o LXD cria VMs sob demanda.

> Note que usamos o MAAS para gerenciar o LXD, portanto a criação das máquianas será feita por lá

> Note também que, apesar dessa facilidade, a integração do LXD com o MAAS não nos dá todos recursos que precisamos,
> portanto vamos usar a CLI do LXD para outra parte do processo

Para o deploy do _Swift proxy_ e do _Swift storage_, vamos usar seus respectivos charms do JUJU.

Além disso, vamos usar alguns serviços do OpenStack que já temos instalados em nosso cluster para gerenciar, por exemplo
o _keystone_ para gerenciar identificação.

## Deploy

### Limpando os discos

Para que o Swift seja capaz de usar os discos, é necessário que não haja nenhum file system, senão haverão erros no deploy. Para resolver isso, vamos rodar o seguinte comando

> [!WARNING]
> Tenha certeza que não existe mais nenhum dado importante dentro dos discos, pois não será possível recuperá-los
> posteriormente

```sh
sudo sgdisk --zap-all /dev/sdx
```

Você deverá fazer isso nos dois nós _workers_ e também no _controller_.

Além disso, isso deve ser feito para todos os discos que serão usados pelo Swift

### Criando as VMs

#### VM do Swift proxy

Para o proxy node, não temos requisitos muito grandes. Portanto, vamos criar um VM simples.

1. No dashboard do MAAS, entre em `LXD` na barra lateral e clique no nome de nosso projeto no lxd (atualmente `openstack-lxd`)
2. Clique em `Add VM` e crie uma VM com os seguintes atributos

- `VM name` - swift-proxy (ou outro nome fácil de identificar)
- `Cores` - 4 (mínimo 2)
- `RAM` - 8192 (mínimo 4096)
- `Storage` - 20GB

3. Clique em `Compose machine` e espere o MAAS realizar o comissionamento da máquina (verifique na aba `Machines`)
4. Após terminar o comissionamento a máquina estará no estado `Ready`. Selecione a máquina, clique em `Actions` e depois em `Deploy`
5. Escolha Ubuntu como `OS` e escolha _ubuntu 22.04_ como `release` e clique em `Start deployment for machine`
   Pronto, nossa VM do _Swift proxy_ está pronta, vamos para a segunda máquina

#### VM do Swift storage

Para nossa segunda VM, repita os exatos mesmos passos da última máquina, se atentando somente ao nome que deve ser `swift-storage`
(ou outro nome significativo)

Agora vamos adicionar nosso discos físicos a ela . Para isso, faça ssh no controller e obtenha acesso ao terminal. Lá vamos fazer o seguinte:

1. Verifique o nome do projeto do LXD na máquina

```sh
lxc project list
```

> Note que, apesar de estar usando o LXD, o comando é lxc

2. Mude para o projeto correto. Ele é o mesmo que vimos ao criar a VM

```sh
lxc project swift {nome do projeto}
```

3. Verifique se a máquina que você criou está mesmo nesse projeto

```sh
lxc list
```

> Caso hajam muitas máquinas, talvez seja útil usar o comando `lxc list | grep {nome da VM}`

4. Pause a máquina para que você possa adicionar os discos

```sh
lxc pause {nome da máquina}
```

5. Adicione os discos que você reservou para o Swift. Faça isso para os discos `sdb`, `sdc` e `sdd`

```sh
lxc config device add {nome da VM} diskX disk source=/dev/sdx path=/dev/sdx
```

> Substitua o "x" de `sdX` pelos discos reservados para o swift

> Em nosso caso, diskX será diskB, diskC e diskD, mas você pode usar qualquer nome que quiser

> Você pode colocar o path dos discos em outros lugares no campo source, fizemos isso por questões de simplicidade

6. Por fim, verifique se os discos foram alocados corretamente para a máquina:
   Inicie a máquina novamente

```sh
lxc start {nome da máquina}
```

Aguarde alguns instantes para a VM bootar e verifique se os discos estão presentes

```sh
lxc exec {nome da máquina} lsblk
```

Em nosso caso podemos verificar nossos três discos lá

```sh
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0    7:0    0    87M  1 loop /snap/lxd/28373
loop1    7:1    0  38.8M  1 loop /snap/snapd/21759
loop2    7:2    0  63.9M  1 loop /snap/core20/2318
sda      8:0    0  18.6G  0 disk
├─sda1   8:1    0   512M  0 part
└─sda2   8:2    0  18.1G  0 part /
sdb      8:16   0 278.9G  0 disk
sdc      8:32   0 278.9G  0 disk
sdd      8:48   0 278.9G  0 disk
```

Pronto, temos nossa VM de storage com os três discos físicos alocados para ela

### Adicionando as máquinas ao JUJU

Com as máquinas criadas, agora precisamos adicioná-las ao JUJU para que ele possa instalar as aplicações do Swift. Para isso
precisamos antes ter o IP das VMs que criamos. Isso pode ser observado abaixo do nome das VMs no MAAS

![IP das VMs no MAAS](/img/deploy_swift_juju_1.jpeg)

Com os IPs identificados, adicione as máquinas no juju. Faça isso para as duas máquinas

```sh
juju add-machine ssh:{ip da máquina}
```

Caso o comando peça a seguinte confirmação:

```sh
The authenticity of host '10.42.128.48 (10.42.128.48)' can't be established.
ECDSA key fingerprint is SHA256:WiiKeongyU+3e9llWEpY0moBXbL4BJp3nexJ8SHRiKw.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```

Digite `yes` para todos os pedidos do comando e espere até que o comando finalize

Agora verifique se o juju adicionou de fato nossas máquinas

```sh
juju machines
```

<!-- ### Adicionando os _storage nodes_ físicos

Caso o seu storage node não seja um compute node como o nosso e já está adicionado, o processo é o seguinte

TODO: colocar o passo a passo de adicionar uma máquina física ao MAAS

Após isso, realize o mesmo procedimento das VM usando o `juju add-machine` -->

### Criando o arquivo de configuração

Como dito, vamos lançar 3 zonas de storage do swift, sendo que nas 3 teremos os discos `sdb`, `sdc` e `sdd`. Portanto,
vamos criar o seguinte arquivo de configuração do deploy

```yaml
# swift.yaml
swift-proxy:
  zone-assignment: manual
  replicas: 3
swift-storage-zone1:
  zone: 1
  block-device: /dev/sdb /dev/sdc /dev/sdd
swift-storage-zone2:
  zone: 2
  block-device: /dev/sdb /dev/sdc /dev/sdd
swift-storage-zone3:
  zone: 3
  block-device: /dev/sdb /dev/sdc /dev/sdd
```

Com ele, vamos fazer o deploy do swift proxy e dos três storages

### Identificando as máquinas

Para fazer o deploy nas máquinas corretas, precisamos pegar o índice das máquinas no JUJU. Para isso,
cheque o IP das máquinas no MAAS e identifique a máquina que tem esse IP na coluna `Adress` do comando `juju machines`

Por exemplo, em nosso output

```sh
Machine  State    Address       Inst id              Base          AZ       Message
12       started  10.42.128.47  manual:10.42.128.47  ubuntu@22.04           Manually provisioned machine
13       started  10.42.128.46  manual:10.42.128.46  ubuntu@22.04           Manually provisioned machine
14       started  10.42.128.48  manual:10.42.128.48  ubuntu@22.04           Manually provisioned machine
15       started  10.42.128.49  manual:10.42.128.49  ubuntu@22.04           Manually provisioned machine
```

Temos:

12 - storage node físico 1

13 - storage node físico 2

14 - proxy node

15 - storage node virtual (VM)

### Deploy

Identificados os IDs das máquinas, vamos para os deploys!
**swift proxy**

```sh
juju deploy --to {id da VM do swift proxy} --config ./swift.yaml swift-proxy
```

**swift storage node 1**

```sh
juju deploy --to {id do nó físico 1} --config ./swift.yaml swift-storage swift-storage-zone1
```

**swift storage node 2**

```sh
juju deploy --to {id do nó físico 2} --config ./swift.yaml swift-storage swift-storage-zone2
```

**swift storage node 3**

```sh
juju deploy --to {id do nó físico 3} --config ./swift.yaml swift-storage swift-storage-zone1
```

> Neste deploy optamos por lançar uma aplicação para cada zona de storage. Poderíamos optar também por lançar
> um só swift storage mas com 3 unidades

### Integrations

Por fim, falta setar as integrações

<!-- **TODO**: falta verificar as integrações com os outros serviços, como o keystone. Por hora está só entre o proxy e os storages -->

```sh
juju integrate swift-proxy:swift-storage swift-storage-zone1:swift-storage
```

```
juju integrate swift-proxy:swift-storage swift-storage-zone2:swift-storage
```

```
juju integrate swift-proxy:swift-storage swift-storage-zone3:swift-storage
```

E pronto, nosso deploy está feito! Você pode acompanhar o status em tempo real rodando

```sh
watch -c juju status --color
```

## Troubleshooting

Em caso de erro, os logs do charm ficam em `/var/log/juju`, em `unit-storage-zoneX-Y.log` no _swift storage_, enquanto no `unit-swift-proxy-X.log`.

## Referências

- deploy do swift usando juju: https://docs.openstack.org/charm-guide/2023.2/admin/storage/swift.html
- charm do swift proxy: https://charmhub.io/swift-proxy
- charm do swift storage: https://charmhub.io/swift-storage
