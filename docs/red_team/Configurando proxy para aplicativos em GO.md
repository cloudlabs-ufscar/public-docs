# Configurando proxy para CLI

#### Motivação
O objetivo é utilizar proxies como Owasp Zap, Burp Suite e Caido com aplicações escritas em Go para possibilitar interceptação de requests.
#### Proposta
Aplicações escritas em Go com frequência utilizam a lib padrão http/net. Den[tro dessa lib, é possível definir a variável de ambiente HTTP_PROXY](https://pkg.go.dev/golang.org/x/net/http/httpproxy) que caso seja definida, redirecionará as requests para o endereço especificado permitindo interceptar as requests.
#### Passo a Passo
Inicialmente, devemos obter o Certificate Authority, processo que depende do proxy sendo utilizado.
##### burpsuite
Para obter o certificado, você pode acessar a interface do Burp Proxy diretamente no navegador visitando [http://burpsuite](http://burpsuite) ou inserindo a URL do seu escutador de Proxy, por exemplo: [http://127.0.0.1:8080](http://127.0.0.1:8080).

![burpsuite CA](/img/red_team/burpsuite.png)

Você pode baixar uma cópia do certificado CA (Certificate Authority) do Burp.
##### caido
1. Após iniciar o Caido em sua máquina, navegue até `localhost:8080` (ou a porta que você configurou para que o Caido escute) e faça login.

![User dropdown.](https://docs.caido.io/assets/import_cert_config.nEyN9o8e.png)

2. Clique no ícone da sua conta no canto superior-direito da janela do Caido.
3. Selecione a aba "CA Certificate" ou navegue até [http://localhost:8080/#/settings/certificate](http://localhost:8080/#/settings/certificate)..
![](https://docs.caido.io/assets/cert_instructions_new.CSQWcO4i.png)

#### Utilizando certificados de sistema
Considerando que a ferramenta que receberá as requests está configurada ouvindo em 127.0.0.1:8080, exporta-se a variável de ambiente da seguinte maneira:
`export HTTPS_PROXY="http://localhost:8080"`

Para interceptar pacotes HTTPS/TLS, é necessário instalar o CA (Certificate Authority) do proxy. Com esse arquivo em mãos (com extensão .crt ou .cer) deve-se mover o certificado para o seguinte diretório `/usr/share/ca-certificates/trust-source/anchors`, após mover o arquivo para o diretório, rode o seguinte comando para instalar o certificado: `sudo update-ca-trust extract`

[Para mais informações a respeito de gerenciamento de CAs.](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/7/html/security_guide/sec-shared-system-certificates#sec-Shared-System-Certificates)

#### Resultados
Com tudo funcionando, é possível interceptar as requests e ver exatamente o que está sendo enviado pela CLI, isso pode ser especialmente útil para testes de segurança e debugging em geral.

![Requisição realizada pela CLI sendo interceptada pelo proxy.](/img/red_team/intercepted.png)
