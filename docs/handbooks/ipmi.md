# IPMITool

IPMI é um protocolo usado para comunicação com BMC de um servidor

BMC, ou Baseboard Management Computer, é um mini computador que fica conectado ao chassi de um servidor e serve para realizar monitoramento, realizar controle da máquina em si e também realizar boot pela rede (PXE boot)

## Comandos

### ipmitool - checando se existe um BMC

```bash
ipmitool -H <ip do bmc> -U <user do BMC> -P <senha do user>
```

Caso este comando retorne “No command provided” significa que existe um BMC neste IP

Caso dê timeout, ou retorne “Error: Unable to establish IPMI v2 / RMCP+ session”, significa que não existe um BMC neste IP ou que há algum problema nele impedindo o acesso por IPMI

#### **tags**

-H → “host”, ou seja, IP do BMC

-U→ “user” no BMC

-P→”password” no BMC

### ipmitool shell - sessão interativa

Usando o ipmitool shell, uma sessão iterativa do programa é lançada, evitando que seja necessário rodar todo o comando `ipmitool -H <host> -U <user> -P <passwd>` a todo momento

Todos os comandos abaixo podem ser rodados dentro do shell, indicando somente o comando em si

#### Abrindo o shell

```bash
ipmitool -H <host> -U <user> -P <passwd> shell
```

#### Obtendo ajuda

```bash
ipmitool> help
```

#### Rodando um comando

```bash
ipmitool> power status
```

### chassis - controlando a máquina

Os comandos de ipmitool chassis controlam nossa máquina em si. Por exemplo

> Note que os comandos de power do chassis poder ser abreviados. Por exemplo, `chassis power on` pode ser
> reduzido a `power on`

#### Verificando se a máquina está ligada

```bash
ipmitool -H <host> -U <user> -P <root> power status
```

#### Ligando a máquina

```bash
ipmitool -H <host> -U <user> -P <root> power on
```

#### Desligando a máquina

```bash
ipmitool -H <host> -U <user> -P <root> power off
```

#### Reiniciando a máquina

```bash
ipmitool -H <host> -U <user> -P <root> power reset
```

#### Verificando a saúde do chassi

```bash
ipmitool -H <host> -U <user> -P <root> chassis selftest
```

### mc - controlando o BMC em si

Os comandos “mc” servem para gerenciar o BMC em si

#### reiniciando o BMC

Aqui temos dois tipos de reset: warm e cold. Não sei a diferença de ambos, e só o cold funciona no nosso cluster, por algum motivo

```bash
ipmitool -H <host> -U <user> -P <passwd> mc reset cold
```

#### Verificando a saúde do BMC

```bash
ipmitool -H <host> -U <user> -P <passwd> mc selftest
```

### user - gerenciando os usuários do BMC

Estes comando gerenciam por exemplo nome e senha dos usuários do BMC.

Note que o BMC tem uma tabela com usuários, senhas e o acesso do usuário. Portanto, não existe “deletar” e “criar” usuários, mas simplesmente tê-los ou não na tabela e suas permissões

#### listando usuários

```bash
ipmitool -H <host> -U <user> -P <passwd> user list
```

Um exemplo de saída é

```bash
ID  Name	     Callin  Link Auth	IPMI Msg   Channel Priv Limit
1                    true    false      false      NO ACCESS
2   root             true    true       true       ADMINISTRATOR
3   maas             true    true       true       ADMINISTRATOR
4   fwupd            true    true       true       ADMINISTRATOR
5                    true    false      false      NO ACCESS
6                    true    false      false      NO ACCESS
7                    true    false      false      NO ACCESS
8                    true    false      false      NO ACCESS
9                    true    false      false      NO ACCESS
10                   true    false      false      NO ACCESS
11                   true    false      false      NO ACCESS
12                   true    false      false      NO ACCESS
13                   true    false      false      NO ACCESS
14                   true    false      false      NO ACCESS
15                   true    false      false      NO ACCESS
16                   true    false      false      NO ACCESS
```

#### Adicionando usuário

Como dito, esse comando somente adiciona um nome na coluna “Name”. Após criar o usuário é necessário setar uma senha e definir o privilégio

Isso pode ser usado para criar ou sobrescrever um usuário

```bash
ipmitool -H <host> -U <user> -P <passwd> user set name <id na tabela> <novo nome>
```

#### Definindo uma senha do usuário

Usando o comando assim, uma sessão interativa será aberta

```bash
ipmitool -H <host> -U <user> -P <passwd> user set password <id na tabela>
```

#### Definindo o acesso (privilégio) do usuário

```bash
ipmitool -H <host> -U <user> -P <passwd> user priv <id na tabela> <privilégio>
```

Níveis de privilégio

- 0xF→No Access
- 0x3→Operator
- 0x4→Administrator

Não sei bem o que cada um significa, na verdade. Na dúvida lança um Administrator

#### Ativando e desativando o usuário

Isso ativa e desativa o usuário, ou seja, se ele está habilitado ou não para logar

```bash
ipmitool -H <host> -U <user> -P <passwd> user [disable ou enable] <id na tabela>
```

### sensor - obtendo informações sobre os sensores

Existem diversos sensores no BMC que podem ser usados para verificar a saúde do nó

#### Obtendo todas as informações de sensores

```bash
ipmitool -H <host> -U <user> -P <passwd> sensor
```
