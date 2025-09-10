---
sidebar_position: 1
sidebar_label: "Configurando um Servidor dhcp"
---


### **Configurando `curau` como Servidor DHCP Kea para as `pamonhas`**

**Objetivo:** O servidor `curau` irá fornecer IPs na rede `192.168.35.0/24`. As `pamonhas` 1, 2 e 3 receberão IPs fixos (reservados por MAC address) e qualquer outro dispositivo receberá um IP de uma faixa dinâmica.

#### **Parte A: Configuração do Servidor `curau`**

Nesta parte, vamos definir o IP estático na interface de rede interna do `curau` e instalar/configurar o Kea.

##### **Passo 1: Configurar IP Estático no `curau` com Netplan**

Analisando sua saída `ip a`, vemos que a interface para a rede interna é a `eno1`. Vamos garantir que seu IP `192.168.35.254` seja permanente.

1.  **Edite o arquivo de configuração do Netplan:**
    ```bash
    # Recomendo fazer um backup antes de editar
    sudo cp /etc/netplan/00-installer-config.yaml /etc/netplan/00-installer-config.yaml.bak

    # Abra o arquivo para edição
    sudo nano /etc/netplan/99-installer-config.yaml
    ```

2.  **Defina a configuração de rede:**
    Apague todo o conteúdo do arquivo e cole a configuração abaixo. Ela configura tanto sua interface de internet (`enp3s0`) quanto a sua interface de rede local (`eno1`).
inicialização.

    ```yaml
    # Arquivo de configuração de rede permanente para o servidor CURAU
    # Gerenciado manualmente após desabilitar a rede no cloud-init.
    network:
      version: 2
      renderer: networkd
      ethernets:
        # Interface de Rede Local (LAN) para as Pamonhas
        eno1:
          dhcp4: no
          addresses:
            - 192.168.35.254/24

        # Interface de Rede Local Secundária (opcional)
        enp2s0:
          dhcp4: no
          addresses:
            - 10.10.35.254/24

        # Interface de Internet (WAN)
        enp3s0:
          dhcp4: no
          addresses:
            - 200.18.99.85/24
          routes:
            # Define a rota padrão para todo o tráfego de saída
            - to: default
              via: 200.18.99.1
          nameservers:
            # Servidores DNS a serem utilizados pelo servidor
            addresses: [172.20.53.1, 172.20.53.2, 8.8.8.8]

    ```

    **Importante:** A indentação (espaços) no YAML é crucial. Não use tabs.

3.  **Aplique a configuração de rede:**
    ```bash
    sudo netplan apply
    ```
    Sua conexão pode ser interrompida por um instante. Após a aplicação, verifique com `ip a` se a `eno1` continua com o IP `192.168.35.254`.

##### **Passo 2: Instalar e Configurar o Servidor Kea DHCP**

1.  **Instale o pacote Kea:**
    ```bash
    sudo apt update
    sudo apt install -y kea-dhcp4-server
    ```

2.  **Crie um novo arquivo de configuração:**
    ```bash
    sudo mv /etc/kea/kea-dhcp4.conf /etc/kea/kea-dhcp4.conf.backup
    sudo nano /etc/kea/kea-dhcp4.conf
    ```

