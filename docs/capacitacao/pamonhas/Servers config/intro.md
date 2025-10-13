# Objetivo
Este módulo será reservado a configurações dos computadores. Iremos configurar o roteador e fazer algumas tasks de administração de sistemas para podermos no futuro ter facilidade em acessar os computadores remotamente, por exemplo.

O Curau não servirá só de roteador para nós, mas também um front-end em que acessaremos ele e por meio dele acessar os outros computadores remotamente. É por ele que toda a configuração que não tem haver com a cloud em si será tomada.
## Configurações de um Roteador
Primeiramente, você sabe qual é o papel do roteador? Sabe quais são todas as funções que um roteador deve fazer? Quais protocolos estão atrelados à um roteador?

Bom, há pelo menos dois protocolos essenciais que um roteador em qualquer lugar faz:
- **DHCP**: Atribui IP privado aos dispositivos conectados na rede. IPs privados geralmente estarão na faixa _192.168.0.0/16_, _10.0.0.0/8_, _172.0.0.0/8_ (convenção mundial).
> ❓ Você sabe por que precisamos de IPs virtuais hoje em dia? Por que todos os dispositivos não pegam um IP público logo?
- **NAT**: Tradução de endereços privados para público. O dispositivo com IP privado sempre que quiser se conectar a internet, o pacote de rede passará pelo roteador e ele irá trocar o endereço _src_ para o IP público dele. A tradução é feita em uma tabela chamada _conntrack_.

---

# Atividades

## Atribuição de IP Público
O Curau tem três entradas ethernet, duas para conexão no switch e  outra para IP público. Coloque a única entrada vazia na DMZ, é para ter na parede uma entrada com uma marcação dizendo ser DMZ e qual IP público o roteador receberá.

## DHCP
Nesta atividade, suba um DHCP server no Curau e faça com que os Pamonhas recebam IP privado. 

Este server tem que entregar IPs na faixa **192.168.35.0/24**, o IP do Curau deve ser **192.168.35.254**.
> ⚠️ **ATENÇÃO:** essas configurações devem ser para a rede da VLAN com ID 1! A VLAN 2 não deve ter DHCP e apenas o Curau deve ter IP nela, com valor **10.10.35.254/24** (mas por enquanto pode relevar essa VLAN caso queira).

Para mais detalhes use o tutorial: _1-config-dhcp-server_.

## NAT
Seu objetivo aqui é fazer com que o Curau vire um roteador. Pesquise como é possível fazer isso e que seja persistível (caso o Curau reinicie, essa função tem que continuar funcionando).

## Configurando SSH
Esta parte é necessária para ter acesso remoto ao cluster. Caso essa atividade tenha exito, você poderá acessar o cluster de fora do laboratório (muito conveniente não!? ;)

Para mais detalher consulte o tutorial: _0-config-ssh-server_.

---
# Conclusão
Neste módulo mesmo não mexendo com nada sobre cloud, ainda sim aprendemos noções valiosas de administração de sistema.

Imagina em vez de ter um DHCP server, você colocar IP na mão sempre... Imagina se seu "datacenter" não estivesse em tão fácil acesso como agora (por exemplo em outro estado do Brasil), como você acessaria os computadores sem SSH? Como seria para acessar se não tivesse um IP público?

Neste momento da capacitação, o aluno deve ter uma noção completa de como funciona nosso cluster, conseguindo entender os protocolos que estão acontecendo e podendo resolver problemas mais profundos de rede, principalmente.

No próximo módulo, vamos dar inicio a construção da nossa cloud!
