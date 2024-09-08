# Apt não consegue fazer update

## Background e contextualização

Este problema foi observado no controller _stratus_, o nó de testes que é, parcialmente, subordinado ao controller _cirrus_.
Por questões de praticidade, o _stratus_ tem seu BMC conectado via rede ao _cirrus_, de modo que é possível instanciá-lo,
por exemplo, ao MAAS, dando flexibilidade para derrubar e subir e descer o ambiente de testes sob demanda.

## Descrição do problema

Ao rodar o comando `apt update` é apresentada a seguinte mensagem:

![erro apt update](/img/troubleshoot/apt-cannot-do-update/Erro-apt-update-1.png)

Este erro foi observado duas vezes:

- Quando tirávamos a rede 10.43.0.0 (rede entre o _cirrus_ e o _stratus_), que era descrita no netplan

![configurações do netplan no stratus](/img/troubleshoot/apt-cannot-do-update/Erro-apt-update-2.png)

- Quando o _cirrus_ ficava fora do ar, por exemplo, quando ele era desligado.

Este erro impedia que se instalasse pacotes apt no controller quando a comunicação entre os controllers era interrompida,
mesmo o _stratus_ estando, de fato, conectado à internet.

## Resolução do problema

Como é possível observar na mensagem de erro, tem-se a seguinte mensagem

```sh
Could not connect to 10.43.0.1:8000 (10.43.0.1). - connect (113: No route to host)
```

Isso indica que o apt está usando a rede do cirrus para conectar-se aos seus repositórios. Isso é feito por uma configuração de proxy,
que faz com que o _cirrus_ seja um intermediário em todas as comunicação entre o _stratus_ e os respositórios.

Para resolver isso, deve-se retirar o proxy do _cirrus_ no _stratus_, uma vez que o stratus não deveria estar tão dependente do _cirrus_

1. Listar os arquivos de configuração do apt do stratus

```sh
sudo ls /etc/apt/apt.conf.d
```

temos o seguinte output:

![lista dos arquivos de configuração no diretório apt](/img/troubleshoot/apt-cannot-do-update/Erro-apt-update-3.png)

O arquivo que fala sobre proxy é o `90cunrtin-aptproxy`.

2. Remover a configuração do proxy
   No arquivo `90cunrtin-aptproxy`, tem-se o seguinte:

```conf
# 90cunrtin-aptproxy
Acquire::http::Proxy "http://10.43.0.1:8000/";
```

Deve-se remover essa configuração (pode-se somente comentá-la também)

```diff
# 90cunrtin-aptproxy
- Acquire::http::Proxy "http://10.43.0.1:8000/";
+ # Acquire::http::Proxy "http://10.43.0.1:8000/";
```

3. Por fim, basta testar se o apt consegue fazer seus updates

```sh
sudo apt update
```

Em nosso caso:

![apt update pós configuração](/img/troubleshoot/apt-cannot-do-update/Erro-apt-update-4.png)

## Conclusão e comentários adicionais

Esta configuração do apt deixava o _stratus_ dependente do _cirrus_. Essa mudança permite que, apesar de ainda existir uma hierarquia
entre as máquinas, isso não deixe seu uso independente

## Referências e links úteis

- Como adicionar (e consequentemente como remover) o proxy do apt - https://linuxiac.com/how-to-use-apt-with-proxy/
