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

Foram criados **DHCP snippets** para garantir IPs estáticos:

* **BMC (`192.168.66.0/24`)** – atribuição fixa aos iDRACs dos servidores (Incus, Cirrus, Compute0, Compute1).
* **PXE (`192.168.69.0/24`)** – atribuição fixa para boot PXE dos mesmos nós.

### 4.9 Configuração de Fabrics

Foram criadas as seguintes **fabrics** no MAAS:

| Fabric     | Subnet(s) associada(s)                                           | Observações                                |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------ |
| **bmc**    | `192.168.66.0/24`                                                | Rede de gerenciamento remoto (iDRAC/IPMI). |
| **pxe**    | `192.168.69.0/24`                                                | Rede de provisionamento PXE.     |
| **mgmt**   | `192.168.100.0/24` (VLAN 100) <br> `192.168.200.0/24` (VLAN 200) | Redes internas para OpenStack e Incus.     |
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

