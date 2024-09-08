# Storcli

Storcli é um programa para gerenciar os controladores de storage do cluster. Ele interage, por exemplo,
com controladoras RAID para criar ou desfazer RAIDs

## Instalação

No repositório de infra, na pasta `/etc`, existe um arquivo `storcli.deb`. Baixe o para o
nó que você deseja mexer. Isso pode ser feito usando _sftp_ ou _scp_.

> Se for uma máquina com problema no MAAS, você precisa colocá-la em recovery mode,
> que vai lançar um SO por pxe e permitir que você a opere.

Em máquinas em recovery, não é possível usar o apt. Por isso, vamos usar o dpkg

```sh
sudo dpkg -i ./storcli.deb
```

Para verificar se for instalado, rode

```sh
sudo dpkg -l | grep storcli
```

O seu executável fica em `/opt/MegaRAID/storcli`
Para desinstalar, caso seja necessário, rode

```sh
sudo dpkg -r storcli
```

## Comandos

> Note que, como o programa foi instalado pelo dpkg, ele não está adicionado ao path.
> Por isso, é necessário que se rode o executável diretamente `./opt/MegaRAID/storcli/storcli64`, ou
> dando cd no path e rodando `./storcli64`. Usamos simplesmente `storcli` por questão de leitura

### Listar controladores

```sh
sudo storcli show
```

Aqui serão mostrados todos os controladores disponíveis, que receberam um "id"
que será usado para os comandos para o controlador. Por exemplo, se existe somente
um controlador, ele terá índice 0. Dessa forma, seus comando serão "/c0"

### Mostrar informações de um controlador

Achado o índice do controlador desejado, substitua `x` por ele

```sh
sudo storcli /cx show
```

Este comando mostra todas as informações do controlador de storage, inclusive informações dos HDs
que estão conectadas a ele

### Mudar a configuração de RAID de discos

Essa é uma das maiores facilidades de se usar esse programa. Ele permite que se mude configurações
de RAID de forma remota, o que só era possível na BIOS do controller.

```sh
sudo storcli /cx add vd [each] ry drives=[]
```

Vamos esclarecer o comando

- /cx é nosso controlador, por exemplo /c0
- each é usado caso estivermos usando RAID0, nossos discos estarão separados, por isso, são "each disk"
- ry se refere ao tipo de RAID, por exemplo r0 para RAID0, r5 para RAID5 etc.
- drives indica quais os HDs que vão receber essa "formatação". Aqui usa-se a notação [a:b, c:d], pode-se também usar "all"

### Aplicar as alterações

Mudado o RAID dos discos, agora é preciso aplicar as alterações. Isso é feito pelo comando

```sh
sudo storcli cx/vy start init
```

Sendo

- cx o controller, como c0
- vy o disco a ser criado o volume, como v0 e v1
  Note que aqui temos que rodar o comando para todos os discos, que são listados no comando `storcli /c0 show`

Caso haja um file system de um SO no disco, ele apresentará o seguinte erro:

```sh
# storcli /c0/v0 start init
CLI Version = 007.2707.0000.0000 Dec 18, 2023
Operating system = Linux 5.4.0-181-generic
Controller = 0
Status = Failure
Description = None

Detailed Status :
===============

-----------------------------------------------------------
VD Operation Status ErrCd ErrMsg
-----------------------------------------------------------
 0 INIT      Failed   255 VD has OS/FS, use 'force' option
-----------------------------------------------------------
```

Para resolver isso, pode-se usar a tag de force.

> [!WARNING]
> Esteja atento que usar isso destroi o file system atual,
> portanto use somente se souber o que estiver fazendo

```sh
sudo storcli cx/vy start init force
```
