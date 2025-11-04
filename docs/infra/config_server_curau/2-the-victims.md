# A fênix
No LP35, existem 4 criaturas que estão perecendo e ressurgindo há eras, elas são chamadas **PAMONHAS!!!**

Brincadeiras à parte, tratam-se de 4 máquinas que servem como porta de entrada para o mundo da _cloud_. Sua missão, como aspirante é conquistar as quatro insígnias: Rede, Storage, Autenticação, Incus e Observabilidade

Eu aqui, relatarei minha experiencia, que não é necessáriamente é o que você precisa fazer pra chegar no destino

### A primeira badge - O bare metal

Na verdade o que temos aqui são 4 computadores desktop e precisamos que eles sirvam como servidores de cloud, tal qual uma _aws_ , _gcp_, _mgc_,_oracle_.

O primeiro passo pra isso é ter um sistema operacional em pelo menos uma delas, esse teremos que fazer **na mão**, então seu primeiro trabalho, antes da badge é instalar um sistema operacional (no meu caso estarei indo com ubuntu 24.04 server) na máquina, sinta-se a vontade para instalar com um pendrive ou como preferir.

Com o ubuntu instalado na primeira máquina, o **roteador**, temos um meio de gerenciar e acessar as outras máquinas, que ainda não estão sequer configuradas, imagine disponíveis.

### A segunda badge - Automatização do provisionamento de SO

Poderiamos agora repetir o processo de instalação do ubuntu nas outras máquinas, as pamonhas, mas seria um pouco custoso fazer isso em 3 máquinas, agora imagine em centenas, fica impraticável!!! 

Pensando nesse problema surgem estratégias de automação de provisionamento (disponibilização + instalação) do SO.

#### Um pouco antes
Precisamos entender como as máquinas se identificam e como organizaremos elas. Para isso usaremos endereços de IP, vamos criar uma tabela incremental:

| Rede/Sub-rede        | Função                                      | Observações                                                          |
| -------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| **192.168.100.0/24** | Geral                     |  Destinada à comunicação geral entre as máquinas.     |

Fisicamente, o que precisa ser feito é ligar as quatro máquinas no mesmo switch ethernet. 

Já lógicamente precisamos configurar os IP's das máquinas nessa rede, começando pelo **roteador**, vamos configurar um IP estático via netplan (busque guias na documentação), após isso vamos configurar um servidor DHCP para que as outras máquinas tenham IP's bem definidos