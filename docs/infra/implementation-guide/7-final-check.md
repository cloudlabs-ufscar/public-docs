---
sidebar_position: 6
sidebar_label: "Verificações finais"
---

# Verificações finais

33. Abrir vault server.
    1. Verificar ip da máquinda onde está o vault
       1. listar as unidades, rodar comando `juju status --color`
       2. Verificar na coluna Unit onde se encontra `vault/0*`
       3. Verificar o ip na coluna Public address da linha onde foi encontrado o vault
    2. Entrar na máquina onde está o vaulr, rodar comando `ssh -i ~/.local/share/juju/ssh/juju_id_rsa {ip_found}`, substituir ip_found pelo ip encontrado no passo anterior
    3. Definir endereço do vault, rodar comando `export VAULT_ADDR=http://127.0.0.1:8200`
    4. Iniciar vault server, rodar comando `vault operator init --key-shares=1 --key-threshold=1`
    5. Salvar a saída do comando em algum lugar que seja de fácil acesso, por exemplo um arquivo `vault.out`
    6. Desbloquear o servidor vault, rodar comando `vault operator unseal`
    7. Colocar a senha que se encontra na linha Unseal Key 1: do arquivo `vault.out`
    8. Sair da máquina do vault executando `Ctrl + D`
    9. Autorizar charm no servidor vault, rodar comando `juju run vault/leader authorize-charm token={token root}`, onde `{token_root}` deve ser substituido pela chave que está na linha Initial Root Token do arquivo `vault.out`
    10. Gerar um root para o vault utilizando o juju, rodar comando `juju run vault/leader generate-root-ca`
34. Esperar todas as unidades estarem em estado `active` e Agent `idle`, rodar o comando `watch -c juju status --color` e esperar.
35. Seu openstack deve estar completamente configurado.
36. Acesse a web UI do openstack

    1. Descubra o ip de acesso para a web UI, rodar o comando `juju status --format=yaml openstack-dashboard | grep public-address | awk '{print $2}' | head -1`
    2. Gere a senha de acesso de admin, rodar o comando `juju exec --unit keystone/leader leader-get admin_passwd`
    3. Copie essa senha para um local de fácil acesso
    4. Abra um novo terminal e crie um acesso ao ip via ssh, rodar o comando `ssh -L 8443:10.42.0.17:80 -p 2002  ubuntu@stratus.dc.ufscar.br`
    5. Acesse a web UI pelo browser de preferência no link `localhost:8443/horizon`
    6. Faça login usando:

       ```json
       username: admin
       password: {salva do passo 36.2}
       domain: admin_domain
       ```
