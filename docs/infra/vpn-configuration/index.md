# Como configurar a vpn

## Gerar as chaves do controller
```sh
wg genkey | tee private.key | wg pubkey > public.key
```

## Configurar o controller
```conf
[Interface]
PrivateKey = <controller-private-key>
Address = 10.10.66.1/24
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o enp3s0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o enp3s0 -j MASQUERADE
ListenPort = 51820

[Peer]
PublicKey = <client-public-key>
AllowedIPs = 10.10.66.<i>/32
```

## Gerar as chaves do cliente
```sh
wg genkey | tee private.key | wg pubkey > public.key
```

## Configurar o client
```conf
[Interface]
PrivateKey = <client-private-key>
Address = 10.10.66.<i>/32

[Peer]
PublicKey = <controller-public-key>
AllowedIPs = 10.10.0.0/16, 200.18.99.0/24
Endpoint = nimbus.dc.ufscar.br:51820
PersistentKeepalive = 23
```
