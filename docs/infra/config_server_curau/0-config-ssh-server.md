---
sidebar_position: 0
sidebar_label: "Configurando um Servidor SSH Seguro"
---


# Guia: Configurando um Servidor SSH Seguro no Ubuntu 24.04

Este guia detalha o processo de configuração de um servidor SSH para aumentar drasticamente sua segurança. O objetivo é desabilitar a autenticação por senha e utilizar exclusivamente chaves SSH, com um método de gerenciamento centralizado para o administrador.

Neste exemplo, estamos configurando um servidor chamado `curau` rodando **Ubuntu 24.04 Server** com o endereço IP `200.18.99.85/24`.

## Pré-requisitos

*   Acesso root ou um usuário com privilégios `sudo` no servidor.
*   Um cliente SSH em sua máquina local para se conectar ao servidor.

---

### Passo 1: Verificar se o Servidor OpenSSH está Instalado

Primeiro, verifique se o serviço SSH está ativo no servidor:
```bash
systemctl status ssh
```
Se o serviço estiver `active (running)`, pode pular para o Passo 2. Caso contrário, instale-o:
```bash
sudo apt update
sudo apt install openssh-server
```

---

### Passo 2: Gerar e Preparar sua Chave SSH

#### 2.1. Gerando o par de chaves na sua máquina local

Se ainda não tiver uma chave, abra o terminal **na sua máquina local** e execute:
```bash
ssh-keygen -t ed25519 -C "seu_email@exemplo.com"
```
*   Pressione Enter para aceitar o local padrão.
*   **Defina uma "passphrase" (senha) para a chave.** Isso é crucial para a segurança.

#### 2.2. Copiando sua Chave Pública para a Área de Transferência

Como vamos adicionar a chave manualmente, primeiro exiba sua chave pública no terminal local para poder copiá-la.

```bash
cat ~/.ssh/id_ed25519.pub
```
A saída será uma longa linha de texto. **Copie toda essa linha** para a sua área de transferências.

---

### Passo 3: Configurando o Servidor SSH e o Arquivo de Chaves Centralizado

Conecte-se ao servidor `curau` usando sua senha atual para realizar a configuração.

```bash
ssh curau@200.18.99.85
```
Uma vez logado, edite o arquivo de configuração principal do SSH:
```bash
sudo nano /etc/ssh/sshd_config
```
Faça as seguintes alterações de segurança no arquivo:

1.  **Centralizar Arquivos de Chaves Autorizadas:**
    Instrua o SSH a usar um diretório central para os arquivos de chaves. O token `%u` será substituído pelo nome do usuário.
    ```ini
    # Aponta para um diretório central, onde cada usuário tem seu arquivo
    AuthorizedKeysFile /etc/ssh/authorized_keys.d/%u
    ```

2.  **Desabilitar Autenticação por Senha:**
    Encontre `#PasswordAuthentication yes` e mude para `no`.
    ```ini
    PasswordAuthentication no
    ```

3.  **Desabilitar Login Root:**
    Encontre `#PermitRootLogin prohibit-password` e mude para `no`.
    ```ini
    PermitRootLogin no
    ```
Salve o arquivo e saia (`Ctrl + X`, `Y`, `Enter`).

Agora, para **alterar a porta**, usaremos o método recomendado que evita a modificação direta do arquivo principal. Crie um novo arquivo de configuração:
```bash
sudo nano /etc/ssh/sshd_config.d/porta.conf
```
Adicione **apenas** a seguinte linha a este novo arquivo:
```ini
Port 49155
```
Salve e saia. O SSH automaticamente lerá este arquivo e aplicará a configuração, sobrepondo a porta padrão.

---

### Passo 4: Criar e Popular o Arquivo de Chaves

Primeiro, crie o diretório que especificamos na configuração.
```bash
sudo mkdir /etc/ssh/authorized_keys.d
```
Agora, crie o arquivo de chaves **específico para o usuário `curau`** e adicione sua própria chave pública (que você copiou no Passo 2.2) para não perder o acesso.

