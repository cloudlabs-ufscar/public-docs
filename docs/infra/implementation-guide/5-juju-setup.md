---
sidebar_position: 4
sidebar_label: "Setup do JUJU"
---

# Setup do JUJU

## Criando a VM para o Juju
O JUJU precisa de uma máquina para que possa fazer o bootstrap. Nesta VM o JUJU irá lançar uma série se serviços que iram coordenar todas as aplicações, fazer o download de 
charms etc. Em nosso caso caso, vamos criar uma VM no LXD para este papel.
1. Na web UI do MAAS na barra lateral entrar em LXD e depois clique no nome do projeto que criamos nos passos anteriores
3. Na nova tela, clique em `Add VM`
4. Coloque as seguintes configurações
- VM name: juju-machine (ou outro nome que indique que é VM do JUJU)
- Cores: 2 (mínimo)
- RAM: 4096 (mínimo)
Agora em `Storage configuration`
Size: 50GB (mínimo)
Para adicionar a VM, clique em `Compose Machine`. Aguarde um momento até que o LXD crie a sua VM e ela estará pronta.

Com a máquina criada vamos adicionar uma tag para instalar o Juju. Isso é necessário para o Juju encontrar a máquina onde vai fazer bootstrap.
1. Novamente nas configurações do lxdHost, clique no nome da VM do juju
2. Vá para a aba `Configuration` e, na área `Tags`, clique em `Edit`
4. Na barra de pesquisa digite o nome `juju` e depois em `Create tag "juju"`
5. Na janela aberta, simplesmente clique em `Create and add to tag changes`
6. Para adicionar a tag criada, clique em `Save`
7. Aguardar o _compose_ da máquina, até o status dela aparecer como ready

## Instalação do Juju
O JUJU é instalado via snap. Entretanto, diferente do apt, o snap não ter permissão de 
criar pastas na home. Desta forma, precisamos criar a pasta manualmente  
 ```sh
sudo mkdir -p ~/.local/share/juju
```
Mudar a propriedade da pasta para o user
```sh
sudo chown -R ubuntu:ubuntu ~/.local
```
Com o diretório criado, podemos instalar o JUJU
```sh
sudo snap install juju --channel 3.1
```

## Adicionando uma cloud
O JUJU precisa de uma _cloud_ para que ele possa lançar seus serviços. Entenda como
cloud qualquer substrato que o JUJU possa lançar VMs.

Em nosso caso vamos usar uma cloud hibrida de MAAS e LXD. Para lançá-la, precisamos criar um arquivo de configuração com as informações da cloud
```sh
nano juju-cloud.yaml
```
Nosso arquivo ficará dessa maneira
  ```yaml
  clouds:
    maas-one:
      type: maas
      auth-types: [oauth1]
      endpoint: http://10.42.0.1:5240/MAAS
  ```
Agora adicione a nuvem ao JUJU 
```sh
juju add-cloud --client -f juju-cloud.yaml maas-one
```
Adicionando a cloud, vamos adicionar as credenciais desta cloud.

Primeiramente, precisamos pegar a chave de autenticação do MAAS
1. Na web UI do MAAS, selecione o seu perfil na aba latera (em cima de `Log out`) e vá para a aba `API keys`
2. Clique no ícone de salvar, ela estará na sua área de transferência agora

Com a chave em mãos, podemos criar nosso arquivo
```sh
nano juju-cloud-credentials.yaml
```
Nosso arquivo de configurações deve ficar assim
```yaml
credentials:
    maas-one:
      anyuser:
        auth-type: oauth1
        maas-oauth: I
```
Cole a chave que você copiou em `I` 

Adicione as credencias ao JUJU
```sh
juju add-credential --client -f juju-cloud-credentials.yaml maas-one
```
## Realizando o bootstrap do Juju:
Agora sim podemos fazer o bootstrap.
> Por se tratar de um processo demorado, é útil que usamos o comando `tmux`, para
> que o comando continue rodando mesmo que a nossa conexão ssh caia. \
> Para sair do `tmux`, faça `ctrl + b` e depois `d`

```sh
juju bootstrap --bootstrap-series=jammy --constraints tags=juju maas-one maas-controller
```
> As constraints filtram os nós do MAAS, neste caso buscando somente máquinas com a tag juju\
> bootstrap-series define a _release serie_ do sistema operacional que vai ser instalado

## Adicionando um model
Por último, precisamos adicionar o model do openstack. Para o JUJU, model é como um projeto que isola
aplicações implantadas em models diferentes.
```sh
juju add-model --config default-series=jammy openstack
```