3.  **Adicione a configuração do Kea:**
    Copie e cole o JSON abaixo. Ele já está preenchido com as informações corretas da sua rede e das `pamonhas`.

    ```json
    {
    "Dhcp4": {
        // Diga ao Kea para escutar APENAS na interface da rede local (eno1)
        "interfaces-config": {
            "interfaces": [ "eno1" ]
        },

        "lease-database": { "type": "memfile" },

        "loggers": [{
            "name": "kea-dhcp4",
            "output_options": [{"output": "/var/log/kea-dhcp4.log"}],
            "severity": "INFO"
        }],

        // Configuração para a nossa única sub-rede
        "subnet4": [
            {
                "subnet": "192.168.35.0/24",

                // Faixa de IPs para clientes aleatórios (não pamonhas)
                "pools": [
                    { "pool": "192.168.35.100 - 192.168.35.200" }
                ],

                // Opções que serão enviadas aos clientes (gateway e DNS)
                "option-data": [
                    { "name": "routers", "data": "192.168.35.254" },
                    { "name": "domain-name-servers", "data": "192.168.35.254, 8.8.8.8" }
                ],

                // === Reservas de IP Fixo para as PAMONHAS ===
                "reservations": [
                    {
                        "hw-address": "70:54:d2:c5:17:b3", // MAC da interface eno1 da PAMONHA1
                        "ip-address": "192.168.35.1",
                        "hostname": "pamonha1"
                    },
                    {
                        "hw-address": "00:22:4d:aa:aa:43", // MAC da interface eno1 da PAMONHA2
                        "ip-address": "192.168.35.2",
                        "hostname": "pamonha2"
                    },
                    {
                        "hw-address": "00:22:4d:4f:ee:0c", // MAC da interface eno1 da PAMONHA3
                        "ip-address": "192.168.35.3",
                        "hostname": "pamonha3"
                    }
                ]
            }
        ]
    }
    }
    ```

4.  **Valide, inicie e habilite o serviço:**
    ```bash
    # 1. Checa se o arquivo de configuração não tem erros de sintaxe
    sudo kea-dhcp4 -t /etc/kea/kea-dhcp4.conf

    # 2. Inicia o serviço
    sudo systemctl start kea-dhcp4-server

    # 3. Garante que o serviço inicie com o boot do sistema
    sudo systemctl enable kea-dhcp4-server

    # 4. Verifica o status
    sudo systemctl status kea-dhcp4-server
    ```
    A saída do último comando deve mostrar `active (running)`.

##### **Passo 3: Liberar o DHCP no Firewall**
O firewall do `curau` precisa permitir a entrada de requisições DHCP.

```bash
sudo ufw allow in on eno1 to any port 67 proto udp
sudo ufw reload
```
Este comando é específico e seguro: permite pacotes UDP na porta 67 (DHCP) apenas na interface da rede interna (`eno1`).

**O servidor `curau` está pronto!**

---

#### **Parte B: Configuração das `pamonhas` como Clientes DHCP**

Agora, vamos configurar cada `pamonha` para pedir seu IP ao `curau`. O processo é o mesmo para as três.

##### **Passo 1: Configurar Netplan para Cliente DHCP**

1.  Acesse uma das `pamonhas` (ex: `pamonha1`).

2.  Edite seu arquivo Netplan. A interface que se conecta à rede 192.168.35.x em todas as suas `pamonhas` é a `eno1`.

    ```bash
    sudo nano /etc/netplan/99-installer-config.yaml
    ```

3.  Substitua o conteúdo do arquivo por esta configuração simples:

    ```yaml
    # Arquivo de configuração de rede para uma PAMONHA (/etc/netplan/00-installer-config.yaml)
    network:
      version: 2
      renderer: networkd
      ethernets:
        # Configura a interface eno1 para obter seu IP via DHCP.
        eno1:
          dhcp4: true
    ```

4.  Aplique a configuração:
    ```bash
    sudo netplan apply
    ```

##### **Passo 2: Verificação**

1.  **Na Pamonha:**
    Execute `ip a` e observe a interface `eno1`. Ela deverá ter recebido o IP que você reservou para ela no `curau`. Por exemplo, na `pamonha1`, você verá `inet 192.168.35.1/24`.

2.  **No Servidor `curau`:**
    Você pode ver a "mágica" acontecer em tempo real nos logs do Kea:
    ```bash
    sudo tail -f /var/log/kea-dhcp4.log
    ```
    Você verá mensagens de `DHCPDISCOVER` do MAC da `pamonha`, seguidas de `DHCPOFFER` e `DHCPACK` do `curau` entregando o IP reservado.

**Repita o processo da "Parte B" para a `pamonha2` e `pamonha3`.** Como a configuração do Netplan é idêntica (todas usam a interface `eno1` para DHCP), o processo é muito rápido.

