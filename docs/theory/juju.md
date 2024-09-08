---
sidebar_label: "JUJU"
---

# JUJU

## O que é JUJU?

Juju (lê-se "diú-diú") é uma _orquestration engine_ usada para gerenciar _charms_
Ok, rápido demais? Vamos por partes.

### O que é um _operator_?

Com o passar do tempo, os softwares foram ficando cada vez mais complexos, com isso o seu ciclo de vida (instalação, configuração e manutenção) foi ficando extremamente custoso.

Por exemplo, já tentou subir um software de banco de dados (BD) como o Postgres? Há várias etapas a serem configuradas, como autenticação (usuário e senha), onde os dados serão guardados, em qual porta o serviço de banco de dados ficará hospedado (onde o cliente irá se conectar), etc. São muitas configurações.

Com isso, surgiram os _Operators_, que são definidos como softwares, criados para uma aplicação em específico, visando facilitar o gerenciamento da mesma.

### O que é orquestração?

Falar de orquestração em um ambiente, trata-se da coordenação e gerenciamento de um conjunto, que pode ser de computadores, aplicações, ou serviços. Nesses ambientes os múltiplos recursos sendo gerenciados trabalham juntos cada um exercendo suas tarefas, para resultar ao fim a execução de um fluxo maior.

Por exemplo: em vez de se criar uma enorme aplicação que gere o banco de dados, realiza as transações de back-end e oferece um front-end os serviços contenporâneos apostam na divisão do trabalho em várias partes menores que se comunicam via APIs. Deste modo, agora temos um micro-serviço para servir o BD, outro o front-end, outro o back-end, etc.

Deste modo, temos um modelo altamente escalável: seu BD ficou sem armazenamento? basta levantar outro container; seu back-end caiu? Tudo bem, só levantar outro. Contudo, isso trouxe um novo problema: como controlar isso tudo? Ai que entram ferramentas de orquestração, como o Kubernetes. Com ele, é possível gerenciar e coordernar todos esses micro-serviços automaticamente.

### O que é um Kubernetes operator?

Hora de morfar: agora que já sabemos o que é um _operator_ e o que é orquestração, e se juntássemos os dois? Foi isso que pessoas muito inteligentes pensaram. E fizeram. Os _Kubernetes operators_ criam uma interface nova para gerenciar serviços de maneira muito mais fácil, escalável, de maneira que com um único arquivo temos nossa infra todo funcionando perfeitamente.

### O que é um charm?

Charm é o jeito que o JUJU chama seus Kubernetes operators. Sim, só isso. Bem, além disso também existe o charmhub, que é um repositório à la dockerhub onde as pessoas compartilham seus charms para aplicações específicas, ou versões alteranativas.

### OK, mas o que é JUJU?

Bem, long history short, JUJU é uma _orchestration engine_: ela gerencia charms de serviços para criar todo um ambiente automatizado que lança, gerencia e monitora serviços.

## Como o JUJU funciona?

Ok, consegui entender que o JUJU é um software que gerencia charms, que são pacotinhos que encapsulam serviços chatões de fazer na mão de forma autmática. Mas como ele faz isso? Bem, esse é um artigo (posso chamar assim?) de teoria, então vamos lá.

### Substrato

Bem, o JUJU não faz mágica: para que o JUJU lance seus serviços ele precisa de uma _Cloud_. Não, não estou falando de computação em nuvem necessáriamente, como a Magalu Cloud. Para o JUJU, uma _cloud_ é o seu substrato: onde que os chams vão ser lançados?

É em _bare-metal_? são em VMs? São em VMs na nuvem da Magalu Cloud? Deste modo, o JUJU aceita uma variedade de substratos diferentes: LXD, MAAS, microk8s, _Clouds_ comerciais, etc.

Há algumas peculiaridades, como alguns charms voltados para ambientes de nuvem, outros para kubernetes, mas no geral o JUJU deixa isso bem transparente: escolheu a nuvem, deixa que o JUJU resolve o resto.
