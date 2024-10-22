---
sidebar_position: 5
sidebar_label: "Realizando deploy do OpenStack"
---
# Realizando deploy do OpenStack

## Configurando os computes
Antes de tudo, é necessário ter certeza de quais serviços o JUJU vai instalar nos computes. Em nosso deploy, 
só instalaremos os charms "nova-compute" e "ovn-chassis" nos computes físicos. Para impedir que o JUJU instale
qualquer outro serviço nelas, precisamos alocar as máquinas para impedir que ela faça deploy nos computes
1. No dashboard do MAAS, vá para a aba de `Machines` e selecione nossos dois computes
2. No botão `Actions`, clique em `Allocate`
> Uma das principais qualidades deste deploy é justamente que o JUJU não diferencia computes físicos de VMs do LXD.
> Entretanto, em nosso caso isso acaba sendo um problema

## Baixando o bundle
Com nosso JUJU funcionando, agora podemos fazer deploy do OpenStack! Para simplificar as coisas, fizemos um bundle que 
contém informações sobre VMs, charms e relações que as aplicações do OpenStack precisam para funcionar.

1. Baixe ou clone o repositório do projeto para o seu computador (vamos ver como vamos fazer isso ainda)
2. Passe as pasta de deploy para o controller
## Realizando os deploys

### Bundle principal
Com o bundle baixado, basta rodar 
```sh
juju deploy ./bundle.yaml
```
Para acompanhar o status do deploy
```sh
watch -c 'juju status --color'
```
```sh
watch -c 'juju machines --color'
```


# Realizando deploy do OpenStack manualmente
### Bundle do cinder
Ao terminar deploy do bundle realizar deploy do cinder. Para ele, precisamos de uma máquina especial
1. No MAAS, vá na aba `LXD`, clique em nosso host do lxd e por fim `Add VM`
2. Coloque as seguintes configurações
- `VM-name`: cinder-vm
- `Cores` : 4
- `RAM`: 4096MB
- `Disk`: 20GB (esse será para boot)
- `Disk` (clique em `Add disk` para adicionar o segundo): 512 GB
Adicione-a em `Compose machine` e espere o MAAS realizar o comissinion.

Agora, pode-se verificar essa máquina no JUJU rodando
```sh
juju machines
```
Espere um tempo, se o JUJU não reconhecer elas no `juju machines`, faça o seguinte processo:
1. Crie uma chave ssh no controller
```sh
ssh-keygen
```
2. Clique `Enter` para deixar todas as opções default, não precisamos delas
3. Pegue o path que a chave foi criada. Isso é mostrado durante a geração da chave
4. Copie sua chave pública. Por exemplo, se nossa chave foi criada em `/home/ubuntu/.ssh/id_rsa`,
vamos rodar o seguinte comando
```sh
cat /home/ubuntu/.ssh/id_rsa.pub
```
5. No dasboard, vá na aba de se usuário, depois em `SSH Keys` e clique em `Import SSH key` 
6. Na caixa de seleção, selecione `upload`, cole a chave que você copiou no campo `Public key` e clique em `Import SSH key`
A partir de agora, qualquer máquina que sofrer deploy do MAAS terá sua chave, permitindo que você faça ssh nelas

Agora, vamos fazer um deploy manual dos computes
1. Em `Machines`, selecione o cinder-vm, clique em `Actions` e depois em `Deploy`
> Se a máquina não estiverem como `Ready`, clique em `Release` e repita o processo
2. Selecione a versão 22.04 do ubuntu em `Release` e clique em `Start deployment` e aguarde.

Após a máquina terminar o deploy, verifique se você tem acesso a ela de seu controller. Pegue o IP dela (abaixo de seu nome) e tente dar ssh nela. 
Vamos supor que o IP dela é 10.42.128.0
```sh
ssh ubuntu@10.42.128.0
```

Agora, vamos adicioná-la ao JUJU.
```sh
juju add-machine ssh:ubuntu@{vm_ip}
```

> Substitua _vm_ip_ pelo IP da VM.

O output deste comando será o índice ela. Mas se caso você perder este output, rode o comando
```sh
juju machines
```
Verifique na coluna `Inst id` qual possui `cinder-vm`. Nesta máquina, você achará o índice dela na coluna `Machine`
Agora, faça o deploy, passando em `I` o íncide da máquina que você encontrou
```sh
juju deploy --to I --channel 2023.2/stable --config ./OpenStackBundle/cinder.yaml cinder
```
Em seguida realizar deploy do cinder-lvm (backend para gerenciamento de volumes).
```sh
juju deploy --channel 2023.2/stable --config ./OpenStackBundles/cinder-lvm.yaml cinder-lvm
```
Agora precisamos realizar deploy da aplicação mysql-router, para juntar o cinder a base de dados
```sh
juju deploy --channel 8.0/stable mysql-router cinder-mysql-router
```
Por fim realize as integrações do cinder:
mysql-router:
```sh
juju integrate cinder-mysql-router:db-router mysql-innodb-cluster:db-router
```
```sh
juju integrate cinder-mysql-router:shared-db cinder:shared-db
```
Cinder :
```sh
juju integrate cinder:cinder-volume-service nova-cloud-controller:cinder-volume-service
```
```sh
juju integrate cinder:identity-service keystone:identity-service
```
```sh
juju integrate cinder:amqp rabbitmq-server:amqp
```
```sh
juju integrate cinder:image-service glance:image-service
```
```sh
juju integrate cinder:certificates vault:certificates
```
Cinder-lvm:
```sh
juju integrate cinder-lvm:storage-backend cinder:storage-backend
```
## Deploys nos computes

