- lista dos componentes de hardware
- função de cada hardware
- processo de montagem computadores
- processo de formatação
- processo de configuração do switch
	- montagem de cabos

# Objetivo
Arquitetar e montar nosso "datacenter". A arquitetura que queremos construir é a seguinte:

![[Pasted image 20251010142607.png]]
## Entendendo a arquitetura
O cluster é formado por três _compute nodes_, computadores responsáveis por executar os serviços da nuvem, como **máquinas virtuais (VMs)** e **containers**. Esses nós são as máquinas **pamonha1**, **pamonha2** e **pamonha3**.

Além disso, contamos com **um switch** e **um roteador**, que garantem a conectividade entre todas as máquinas (switch) e o acesso à internet (roteador).  
O roteador do cluster é o computador **Curau**, que faz o papel de gateway da rede.

> 💡 **Curiosidade:** sabia que a maioria dos roteadores são computadores **Linux**?  
> Isso significa que podemos transformar praticamente qualquer computador comum em um roteador funcional!

Para conectar os computadores e o roteador, precisamos criar uma rede local (LAN), que será nossa **REDE 1**. Porém, como é possível ver, há outra rede chamada **REDE 2**, ela será importante posteriormente no terceiro módulo dessa capacitação e não vale a explicação nesse momento.

Por enquanto, o importante é entender como vamos ter duas redes diferentes com um único switch. Para isso funcionar iremos precisar configurar uma VLAN. 

### Questões para se perguntar...
1. Por que não transformar um dos pamonhas como roteador e ter menos nós?
2. Para que serve um switch? Em que camada do modelo OSI ele opera e por que opera nela?
3. O que é VLAN? Como isso funciona? Para que serve?
4. Como funciona um roteador?
### Material para estudar
- Roadmap virtualização de redes (estudar primeiros protocolos: ARP, NAT, DHCP, DNS e modelo OSI)

---
Agora que já descrevemos o nosso cluster vamos por a mão na massa para colocar de pé as máquinas:

#### 1. Colocar as placas de rede nas máquinas
As máquinas Pamonhas para poderem estar em duas redes ao mesmo tempo elas precisam de 2 interfaces de rede. Verifique se elas tem. Caso não tenham, tem placas de rede soltas para conectar na placa mãe delas. Retire a tampa dos gabinetes e insira as placas de rede na placa mãe. Certifique-se de colocar com cuidado.

#### 2. Formatar computadores
Quando todos os computadores estiverem prontos. Formate cada computador com **Ubuntu-24.02**. 
Mas atenção, as máquinas **pamonhas** tem 2 HDs, formate os dois, coloque o SO em um e o outro divida em duas partições (usaremos ele mais tarde também, mas certifique-se de deixá-lo limpo, apenas 2 partições do mesmo HD vazia).
Para o login, fica a seu critério, como é um abiente de teste o recomendado é algo fácil de reconhecimento e acesso:
- **nome da máquinas / login**: pamonha1 / pamonha2 / pamonha3 / curau
- **senha**: 1234

Poxa, que trabalho, imagina se estivessemos em um datacenter com vários computadores. Será que teríamos que formatar cada um na mão? Será que existe alguma maneira de automatizar para vários computadores? 🤔

#### 3. Configurar VLANs no switch
Agora as coisas ficam mais interessantes. Para essa parte necessitamos que pelo menos um computador já esteja funcionando.

Ligue o switch na tomada e conecte ele (em qualquer porta) no computador de sua escolha por um cabo ethernet.

Para configurar o switch, precisamos nos conectar com ele atraves dessa maquina.

Para isso, por meio do manual do switch (que pode ser pego atraves desse link) procure pelo IP default que o switch tem. Quando encontrar, configure a interace de rede do seu computador conectada ao switch para ter a mesma faixa de ip que ela(faixa de ip != ip igual), quando estiver setando o ip da interface, coloque com um CIDR /24.

A melhor maneira de saber se você tem conexão com um computador é por meio de ping (você ainda usará muuito hehe). Então faça:
```sh
ping <ip-switch>
```

Caso o ping estiver dando certo, SUCESSO, você consegue se comunicar com o switch! Agora vamos conecte-se por **telnel** no switch.

> ❓**O que é telnet** ❓
> Ferramenta parecida com o famoso **SSH**. Ela era a maneira antiga de se conectar em computadores, mas se tornou obsoleta com a chegada do Secure Shell.
> Note que quando se conectar, não é possível dar delete nas palavras. Então se você errou algum comando, só de **Enter**, ele reconhecerá que está errado e faça de novo.

```sh
telnet <ip-switch>
```

Neste momento é importante que você já saiba o que é VLAN e como funciona redes LAN. Vamos configurar para o switch ter algumas entradas com ID 1 e algumas outras com ID 2. Esse trabalho de padronização é de sua responsabilidade, qual a melhor maneira de segmentar o switch? Ou seja, quais melhores endpoints ethernets para se colocar ID 1 e ID 2, para ser fácil de visualização e manutenções futuras?

#### 4. Deixar tudo preparado
Se já chegou aqui, PARABÉNS! Você é uma das únicas pessoas desse departamento que configurou VLANs e arquitetou uma topologia de rede!

Esse é o último passo, agora vamos deixar tudo pronto para não precisarmos mexer mais no hardware e focar completamente em software.

Deixe os computadores Pamonhas em um cantinho no chão ligados na tomada. Coloque o switch em cima deles para economizar espaço. O roteador (máquina Curau) coloque em cima, para podermos diferenciar ele.

Conecte as Pamonhas e o Curau no switch, todos esses computadores devem ser ligados por cabo ethernet no switch com dois cabos: um na VLAN com ID 1, e outro na VLAN com ID 2.

Quando isso estiver completo, meus parabéns mais uma vez! Você acaba de concluir o módulo 1 do nosso treinamento. Agora com todo a parte de hardware instalada, podemos dar prosseguimento para a parte de software e ver coisas mais interessantes!

Até a próxima e bons estudos! 