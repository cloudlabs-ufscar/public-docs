---
sidebar_label: JUJU
---

# Handbook de JUJU

## O que é o JUJU?

Juju é uma "Engine de orquestração" usada para gerenciar aplicações encapsuladas em "charm". Este é handbook apresenta os principais comandos e workflows necessários para se operar o JUJU.

## Nomenclatura

Para termos certeza que estamos falando da mesma coisa, vamos definir os nomes
* charm: "imagem" de uma aplicação, ou seja, uma aplicação envelopada com uma interface simplificada. Por exemplo, ovn-chassis
* aplicação: o serviço que é rodado dentro de um charm. Por exemplo, ovn-chassis, neutron-api
* unidade: instância de um charm que recebeu deploy. Por exemplo, ovn-chassis/0, ovn-chassis/1, neutron-api/2

## Comandos
Esta seção mostra os principais comandos de JUJU, seus parâmetros e como escrever seus arquivos de configurações, caso hajam.

### juju add-cloud
> Adicionar um novo substrato
Adiciona uma nova cloud ao JUJU, ou seja, um novo substratos para que o juju possa lançar seus charms
```bash
juju add-cloud <nome da cloud> <arquivo de descrição da cloud .yaml>
```
Para isso, é necessário um arquivo .yaml descrevendo esta cloud
```yaml
clouds:
  <nome_cloud>
    type: <tipo>
    auth-types: [<types>, ...]
    endpoint: <cloud>
```

**atributos do arquivo**

nome_cloud→nome arbitrário que podemos dar à cloud para melhor identificação

type→indica o tipo de cloud que se está adicionando

- lxd, maas

auth-types→Indica os tipos de autenticação que essa cloud aceita

- interactive, oauth, certificate

endpoint→Indica a url do serviço

- url, ip

### juju add-credential
> Adicionar credenciais de uma cloud
Adiciona as credenciais da cloud para que o JUJU possa acessar
```bash
juju add-credential <nome da cloud> -f <arquivo com as credenciais .yaml>
```
Para se adicionar as credenciais, é necessário criar um .yaml descrevendo-as
```yaml
credentials:
  <nome-cloud>:
    <user>:
      auth-type: <tipo>
      <value>
```
**atributos**

user→indica o user a qual o JUJU irá tentar logar

auth-type→tipo de autenticação. Deve bater com o descrito no .yaml do add-cloud

- interactive, oauth, certificate

value→indica a “senha”. Seu valor depende do tipo de autenticação usada

- interactive→senha em plain text
- 0auth→maas-oauth: api_key

### juju bootstrap
> Inicializar o juju

Para que o juju possa realizar suas atividades, ele precisa de um *controller* em um substrato, para que possa lançar os serviços.
O bootstrap “instala” o JUJU neste substrato para que ele possa gerenciá-lo
```sh
juju bootstrap <nome da cloud>
```

### juju switch
> Mudar o model atual
Muda o model atual. Por default, todos tem o “controller”
```sh
juju switch <nome do model>
```

### juju controller
> Informações e configurações dos controller

Mostra os controllers presentes no juju atual
```sh
juju controller
```

### juju download

> Baixar um charm no diretório atual

```sh
juju download <charm>
```

### juju deploy
> Realizar o deploy de um charm.
```sh
juju deploy <nome_charm ou ./arquivo.charm>
```
Se o charm não estiver disponível localmente, faz o download na hora
**tags**
: -n `<int>` indica quantas instâncias (units) daquela aplicação serão lançadas
- --to `<int>` indica uma machine específica para lançar a aplicação
> Note que não é possível usar as duas tags ao mesmo tempo, e nem a tag `--to` para duas máquinas
> desse modo, é preciso usar o comando `deploy` e depois o comando `add-unit`.

### juju add-unit
> Adicionar uma nova instância de uma aplicação já rodando
```sh
juju add-unit <aplicação>
```
> Aqui também podemos usar a tag `--to` para definir para qual máquina o juju vai fazer o deploy, ou a tag `-n` para 
> especificar quantas unidades, mas não ambas simultaneamente

### juju remove-aplication
> Remover uma aplicação rodando
```sh
juju remove-application <aplicação>
```