Feitos os deploys dos outros serviços, podemos fazer deploy das aplicações
que vão diretamento nos computes.

### Configurando os computes
Primeiramente, precisamos desalocar os computes no MAAS para que o JUJU possa usar
1. No dashboard do MAAS, vá para a aba de `Machines` e selecione nossos dois computes
2. No botão `Actions`, clique em `Release`
Agora espere alguns instântes. Se o JUJU não identificar o IP delas no `juju machines`, faça o mesmo que você fez com a `cinder-vm`,
mas para ambos os computes.

## Lançando as aplicações
Agora com nossos computes adicionados, vamos fazer o deploy neles. Para isso, precisamos saber seus índices no JUJU. Para isso rode
```sh
juju machines
```
Verifique o IP do computes e verifique qual é o índice deles. Com eles em mãos, rode o comando, substituindo `I` pelo índice dos computes. Faça isso para ambos
```sh
juju deploy --to I --channel 2023.2/stable --config ./OpenStackBundles/nova-compute.yaml nova-compute
```
Ao terminar deploy do nova, realizar deploy do  ovn-chassis.

O processo é exatamente o mesmo, basta rodar substituir `I` pelo índice dos computes
```sh
juju deploy --channel 23.09/stable --config ./OpenStackBundles/ovn.yaml ovn-chassis
```

Por fim, vamos realizar as integrações dos serviços
Nova
```sh
juju integrate ovn-chassis:nova-compute nova-compute:neutron-plugin
```
```sh
juju integrate rabbitmq-server:amqp nova-compute:amqp
```
```sh
juju integrate nova-cloud-controller:cloud-compute nova-compute:cloud-compute
```
```sh
juju integrate glance:image-service nova-compute:image-service
```
Ovn-chassis:
```sh
juju integrate ovn-chassis:ovsdb ovn-central:ovsdb
```
```sh
juju integrate ovn-chassis:certificates vault:certificates
```

Dessa maneira, temos todos nosso serviços rodando e prontos. Precisamos somente resolver questões da vault.

## Inicializando a vault
A vault é nosso serviço de certificados. Os certificados são usados para autenticar as comunicações entre nossas aplicações.

Para usar a vault, precisamos primeiro inicializá-la. Para isso, vamos entrar na VM que seu serviço está rodando
```sh
juju ssh vault/0
```
Agora vamos criar uma variável para indicar à vault onde seu serviço irá rodar. No caso, na própria máquina
```sh
export VAULT_ADDR=http://127.0.0.1:8200
```
Agora vamos criar nossas credenciais
```sh
vault operator init --key-shares=1 --key-threshold=1
```
a saída desse comando é algo como:
```
Unseal Key 1: LuyA...

Initial Root Token: s.GhHdnG2QvRl...

Vault initialized with 1 key shares and a key threshold of 1. Please securely
distribute the key shares printed above. When the Vault is re-sealed,
restarted, or stopped, you must supply at least 1 of these keys to unseal it
before it can start servicing requests.

Vault does not store the generated master key. Without at least 1 keys to
reconstruct the master key, Vault will remain permanently sealed!

It is possible to generate new unseal keys, provided you have a quorum of
existing unseal keys shares. See "vault operator rekey" for more information.
```
Note que, assim como dito, a senha de unseal pode ser gerada novamente somente se você estiver de posse de uma.
salve essa chave em algum muito seguro, pois, se você a perder, você nunca mais poderá _unseal_ a vault 

Além disso, também temos o `Root Token`. Ele será usado para nos atenticarmos em alguns passos. Salve-o também.

Agora, vamos desbloquear a vault. Vamos usar aquela unseal vault que criamos, substituindo-a em `I` 
```sh
vault operator unseal <I>
```

Nossa operação dentro da VM está concluída, você sair da sessão e voltar ao controller.
Agora vamos liberar o acesso do JUJU à vault. Substitua em `I` o `Root Token` que você pegou no mesmo comando
```sh
juju run vault/leader authorize-charm token="I"
```
Por fim, vamos gerar um certificado de root
```sh
juju run vault/leader generate-root-ca
```
Agora pronto, é só esperar que todos os serviços se "acomodem". Isso pode demorar um tempo, portanto descanse, e espere. 
> Para os ansiosos, pode-se usar o comando `watch -c juju status --collor ` 
