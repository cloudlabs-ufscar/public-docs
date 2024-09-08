---
sidebar_label: Git
---

# Handbook de Git

## O que é o Git?

O Git é um sistema de controle de versão distribuído projetado para gerenciar e acompanhar mudanças no código-fonte durante o desenvolvimento de software.

Aqui estão alguns pontos chave sobre o Git:

- **Controle de Versão Distribuído:** Diferente dos sistemas de controle de versão centralizados, onde existe um único repositório central, no Git cada desenvolvedor tem uma cópia completa do repositório, incluindo todo o histórico de mudanças.

- **Histórico de Alterações:** O Git registra cada alteração no código, permitindo que os desenvolvedores revertam para versões anteriores, comparem mudanças ao longo do tempo e identifiquem quem fez determinadas alterações e quando.

- **Branching e Merging:** O Git facilita a criação de ramificações (branches) para que os desenvolvedores possam trabalhar em diferentes funcionalidades ou correções de bugs de forma isolada. Essas ramificações podem ser posteriormente mescladas (merged) de volta à linha principal de desenvolvimento (geralmente chamada de main ou master).

- **Colaboração:** O Git permite que múltiplos desenvolvedores colaborem de maneira eficiente. Eles podem clonar repositórios, criar branches, fazer commits de suas alterações e solicitar a mesclagem dessas alterações (usando pull requests ou merge requests).

- **Desempenho:** O Git é conhecido por sua eficiência em gerenciar projetos grandes. Operações como commit, diff e log são realizadas localmente, tornando-as rápidas.

- **Integridade dos Dados:** O Git usa um modelo de dados baseado em hash (SHA-1) para identificar de maneira única cada arquivo e commit, garantindo a integridade e prevenindo alterações não autorizadas no histórico.

## O que é versionamento?

Versionamento é o processo de gerenciar e registrar as diferentes versões de um software, documento ou qualquer conjunto de informações ao longo do tempo. Ele permite que você acompanhe mudanças, reverta a versões anteriores, compare diferenças entre versões e entenda a evolução do projeto.

No contexto de desenvolvimento de software, o versionamento é frequentemente realizado utilizando sistemas de controle de versão como o Git, que mantém um histórico detalhado de todas as modificações feitas no código-fonte e facilita a colaboração entre desenvolvedores.

## Comandos Básicos do Git

### git init

Inicializa um novo repositório Git.

### git clone [url]

Clona um repositório existente de um servidor remoto. Para isso, normalmente, é necessário algum tipo de autenticação que pode ser feita via http ou ssh (mais seguro).

### git add [arquivo]

Adiciona arquivos ao índice (staging area) para serem commitados.

### git commit -m ["mensagem"]

Faz o commit das alterações no índice com uma mensagem descritiva.

### git status

Mostra o estado das alterações no repositório.

### git log

Exibe o histórico de commits.

### git branch

Lista as branches no repositório.

### git branch [new branch name]

Cria uma nova branch.

### git checkout [branch/tag]

Muda para uma branch ou tag específica.

### git merge [branch name]

Mescla uma branch específica na branch atual.

### git pull

Atualiza o repositório local com as mudanças de um repositório remoto.

### git push

Envia as mudanças do repositório local para um repositório remoto.

### git fetch

Atualiza o repositório local com as alterações do repositório remoto padrão configurado (geralmente chamado de origin). Esse comando busca todas as referências e branches novos ou atualizados do repositório remoto padrão, permitindo que você veja o que mudou antes de decidir como integrar essas alterações ao seu trabalho local.

### git fetch [url]

Atualiza o repositório local com as alterações de um repositório remoto específico, identificado pela URL fornecida. Esse comando busca todas as referências e branches novos ou atualizados do repositório remoto especificado, permitindo que você veja o que mudou antes de decidir como integrar essas alterações ao seu trabalho local, independentemente do repositório remoto padrão configurado.

### git rebase [branch]

Reaplica seus commits no topo de outra branch. Esse comando é usado para integrar mudanças de uma branch em outra de uma maneira linear, criando um histórico de commits mais limpo e linear. Ao invés de criar um merge commit, o rebase aplica cada commit da sua branch atual na base da branch especificada, um por um, reescrevendo o histórico de commits.

### Conclusão

Esses são apenas alguns dos comandos e conceitos básicos do Git. Ele é uma ferramenta poderosa com uma ampla gama de funcionalidades que permitem gerenciar eficientemente o desenvolvimento de software, especialmente em ambientes colaborativos
