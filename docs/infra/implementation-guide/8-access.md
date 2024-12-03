---
sidebar_position: 7
sidebar_label: "Guia de Acesso"
---

# Guia de Acesso

## Obtendo Acesso à VPN
1. Faça login por ssh no controlador.
2. Obtenha suas credenciais usando `cat client.txt`
5. Baixe o pacote de ferramentas do WireGuard com `sudo apt install wireguard-tools`
4. Instale a configuração do cliente na sua máquina.
5. Levante a interface usando `sudo wg-quick up wg0.conf`

## Obtendo Acesso ao Dashboard
1. Faça login por ssh no controlador.
2. Obtenha suas credenciais usando `cat password.txt`
3. Faça login no dashboard em `http://10.0.99.151/horizon/`

Caso não saiba o endereço execute: `juju status --format=yaml openstack-dashboard | grep public-address | awk '{print $2}' | head -1` (necessita ser admin)
<!---
4. **CRIE UM USUÁRIO SEU PARA USO GERAL:**
    1. **NÓS NÃO ESTAMOS USANDO O PROJETO DE ADMINISTRAÇÃO PARA TAREFAS QUE NÃO SÃO DE ADMINISTRAÇÃO**
    2. Em Identidade > Domínios, crie um novo domínio.
    3. Em Identidade > Usuários, crie um novo usuário.
5. Faça login com o seu usuário.
--->

## Obtendo Acesso ao `openstack-cli`
1. Faça login por ssh no controlador.
2. Obtenha o certificado de CA do OpenStack em `/home/juju/snap/openstackclients/common/root-ca.crt` (você pode copiá-lo para sua pasta home e alterar as permissões do arquivo)
3. Faça login com o seu usuário no Dashboard.
4. Na sua conta, baixe o Arquivo OpenStack RC para uma pasta apropriada (no controlador ou na sua máquina pessoal).
5. Adicione as seguintes configurações no arquivo OpenStack RC:

```sh
export OS_AUTH_PROTOCOL=https
export OS_AUTH_TYPE=password
export OS_AUTH_VERSION=3
export OS_CACERT=/home/<seu-user>/root-ca.crt # ou o caminho para onde o /home/jujuclient/snap/openstackclients/common/root-ca.crt foi copiado
```

6. Carregue as variáveis de ambiente usando `source openrc.sh` (nome do arquivo do OpenStack RC)
7. O OpenStack cli está pronto para ser usado
