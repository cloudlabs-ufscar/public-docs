# Objetivo
Neste módulo nosso objetivo principal é subir uma cloud funcional do zero. Este é o ataque ao cume da montanha, mais um pouco e seu serviço já estará funcionando.

## Guias de estudos
- Roadmap completo sobre virtualização de redes (Geneve, Openflow, bridge, namespace, etc).
- Open Virtual network (OVN) e Software Defined Network (SDN)
- Ceph e Linstor, ferramentas de storage.
- Load Balancers (layer 4 e layer 7)

## Perguntas
- ...

---
# Atividades
Este será o nosso maior módulo e algumas atividades podem ser mais complexas que outras.

Dito isso, a maioria das atividades terão uma página dedicada a elas. Assim, quando isso acontecer, avisaremos. Por enquanto fique nesta página e acompanhe a trajetória das atividades para entender o fluxo.

## 1. Setup Cluster Incus
O software que usaremos para construir nossa cloud é o **Incus**, fork do projeto da Canonical LXD. Com ele poderemos criar fácil e rapidamente máquinas virtuais, containers e redes virtuais.

Para subir o Incus, acesse a documentação e encontre como configurar um cluster Incus.
> ⚠️ **Atenção**: Esse cluster deve ser feito somente nas Pamonhas.
> A partir de agora só configuraremos algo no Curau caso seja explicitamente dito que precisa. Se não for, fica implícito que só nos Pamonhas é necessário.

Esta parte não deve ser demorada, você irá apenas fazer `incus init` nos nós e passar os tokens para o nó mestre (priorize sempre o Pamonha1 como mestre em tudo). Assim que estiver pronto, faça:
```sh
incus cluster ls
```

Caso apareça todos os 3 nós, SUCESSO! Nossa cloud está de pé!! 🤩

Porém, mesmo de pé, ainda falta bastante coisa para configurar para se tornar funcional...

## 2. Setup OVN Cluster
O Open Virtual Network é bastante extenso e requer bastante estudo para entende-lo, para explicações e outros direcionamentos, acesse _2. Setup OVN Cluster_

## 3. Setup Ceph e Linstor
Duas ferramentas que fazem storage (discos virtuais para nossas VMs) de maneira diferente. Acesse _3. Setup Ceph e Linstor_ para mais detalhes.

## 4. Testes com Load Balancers
A parte mais divertida (na opinião do Luiz hehe) da capacitação! Acesse _4. load balancer_ para mais detalhes.

---
# Conclusão
Meus parabéns! 🥳 Se você chegou até aqui você configurou uma Cloud do zero manualmente!

Mesmo que esse material seja apenas para capacitação, o conhecimento e a experiêcia prática que foi adquirida é extremamente significativa. Provavelmente seus horizontes sobre computação aumentaram muito.

E digo mais, você nunca mais verá qualquer cloud como antes, mesmo as públicas! hehe

Eai? Que parte você achou mais interessante? E outra... agora que você já sabe andar com os próprios pés neste vasto mundo, a pergunta que realmente importa é, **em qual área você quer se aprofundar?**
