# Tutorial: Configurando Ceph como Backend de Storage para Incus
Este tutorial detalha o processo de instalação e configuração de um cluster Ceph para ser utilizado como um backend de armazenamento compartilhado por um cluster Incus. Para mais informações em geral, acesse a documentação do Ceph [aqui](https://docs.ceph.com/en/latest/).

## Instalação dos Pacotes Essenciais
O primeiro passo é garantir que todos os nós que farão parte do cluster Ceph (incluindo o nó de bootstrap) tenham os pacotes necessários. Em todos os nós do futuro cluster Ceph, execute:
``` bash
sudo apt update && sudo apt install -y cephadm podman lvm2
```

Cephadm é a ferramenta de orquestração que simplifica a instalação e o gerenciamento de um cluster Ceph, utilizando contêineres, sendo o recomendado pela documentação oficial para deplay (leia mais [aqui](https://docs.ceph.com/en/latest/install/)); Podman é o runtime de contêineres que o cephadm utiliza para executar os daemons (serviços) do Ceph; Lvm2 é o conjunto de ferramentas para gerenciar o LVM (Logical Volume Manager), necessário se você optar por usar partições em vez de um disco completo para o Ceph.

## Preparando os Discos para os OSDs
Um OSD (Object Storage Daemon) é o processo do Ceph que armazena os dados e gerencia a replicação e recuperação. Cada disco ou partição de dados precisa ser preparado para recebe-los. Apesar de por padão o Ceph aceitar apenas discos físicos (ex: ```/dev/sda```) é possível criar uma abstração por meio de volumes lógicos para "enganar" o Ceph.

### Alternativa A: Usando LVM em uma Partição
Este método é ideal quando você quer usar apenas uma parte de um disco, permitindo maior flexibilidade. Apesar disso, o LVM cria uma camada adicional entre o sistema operacional (e o Ceph) e o disco físico. Dessa forma, o desempenho certamente será inferior em comparação com a forma padrão. Execute os seguintes comandos em cada nó do futuro cluster que usará uma partição específica.

Limpe completamente a partição para remover sistemas de arquivos ou metadados antigos. Isso previne erros durante a criação do OSD. Execute estes comandos em cada nó do futuro cluster, ajustando o nome da partição (ex: ```/dev/sdb2```):
```bash
sudo wipefs -a <Caminho Partição>
sudo dd if=/dev/zero of=<Caminho Partição> bs=1M count=10
```

Inicialize a partição como um Physical Volume (PV) para que o LVM possa gerenciá-la:
```bash
sudo pvcreate <Caminho Partição>
```

Crie um Volume Group (VG), um agrupamento de PVs. Usar o hostname no nome. Ajuda a identificar facilmente a qual nó o VG pertence:
```bash
sudo vgcreate ceph_vg_<Nome Host> <Caminho Partição>
```

Crie um Logical Volume (LV) que ocupa todo o espaço livre no VG. É neste volume lógico que o OSD será efetivamente criado:
```bash
sudo lvcreate -l 100%FREE -n osd_lv ceph_vg_<Nome Host>
```

### Alternativa B: Usando um Disco Inteiro (Abordagem Simples)
Se você tem um disco inteiro (ex: ```/dev/sdb```) dedicado para o Ceph em cada nó, o processo é mais direto. Você só precisa garantir que ele esteja limpo.

Limpe o disco para garantir que sistemas de arquivos ou metadados antigos sejam removidos, previnindo erros durante a criação do OSD:
```bash
sudo wipefs -a <Caminho Disco>
sudo dd if=/dev/zero of=/dev/sdb bs=1M count=10
```

## Criando e Configurando o Cluster Ceph
As operações a seguir devem ser executadas a partir de um único nó, que será o nó de bootstrap. Este nó irá gerenciar a configuração inicial e a adição de outros nós (leia mais [aqui](https://docs.ceph.com/en/reef/cephadm/install/#running-the-bootstrap-command)). Este comando inicializa o cluster, criando o primeiro nó Monitor e o Manager. Substitua o IP, porta, o usuário e a senha do dashboard conforme sua necessidade:
```bash
sudo cephadm bootstrap --mon-ip <IP Boostrap> \
--cluster-network <Rede>/<Máscara> \
--initial-dashboard-user <Usuário> \
--initial-dashboard-password <Senha> \
--ssl-dashboard-port <Porta>
```

Por que esses parâmetros?
 - ```--mon-ip```: Define o IP do nó que hospedará o primeiro Monitor (MON), o cérebro do cluster.
 - ```--cluster-network```: Especifica a sub-rede que o Ceph usará para tráfego interno, como replicação de dados. É crucial caso você tenha mais de uma rede conectada ao seu cluster.
 - ```--initial-dashboard-user``` e --initial-dashboard-password: Criam as credenciais de acesso para o Dashboard web do Ceph, uma ferramenta poderosa para monitorar e gerenciar o cluster.
 - ```--ssl-dashboard-port```: Define a porta que o Dashboard será acessado. Essa é configuração é importante pois ele pode atribuir a porta 8443 (HTTPS) que já é utilziada pelo Incus, e conforme observamos, pode haver conflito entre os dois serviços. Você pode colocar na porta 9443 ou e alguma que lhe convier.

A presença de um Dashboard não é obrigatória. Caso assim queira, rode o seguinte comando no lugar do anterior:
```bash
sudo cephadm bootstrap --mon-ip <IP Boostrap> --cluster-network <Rede/Máscara> --skip-dashboard
```

Exitem diversos outros parâmetros que podem ser utlizados em combinação com os anteriores e que podem fazer sentido para você. Para saber mais execute o comando ```cephadm bootstrap -h```.

## Adicionando os Outros Nós ao Cluster Ceph
Após o bootstrap, adicione os demais nós para que o cephadm possa gerenciá-los. Porém, observe que ele irá criar um par de chaves SSH (em ```/etc/ceph```) que será utilizado para acessar os demais nós e adicioná-los ao cluster. Como o acesso dever ser feito do usuário ```root``` do bootstrap para os usuários ```root``` dos demais nós, você deve configurar de tal forma que esse acesso SSH ocorra sem a necessidade de senha (Clique [aqui](https://docs.ceph.com/en/reef/cephadm/host-management/#adding-hosts) para saber mais).

Execute a partir do nó de bootstrap para cada nó adicional. O comando ```cephadm shell``` entra em um contêiner com todas as ferramentas do Ceph:
```bash
sudo cephadm shell -- ceph orch host add <Nome Host2> <IP Host2> --labels _admin
sudo cephadm shell -- ceph orch host add <Nome Host3> <IP Host3> --labels _admin
```

Por que ```--labels _admin```?
A label ```_admin``` informa ao cephadm que este nó deve ter uma cópia do arquivo de configuração (```ceph.conf```) e do chaveiro de administração (```ceph.client.admin.keyring```). Isso permite que você execute comandos ceph de qualquer um desses nós.

## Criando os OSDs (Daemons de Armazenamento)
Com os discos preparados e os nós adicionados, podemos instruir o Ceph a criar os OSDs.

Se você usou LVM (Alternativa A):
Estes comandos instruem o Ceph a criar um OSD em cada nó, usando o LV que preparamos. Execute no nó de bootstrap.

```bash
sudo cephadm shell -- ceph orch daemon add osd <Nome Host1>:/dev/ceph_vg_<Nome Host1>/osd_lv
sudo cephadm shell -- ceph orch daemon add osd <Nome Host2>:/dev/ceph_vg_<Nome Host2>/osd_lv
sudo cephadm shell -- ceph orch daemon add osd <Nome Host3>:/dev/ceph_vg_<Nome Host3>/osd_lv
```

Se você usou Discos Inteiros (Alternativa B):
Este é o método mais automatizado. O Ceph irá procurar e usar quaisquer discos disponíveis que não contenham dados.
Este comando verifica todos os discos "disponíveis" em todos os nós gerenciados e cria OSDs neles.

```bash
ceph cephadm shell -- orch daemon add osd <Nome Host1>:<Caminho Disco>
ceph cephadm shell -- orch daemon add osd <Nome Host2>:<Caminho Disco>
ceph cephadm shell -- orch daemon add osd <Nome Host3>:<Caminho Disco>
```

Para mais informações sobre o OSD, leia mais [aqui](https://docs.ceph.com/en/reef/cephadm/services/osd/#osd-service).

## Criando um Pool de Armazenamento
Um "pool" é uma partição lógica no cluster Ceph onde você armazenará dados. O Incus usará um pool para armazenar imagens e volumes de instâncias.

Crie um pool executando:
```bash
sudo cephadm shell -- ceph osd pool create <Nome Pool>
```

Inicialize o pool para uso com RBD (RADOS Block Device). Isso o habilita para armazenar os volumes que o Incus irá criar:
```bash
sudo cephadm shell -- rbd pool init -p <Nome Pool>
```

Para saber mais sobre Pools do Ceph clique [aqui](https://docs.ceph.com/en/latest/rados/operations/pools/#creating-a-pool).

## Adicionando Storage aos Nós do Cluster Incus
Execute os seguintes comando em qualquer nó Incus:
```bash
incus storage create remote-ceph ceph --target <Nome Incus Host1>
incus storage create remote-ceph ceph --target <Nome Incus Host2>
incus storage create remote-ceph ceph --target <Nome Incus Host3>
```

## Integrando o Ceph com o Incus
Finalmente, vamos configurar o Incus para usar o cluster Ceph recém-criado:
```bash
incus storage create <Nome Storage> ceph ceph.osd.data_pool_name=<Nome Pool>
```

Após este passo, seu cluster Incus está pronto para usar o Ceph. Você pode definir este novo pool como o padrão ou usá-lo ao criar novos contêineres e VMs.