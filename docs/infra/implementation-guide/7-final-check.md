---
sidebar_position: 6
sidebar_label: "Verificações finais"
---

# Verificações finais

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
vault operator unseal
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

1.  Descubra o ip de acesso para a web UI, rodar o comando `juju status --format=yaml openstack-dashboard | grep public-address | awk '{print $2}' | head -1`
2.  Gere a senha de acesso de admin, rodar o comando `juju exec --unit keystone/leader leader-get admin_passwd`
3.  Copie essa senha para um local de fácil acesso
4.  Abra um novo terminal e crie um acesso ao ip via ssh, rodar o comando `ssh -L 8080:{ip do dashboard}:80 -p 2002 ubuntu@{cluster}.dc.ufscar.br`
5.  Acesse a web UI pelo browser de preferência no link `localhost:8080/horizon`
6.  Faça login usando:

    ```json
    username: admin
    password: {salva do passo 36.2}
    domain: admin_domain
    ```
