---
sidebar_label: "Configuração da VPN"
---
# Configuração da VPN com Wireguard

```sh
sudo apt install wireguard-tools
```
## Gerar as chaves do controller
```sh
wg genkey | tee private.key | wg pubkey > public.key
```

## Configurar o controller
```conf
[Interface]
PrivateKey = {private.key}
Address = 10.10.66.1/24
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eno2 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eno2 -j MASQUERADE
ListenPort = 51820
MTU = 1420
```

## Gerar as chaves do cliente
```sh
wg genkey | tee private.key | wg pubkey > public.key
```

- Adicionar o peer ao controller:
```sh
# Meu nome é ...
[Peer]
PublicKey = {YOUR PUBLIC KEY}
AllowedIPs = 10.10.66.<i>/32
PersistentKeepalive = 23
```

## Configurar o client
```conf
[Interface]
PrivateKey = {YOUR PRIVATE KEY}
Address = 10.10.66.<i>/32

[Peer]
PublicKey = {public.key}
AllowedIPs = 10.10.0.0/16, 200.18.99.0/24
Endpoint = {cluster}.dc.ufscar.br:51820
PersistentKeepalive = 23
```
