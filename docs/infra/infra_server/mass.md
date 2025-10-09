# Relatório de Instalação – MAAS + OpenStack

## 1. Organização das Redes

| Rede/Sub-rede        | Função                                      | Observações                                                          |
| -------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| **192.168.66.0/24**  | **BMC** – Gerenciamento remoto (iDRAC/IPMI) | Usada pelo MAAS para controle dos servidores Dell.                   |
| **192.168.69.0/24**  | **PXE Boot / Provisionamento** (VLAN 69)    | Usada pelo MAAS para gerenciar os nós físicos e realizar o boot PXE. |
| **192.168.100.0/24** | OpenStack (**VLAN 100**)                    | Rede VLAN tagged; destinada à comunicação do ambiente OpenStack.     |
| **192.168.200.0/24** | Incus (**VLAN 200**)                        | Rede VLAN tagged; segmento utilizado para o ambiente Incus.          |

### Redes em Estudo / Pendentes de Confirmação

* **DMZ (VLAN 102):** usada para acessar os controllers e também para prover IPs públicos às instâncias da cloud. *(A confirmar se será mantida ou modificada nesta instalação).*
* **MGT (VLAN 103):** usada pelo MAAS, Juju, LXD e OpenStack para prover os serviços da cloud. *(“MGT” = *Management*).*

---

## 2. Descrição da Infraestrutura Atual

### Estrutura Física