```bash
# Abre o novo arquivo com o editor nano
# O nome do arquivo 'curau' corresponde ao nome de usuário
sudo nano /etc/ssh/authorized_keys.d/curau
```
**Cole a sua chave pública** no editor. Salve e saia.

Em seguida, defina as permissões corretas. O diretório e o arquivo devem ser acessíveis apenas pelo root para evitar adulteração.
```bash
sudo chmod 755 /etc/ssh/authorized_keys.d
sudo chmod 644 /etc/ssh/authorized_keys.d/curau
sudo chown root:root /etc/ssh/authorized_keys.d/curau
```

---

### Passo 5: Reiniciar o Serviço SSH

Para que todas as novas configurações entrem em vigor, reinicie o serviço SSH.
```bash
sudo systemctl daemon-reload
sudo systemctl restart ssh.service
```
**Atenção:** Mantenha sua sessão atual aberta! Teste a nova configuração em um novo terminal antes de se desconectar para garantir que você não se trancou para fora do servidor.

---

### Passo 6: Liberar a Nova Porta no Firewall

Lembre-se que **você deve configurar o firewall do seu servidor para permitir conexões TCP na nova porta (`49155`)**. A forma de fazer isso depende do software de firewall que você usa (`UFW`, `firewalld`, `nftables`, etc.).

O objetivo é:
1.  Criar uma nova regra para **permitir tráfego de entrada na porta TCP `49155`**.
2.  (Recomendado) Remover a regra antiga que permitia o tráfego na porta 22.

> **Referências Confiáveis para Configuração de Firewall:**
> *   **`UFW` (padrão Ubuntu):** [Guia UFW da DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-22-04)
> *   **`firewalld` (padrão CentOS/Fedora):** [Guia Firewalld da DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-using-firewalld-on-centos-8)
> *   **`nftables`:** [Documentação nftables da Arch Wiki](https://wiki.archlinux.org/title/Nftables)

---
etc/ssh/authorized_keys.d/
### Passo 7: Testar a Nova Configuração

Abra **um novo terminal** na sua máquina local e conecte-se usando a nova porta:
```bash
ssh -p 49155 curau@200.18.99.85
```
A conexão deve ser estabelecida pedindo a **passphrase da sua chave SSH**. Se funcionar, a configuração foi um sucesso.

---
---

### Procedimento: Como Adicionar a Chave de um Novo Usuário

Com o sistema centralizado, apenas um administrador com privilégios `sudo` pode autorizar novas chaves.

**Cenário:** Uma nova colega, "joana", lhe enviou o conteúdo de seu arquivo `id_ed25519.pub`.

#### Passo 1: Faça login no servidor
Conecte-se ao servidor `curau` com sua conta de administrador.

#### Passo 2: Adicione a chave ao arquivo de chaves do usuário `curau`
Use o comando `echo` para anexar (com `>>`) a chave pública de "joana" ao final do arquivo. Como "joana" se conectará como o usuário `curau`, sua chave deve ser adicionada ao arquivo `/etc/ssh/authorized_keys.d/curau`.

```bash
# Adiciona um comentário identificador
echo "# Chave para a usuária joana" | sudo tee -a /etc/ssh/authorized_keys.d/curau

# Adiciona a chave pública de joana (cole o conteúdo da chave dela aqui)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC... joana@notebook" | sudo tee -a /etc/ssh/authorized_keys.d/curau
```
> **Nota:** O uso de `tee -a` com `sudo` é uma forma robusta de anexar conteúdo a um arquivo protegido. **Nunca use `>` sozinho**, pois isso irá apagar todas as chaves existentes!

Existe também a possibilidade da Joana criar seu proprio usuário no servidor com as permissões que desejar, juntamente com um arquivo `joana` em `/etc/ssh/authorized_keys.d/`. Com isso ela pode logar com seu usuário joana sem maiores problemas

#### Passo 3: Verificação
**Nenhuma reinicialização do serviço SSH é necessária.** Assim que a chave é adicionada ao arquivo, "joana" pode imediatamente tentar fazer login no servidor com o usuário `curau`, usando a chave privada dela.