### juju debug-log
> Debug em tempo real do juju
Abre uma seção em tempo real com os logs dos eventos que estão acontecendo no JUJU
```sh
juju debug-log
```
### juju config
> Gerenciamento das configurações de um charm

#### Mostrar configurações
```sh
juju config <nome da aplicação>
```
Para salvar as configurações para editá-las, pode-se salvar as configurações em um arquivo
```sh
juju config <nome da aplicação> >> configs.yaml
```
Essa saída tem um formato yaml, como o abaixo, do ovn-chassis
```yaml
application: ovn-chassis
application-config:
  trust:
    default: false
    description: Does this application have access to trusted credentials
    source: default
    type: bool
    value: false
charm: ovn-chassis
settings:
  bridge-interface-mappings:
    description: |
      A space-delimited list of key-value pairs that map a network interface MAC address or name to a local ovs bridge to which it should be connected.
      Note: MAC addresses of physical interfaces that belong to a bond will be resolved to the bond name and the bond will be added to the ovs bridge.
      Bridges referenced here must be mentioned in the `ovn-bridge-mappings` configuration option.
      If a match is found the bridge will be created if it does not already exist, the matched interface will be added to it and the mapping found in `ovn-bridge-mappings` will be added to the local OVSDB under the `external_ids:ovn-bridge-mappings` key in the Open_vSwitch table.
      An example value mapping two network interface mac address to two ovs bridges would be:

          br-internet:00:00:5e:00:00:42 br-provider:enp3s0f0


      Note: OVN gives you distributed East/West and highly available North/South routing by default.  You do not need to add provider networks for use with external Layer3 connectivity to all chassis.
      Doing so will create a scaling problem at the physical network layer that needs to be resolved with globally shared Layer2 (does not scale) or tunneling at the top-of-rack switch layer (adds complexity) and is generally not a recommended configuration.
      Add provider networks for use with external Layer3 connectivity to individual chassis located near the datacenter border gateways by adding the MAC address of the physical interfaces of those units.
    source: user
    type: string
    value: br-ex:eno1 br-pub:eno2
  debug:
    default: false
    description: Enable debug logging
    source: default
    type: boolean
    value: false

```
Cada uma dessas configurações podem ser vistas no site do charmhub do charm. No exemplo do ovn-chassis, temos no site
`https://charmhub.io/ovn-chassis/configuration`


#### Definir configurações
Para definir as configurações diretamente, usa-se o seguinte comando:
```sh
juju config <aplicação> <configuration>=<value> <configuration>=<value> ....
```

#### Setar configurações a partir de um arquivo
Para configurações mais extensas, é útil usar um arquivo de configuração, que pode ser exportado do charm (como foi mostrado no exemplo acima)
```sh
juju config <aplicação> --file config.yaml
```
É importante verificar se o charm tem alguma action (próximo comando) para reiniciar as aplciações, já que por vezes isso é necessário para aplicar
as configurações feitas.
Além disso, perceba que rodamos o comando em cima de uma aplicação, não de uma unidade (instância rodando). Desta maneira, quando uma configuração 
é feita ela é aplicada para todas unidades daquela aplicação

### juju actions

> Listar ações

Em juju, cada charm apresenta uma lista de ações que podem ser executadas para gerenciar a aplicação do charm. \
Este comando lista as ações disponíveis de um charm
```sh
juju actions <charm>

```
Além disso, assim como as configs, as actions são listadas na página do cham no charmhub.\
Em nosso exemplo do ovn-chassis, temos elas listadas em `https://charmhub.io/ovn-chassis/actions`

### juju run

> Executar uma action em uma instância de uma aplicação

Sabida a action que se quer rodar, podemos executá-las com o comando

```sh
juju run <unidade> [<unidade>, ...] <ação> <flags>
```
Repare que aqui estamos falando de unidade, não de charm. Isso é porque os comandos vão ser executados em um 
Por exemplo, se temos 3 instâncias do charm do ovn-chassis rodando, sendo elas ovn-chassis/0, ovn-chassis/1, ovn-chassis/2,
e queremos reiniciar as três
```sh
juju run ovn-chassis/0, ovn-chassis/1, ovn-chassis/2 restart-services
```