* **Nimbus (Cumulus)**

  * [Dell PowerEdge R710](https://dl.dell.com/manuals/all-products/esuprt_ser_stor_net/esuprt_poweredge-r710_owner%27s%20manual_en-us.pdf)
  * Ubuntu Server 22.04

* **Cirrus**

  * [Dell PowerEdge R910](https://i.dell.com/sites/csdocuments/Business_solutions_engineering-Docs_Documents/en/poweredge-r910-technical-guide.pdf)
  * Ubuntu Server 22.04

* **Compute0 / Compute1**

  * Dell PowerEdge R910 – Ubuntu Server 22.04

* **Incus0 / Incus1 / Incus2**

  * Dell PowerEdge R910 – Ubuntu Server 22.04

* **Chaveador de Máquina (TK-801R)**

  * Permite acesso local às máquinas via monitor/teclado.

* **Switch**

  * Cabeamento físico representado em esquema de cores, associado às máquinas.

* **Tabela de MAC addresses**

  #### Controller Cumulus
    | interface | MAC Address |
    | :---      | :---    |
    | BMC0 | ?? |
    | eno1 | bc:30:5b:fe:63:14 |
    | eno2 | bc:30:5b:fe:63:16 |
    | eno3 | bc:30:5b:fe:63:18 |
    | eno4 | bc:30:5b:fe:63:1a |

  #### Controller Cirrus
    | interface | MAC Address |
    | :---      | :---    |
    | BMC0 | 78:2b:cb:5c:65:1f |
    | eno1 | 78:2b:cb:02:4e:65 |
    | eno2 | 78:2b:cb:02:4e:67 |
    | eno3 | 78:2b:cb:02:4e:69 |
    | eno4 | 78:2b:cb:02:4e:6b |

  #### Compute 0 Cirrus
    | interface | MAC Address |
    | :---      | :---    |
    | BMC0 | f0:1f:af:d4:69:19 |
    | eno1 | f0:1f:af:d0:c3:81 |
    | eno2 | f0:1f:af:d0:c3:83 |
    | eno3 | f0:1f:af:d0:c3:85 |
    | eno4 | f0:1f:af:d0:c3:87 |

  #### Compute 1 Cirrus
    | interface | MAC Address |
    | :---      | :---    |
    | BMC0 | f0:1f:af:ce:47:7c |
    | eno1 | 90:b1:1c:59:92:49 |
    | eno2 | 90:b1:1c:59:92:4b |
    | eno3 | 90:b1:1c:59:92:4d |
    | eno4 | 90:b1:1c:59:92:4f |

  #### Incus 1
    | interface | MAC Address |
    | :---      | :---    |
    | BMC0 | d4:ae:52:b0:0e:81 |
    | eno1 | 78:2b:cb:02:4f:be |
    | eno2 | 78:2b:cb:02:4f:c0 |
    | eno3 | 78:2b:cb:02:4f:c2 |
    | eno4 | 78:2b:cb:02:4f:c4 |

  #### Incus 2
    | interface | MAC Address |
    | :---      | :---    |
    | BMC0 | 78:2b:cb:5a:a9:38 |
    | eno1 | 00:26:b9:34:b0:a1 |
    | eno2 | 00:26:b9:34:b0:a3 |
    | eno3 | 00:26:b9:34:b0:a5 |
    | eno4 | 00:26:b9:34:b0:a7 |

  #### Incus 3
    | interface | MAC Address |
    | :---      | :---    |
    | BMC0 | d4:ae:52:b0:0e:7e |
    | eno1 | 78:2b:cb:02:4e:ae |
    | eno2 | 78:2b:cb:02:4e:b0 |
    | eno3 | 78:2b:cb:02:4e:b2 |
    | eno4 | 78:2b:cb:02:4e:b4 |


---


## 3. Configuração de Rede – Nimbus (Cumulus)

Arquivo editado:

```bash
/etc/netplan/50-cloud-init.yaml
```

### Bridges configuradas

* `br-mgmt-stack` → VLAN 100 (OpenStack) – `192.168.100.1/24`
* `br-mgmt-incus` → VLAN 200 (Incus) – `192.168.200.1/24`

### Mapeamento de Interfaces

| Interface      | Rede/Sub-rede        | VLAN | Função                                 | IP                                          |
| -------------- | -------------------- | ---- | -------------------------------------- | ------------------------------------------- |
| **eno1**       | 192.168.69.0/24      | –    | **PXE / Provisionamento**              | `192.168.69.1/24`                           |
| **eno2**       | 200.18.99.0/24 (+v6) | –    | **DMZ** (acesso externo)               | `200.18.99.86/24` ; `2801:b0:30:101::86/64` |
| **eno3.vl100** | 192.168.100.0/24     | 100  | **OpenStack** (bridge `br-mgmt-stack`) | `192.168.100.1/24`                          |
| **eno3.vl200** | 192.168.200.0/24     | 200  | **Incus** (bridge `br-mgmt-incus`)     | `192.168.200.1/24`                          |
| **eno4**       | 192.168.66.0/24      | –    | **BMC / IPMI**                         | `192.168.66.1/24`                           |

---

## 4. Instalação e Configuração do MAAS

### 4.1 Setup do banco de dados PostgreSQL

```bash
sudo apt install postgresql-16
sudo -iu postgres psql --command="CREATE USER admin WITH ENCRYPTED PASSWORD 'admin'"
sudo -iu postgres createdb -O admin maas
```

* Banco: **maas**
* Usuário: **admin** / Senha: **admin**
* Versão: **PostgreSQL 16** *(adotada nesta instalação; inicialmente testado com 14, mas já atualizado para 16)*

### 4.2 Definição do hostname

```bash
sudo hostnamectl set-hostname nimbus
```

* Hostname do servidor definido como **nimbus** (também chamado *cumulus* em registros anteriores).

### 4.3 Instalação do MAAS

```bash
sudo snap install maas
```

* Versão instalada: **3.6 (stable)**

### 4.4 Inicialização do MAAS

```bash
sudo maas init region+rack \
  --database-uri "postgres://admin:admin@localhost/maas" \
  --maas-url "http://127.0.0.1:5240/MAAS"
```

* Tipo: **region+rack** no mesmo servidor
* Banco de dados: `postgres://admin:admin@localhost/maas`
* URL do serviço: `http://127.0.0.1:5240/MAAS`

### 4.5 Criação do usuário administrador do MAAS

```bash
sudo maas createadmin
```

* **username:** `arthur`
* **password:** `admin`
* **email:** `thursilveirio@gmail.com`
* **SSH keys:** importadas do GitHub (`gh:arthunix`, `gh:ViniRodrig`)

### 4.6 Acesso ao Dashboard

* Acesso realizado **diretamente pelo navegador** (ex.: `http://200.18.99.86:5240/MAAS`), sem túnel SSH.
* > **Obs:** confirmar na próxima reunião se esse comportamento é esperado no MAAS 3.6 ou se houve alteração manual.

### 4.7 Setup inicial no Dashboard

* **Region name:** `nimbus`
* **DNS forwarder:** `8.8.8.8,1.1.1.1`
* **Ubuntu archive:** `http://archive.ubuntu.com/ubuntu`
* **Ubuntu extra architectures:** `http://ports.ubuntu.com/ubuntu-ports`
* **APT & HTTP/HTTPS proxy server:** não configurado

Etapas concluídas:

1. Seleção de imagens → Ubuntu **22.04** e **24.04**, arquitetura **amd64**
2. Configuração das chaves SSH → importadas do GitHub (`arthunix`, `ViniRodrig`)

### 4.8 Configuração de DHCP no MAAS

Foram criados **DHCP snippets** para garantir alguns IPs estáticos:

![alt text](images/dhcp.png "snippets_dhcp Struct")

* **PXE (`192.168.69.0/24`)** – atribuição fixa para boot PXE dos nós (Incus, Cirrus, Compute0, Compute1).
```
# Type: subnet
# Applies to: 192.168.69.0/24

# PXE Incus 1
host inc1-pxe {
   hardware ethernet 78:2b:cb:02:4f:be;
   fixed-address 192.168.69.82;
}

# PXE Incus 2
host inc2-pxe {
   hardware ethernet 78:2b:cb:02:4f:c6;
   fixed-address 192.168.69.83;
}

# PXE Incus 3
host inc3-pxe {
   hardware ethernet 78:2b:cb:02:4e:ae;
   fixed-address 192.168.69.84;
}

# PXE Cirrus controller
host cirrus-pxe {
   hardware ethernet 78:2b:cb:02:4e:65;
   fixed-address 192.168.69.85;
}

# PXE Cirrus compute 0
host c0c-pxe {
   hardware ethernet f0:1f:af:d0:c3:81;
   fixed-address 192.168.69.88;
}

# PXE Cirrus compute 1
host c1c-pxe {
   hardware ethernet 90:b1:1c:59:92:49;
   fixed-address 192.168.69.89;
}
```
* **BMC (`192.168.66.0/24`)** – atribuição fixa aos iDRACs dos nós (Incus, Cirrus, Compute0, Compute1).
```
# Type: subnet
# Applies to: 192.168.66.0/24

# BMC Incus 1
host inc1-bmc {
   hardware ethernet d4:ae:52:b0:0e:81;
   fixed-address 192.168.66.82;
}

# BMC Incus 2
host inc2-bmc {
   hardware ethernet 78:2b:cb:5a:a9:38;
   fixed-address 192.168.66.83;
}

# BMC Incus 3
host inc3-bmc {
   hardware ethernet d4:ae:52:b0:0e:7e;
   fixed-address 192.168.66.84;
}

# BMC Cirrus controller
host cirrus-bmc {
   hardware ethernet 78:2b:cb:5c:65:1f;
   fixed-address 192.168.66.85;
}

# BMC Cirrus compute 0
host c0c-bmc {
   hardware ethernet f0:1f:af:d4:69:19;
   fixed-address 192.168.66.88;
}

# BMC Cirrus compute 1
host c1c-bmc {
   hardware ethernet f0:1f:af:ce:47:7c;
   fixed-address 192.168.66.89;
}
```

### 4.9 Configuração de Fabrics

Foram criadas as seguintes **fabrics** no MAAS:

| Fabric     | Subnet(s) associada(s)                                           | Observações                                |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------ |
| **bmc**    | `192.168.66.0/24`                                                | Rede de gerenciamento remoto (iDRAC/IPMI). |
| **pxe**    | `192.168.69.0/24`                                                | Rede de provisionamento PXE.     |
| **mgmt**   | `192.168.100.0/24` (VLAN 100) tagged <br> `192.168.200.0/24` (VLAN 200) tagged | Redes internas para OpenStack e Incus.   |
| **public** | `200.18.99.0/24` <br> `2801:b0:30:101::/64`                      | Rede externa (DMZ).                        |
| **docker** | `172.17.0.0/16`                                                  | Rede interna usada por containers Docker.**  |



**Não foi provisionada manualmente, o maas fez automaticamnete


### 4.10 Configuração de DHCP nas Subnets

DHCP habilitado nas principais subnets com ranges dinâmicos reservados:

| Subnet                           | Gateway           | Range Dinâmico Reservado            | Observações                                       |
| -------------------------------- | ----------------- | ----------------------------------- | ------------------------------------------------- |
| **BMC (192.168.66.0/24)**        | `192.168.66.254`  | `192.168.66.190 – 192.168.66.253`   | Usada para iDRAC/IPMI dos servidores.             |
| **PXE (192.168.69.0/24)**        | `192.168.69.254`  | `192.168.69.190 – 192.168.69.253`   | Usada para boot PXE e provisionamento automático. |
| **OpenStack (192.168.100.0/24)** | `192.168.100.254` | `192.168.100.190 – 192.168.100.253` | Rede de comunicação do ambiente OpenStack.        |
| **Incus (192.168.200.0/24)**     | `192.168.200.254` | `192.168.200.190 – 192.168.200.253` | Rede lógica do ambiente Incus.                    |

📌 **Notas:**

* Em todas as redes, o DHCP foi configurado como **“MAAS provides DHCP → Provide DHCP from rack controller(s)”**, usando o rack controller **nimbus**.
* Gateway sempre definido como o último IP da rede (`.254`).
Juju controller fica nesse IP.
* Faixa dinâmica: `.190 – .253`, reservando os IPs iniciais para controllers e hosts fixos.



### 4.11 Adicionando as máquinas físicas

O próximo passo é encontrar o IP dos BMCs das máquinas. BMC é um "mini computador" que fica atrelado ao nós do cluster para fazer o gerenciamento e monitoramento das máquinas. Em nosso caso, queremos fazer um boot PXE nos nós, ou seja, um boot pela rede, de modo que consigamos gerenciar as máquinas remotamente.

Com o DHCP configurado na etapa anterior, os BMCs já receberam IPs que podem ser encontrados pelo controller. Para isso, verifique usando o nmap

```bash
sudo nmap 192.168.66.0/24 -T5 #substitua pela sub-rede do seu BMC
```
```
admin@nimbus:~$ nmap 192.168.66.0/24 -T5
(...)
Nmap scan report for 192.168.66.82
Host is up (0.017s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
5900/tcp open  vnc

Nmap scan report for 192.168.66.83
Host is up (0.010s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
5900/tcp open  vnc

Nmap scan report for 192.168.66.84
Host is up (0.0076s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
5900/tcp open  vnc

Nmap scan report for 192.168.66.85
Host is up (0.013s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
5900/tcp open  vnc

Nmap scan report for 192.168.66.88
Host is up (0.013s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
5900/tcp open  vnc

Nmap scan report for 192.168.66.89
Host is up (0.0066s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
5900/tcp open  vnc
(...)
```

Agora no dashboard, pode-se adicionar as novas máquinas
1. Na aba `Machines`, clique em `Add hardware` e depois em `Machine`
2. Preencha as seguintes informações. Isso deve ser feito para os dois nós encontrados
* `Machine name`: A sua escolha
* `Mac Address`: Mac Addresses da interface pxe da máquina 
* `Power type`: IPMI
* `IP Address`: IP da máquinas que encontrou
* `Power user`: user do BMC
* `Power password`: senha do user do BMC
> Em nosso cluster, estamos usando o usuário e senha "root" por default
3. Deixe as demais configurações default, e clique em `Save machine`


    | Machine | IP PXE           |
    | :---   | :---              |
    | cirrus | 192.168.69.12     |
    | c0c    | 192.168.69.13     |
    | c1c    | 192.168.69.14     |
    | inc1   | 192.168.69.11     |
    | inc2   | 192.168.69.10     |
    | inc3   | 192.168.69.9      |

### 4.12 Configurando as redes
Agora aba `Network`dentro das máquinas no maas, pode-se configurar as redes:
1. Na interface, no canto esquerdo clique na seta e depois `Edit Physical`
2. Selecione a fabric correta, no nosso caso seguimos a tabela, tag da vlan se ela for tagged, subnet.
3. Configure ip de forma estática ou via dhcp:
   - para atribuiçao de endereços usando dhcp (dhcp snippets pode ser usado)
   - para atribuiçao de ips escolha `Static Assign`
   - para atribuiçao de ips automaticamente `Auto Assign` (mas nesse caso não temos controle do ip q a instância vai receber)
   - no nosso caso, para usar a rede DMV, mantivemos o `subnet name` e `IP addres status` em `unconfigured`
4. Para rede de management do OpenStack `eno3.vl100` clique em Create Bridge e realize a mesma configuração.

Faça isso para todas as redes de todas as máquinas. E após esse processo faça o deploy das máquinas.

Nossa configuração de rede ficou da seguinte forma

**cirrus**
| Interface | VLAN | IP assignment |
| :-------- | :--- | :------------ |
| eno1      |   untaged   | Automatic     |
| eno2      |   untaged   | No            |
| eno3      |   100       | 192.168.100.85       | 

Para rede de management do OpenStack `eno3.vl100` clique em Create Bridge e realize a mesma configuração com o nome `br-mgmt-stack`


**c0c**
| Interface | VLAN | IP assignment |
| :-------- | :--- | :------------ |
| eno1      | untaged     | Automatic              |
| eno2      |   untaged   | No            |
| eno3      |   100   |    192.168.100.88           |

Para rede de management do OpenStack `eno3.vl100` clique em Create Bridge e realize a mesma configuração com o nome `br-mgmt-stack`

**c1c**
| Interface | VLAN | IP assignment |
| :-------- | :--- | :------------ |
| eno1      | untaged     | Automatic              |
| eno2      |   untaged   | No            |
| eno3      |   100   |    192.168.100.89           |

Para rede de management do OpenStack `eno3.vl100` clique em Create Bridge e realize a mesma configuração com o nome `br-mgmt-stack`



**inc1**
| Interface | VLAN | IP assignment |
| :-------- | :--- | :------------ |
| eno1      | untaged     | Automatic              |
| eno2      |   untaged   | No            |
| eno3      |      |               |




**inc2**
| Interface | VLAN | IP assignment |
| :-------- | :--- | :------------ |
| eno1      | untaged     | Automatic              |
| eno2      |   untaged   | No            |
| eno3      |      |               |






**inc3**
| Interface | VLAN | IP assignment |
| :-------- | :--- | :------------ |
| eno1      | untaged     | Automatic              |
| eno2      |   untaged   | No            |
| eno3      |      |               |


### 4.13 Configuração de NAT para a rede de management
Apesar da rede de management ser local, ainda é necessário que as máquinas desta rede tenham acesso à internet. Para resolver isso, uma alternativa é usar um NAT,
ou seja, um protocolo que faz com que as máquinas dentro dessa rede "emprestem" o IP do gateway e possam se comunicar com o mundo externo.
Para fazer isso, pode-se usar o nftables.

Primeiramente, crie um diretório a qual possa se adicionar novos arquivos de configuração do nftables
```sh
sudo mkdir /etc/nftables.d
```

Agora, crie um novo arquivo com o NAT da rede de management
```sh
sudo nano /etc/nftables.d/nat_rede_mgmt.conf
```
Adicione a seguinte tabela
```conf
table ip nat {
    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;
        ip saddr 192.168.100.0/24 oif "eno2" snat to 200.18.99.86;
	    ip saddr 192.168.200.0/24 oif "eno2" snat to 200.18.99.86;
        ip saddr 192.168.69.0/24 oif "eno2" snat to 200.18.99.86;

    }
}
```
Adicione um import dessas configurações no arquivo principal do nftables
```sh
sudo nano /etc/nftables.conf
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
Para listar as regras e conferir se a regra foi aplicada
```sh
sudo nft list ruleset
```