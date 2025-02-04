

## base bundle: bundle.yaml
```yaml
machines:
  '0': # mysql 1, ovn-central 1
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '1': # mysql 2, ovn-central 2
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '2': # mysql 3, ovn-central 3
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '3': # glance
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '4': # keystone
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '5': # neutron-api
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '6': # placement
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '7': # nova-cloud-controller
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '8': # dashboard
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '9': # vault
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '10': # rabbitmq
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '11': # heat
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
# '12': # cinder
#   constraints: tags=cinder-cirrus zones=cirrus
# '13': # nova-compute 0 (compute 0 cirrus)
#   constraints: tags=c0c zones=cirrus
# '14': # nova-compute 1 (compute 1 cirrus)
#   constraints: tags=c1c zones=cirrus
# '15': # octavia
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
# '16': # swift-proxy
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
# '17': # grafana
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus

relations:
# identity
- - glance:identity-service                     # glance
  - keystone:identity-service
- - neutron-api:identity-service                # neutron-api
  - keystone:identity-service
- - nova-cloud-controller:identity-service      # nova-cloud-controller
  - keystone:identity-service
- - openstack-dashboard:identity-service        # openstack-dashboard
  - keystone:identity-service
- - placement:identity-service                  # placement
  - keystone:identity-service
- - heat:identity-service                       # heat
  - keystone:identity-service

# rabbitmq
- - glance:amqp                                 # glance
  - rabbitmq-server:amqp
- - neutron-api:amqp                            # neutron-api
  - rabbitmq-server:amqp
- - nova-cloud-controller:amqp                  # nova-cloud-controller
  - rabbitmq-server:amqp
- - heat:amqp                                   # heat
  - rabbitmq-server:amqp

# shared-db
- - glance:shared-db                            # glance
  - glance-mysql-router:shared-db
- - keystone:shared-db                          # keystone
  - keystone-mysql-router:shared-db
- - neutron-api:shared-db                       # neutron-api
  - neutron-mysql-router:shared-db
- - nova-cloud-controller:shared-db             # nova-cloud-controller
  - nova-mysql-router:shared-db
- - openstack-dashboard:shared-db               # openstack-dashboard
  - dashboard-mysql-router:shared-db
- - placement:shared-db                         # placement
  - placement-mysql-router:shared-db
- - vault:shared-db                             # vault
  - vault-mysql-router:shared-db
- - heat:shared-db                              # heat
  - heat-mysql-router:shared-db

# db-router
- - dashboard-mysql-router:db-router            # dashboard-mysql-router
  - mysql-innodb-cluster:db-router
- - glance-mysql-router:db-router               # glance-mysql-router
  - mysql-innodb-cluster:db-router
- - keystone-mysql-router:db-router             # keystone
  - mysql-innodb-cluster:db-router
- - neutron-mysql-router:db-router              # neutron-mysql-router
  - mysql-innodb-cluster:db-router
- - nova-mysql-router:db-router                 # nova-mysql-router
  - mysql-innodb-cluster:db-router
- - placement-mysql-router:db-router            # placement-mysql-router
  - mysql-innodb-cluster:db-router
- - vault-mysql-router:db-router                # vault-mysql-router
  - mysql-innodb-cluster:db-router
- - heat-mysql-router:db-router                 # heat-mysql-router
  - mysql-innodb-cluster:db-router

# certificates
- - glance:certificates                         # glance
  - vault:certificates
- - keystone:certificates                       # keystone
  - vault:certificates
- - mysql-innodb-cluster:certificates           # mysql-innodb-cluster
  - vault:certificates
- - neutron-api:certificates                    # neutron-api
  - vault:certificates
- - neutron-api-plugin-ovn:certificates         # neutron-api-plugin-ovn
  - vault:certificates
- - nova-cloud-controller:certificates          # nova-cloud-controller
  - vault:certificates
- - ovn-central:certificates                    # ovn-central
  - vault:certificates 
- - openstack-dashboard:certificates            # openstack-dashboard
  - vault:certificates
- - placement:certificates                      # placement
  - vault:certificates
- - heat:certificates                           # heat
  - vault:certificates

# image-service
- - nova-cloud-controller:image-service         # nova-cloud-controller
  - glance:image-service

# placement
- - placement:placement                         # placement
  - nova-cloud-controller:placement

# neutron-api
- - nova-cloud-controller:neutron-api           # nova-cloud-controller
  - neutron-api:neutron-api

- - neutron-api-plugin-ovn:neutron-plugin       # neutron-plugin
  - neutron-api:neutron-plugin-api-subordinate

- - ovn-central:ovsdb-cms                   # ovn-central
  - neutron-api-plugin-ovn:ovsdb-cms

applications:
  # Dashboard
  openstack-dashboard:
    charm: ch:openstack-dashboard
    channel: 2023.1/stable
    num_units: 1
    to:
    - '8'
    bindings:
      "": cirrus

  dashboard-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus

  # Glance
  glance:
    charm: ch:glance
    channel: 2023.1/stable
    num_units: 1
    to:
    - '3'
    bindings:
      "": cirrus

  glance-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus

  # Keystone
  keystone:
    charm: ch:keystone
    channel: 2023.1/stable
    num_units: 1
    to:
    - '4'
    bindings:
      "": cirrus

  keystone-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus

  # Neutron api
  neutron-api:
    charm: ch:neutron-api
    channel: 2023.1/stable
    num_units: 1
    options:
      neutron-security-groups: true
      flat-network-providers: physnet
    to:
    - '5'
    bindings:
      "": cirrus

  neutron-api-plugin-ovn:
    charm: ch:neutron-api-plugin-ovn
    channel: 2023.1/stable
    bindings:
      "": cirrus

  neutron-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus

  # Nova cloud controller
  nova-cloud-controller:
    charm: ch:nova-cloud-controller
    channel: 2023.1/stable
    num_units: 1
    options:
      network-manager: Neutron
      console-access-protocol: novnc
    to:
    - '7'
    bindings:
      "": cirrus

  nova-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus

  # Placement
  placement:
    charm: ch:placement
    channel: 2023.1/stable
    num_units: 1
    to:
    - '6'
    bindings:
      "": cirrus

  placement-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus

  # Innodb
  mysql-innodb-cluster:
    charm: ch:mysql-innodb-cluster
    channel: 8.0/stable
    num_units: 3
    to:
    - '0'
    - '1'
    - '2'
    bindings:
      "": cirrus

  # ovn-central
  ovn-central:
    charm: ch:ovn-central
    channel: 23.03/stable
    num_units: 3
    to:
    - '0'
    - '1'
    - '2'
    bindings:
      "": cirrus

  # Vault
  vault:
    charm: ch:vault
    channel: 1.8/stable
    num_units: 1
    to:
    - '9'
    bindings:
      "": cirrus

  vault-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus

  # RabbitMQ Server
  rabbitmq-server:
    charm: ch:rabbitmq-server
    channel: 3.9/stable
    num_units: 1
    to:
    - '10'
    bindings:
      "": cirrus

  # Heat
  heat:
    charm: ch:heat
    channel: 2023.1/stable
    num_units: 1
    to:
    - '11'
    bindings:
      "": cirrus

  heat-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus
```

## overlay cinder: bundle-overlay-cinder.yaml
```yaml
machines:
  '0': # mysql 1, ovn-central 1
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '1': # mysql 2, ovn-central 2
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '2': # mysql 3, ovn-central 3
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '3': # glance
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '4': # keystone
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '5': # neutron-api
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '6': # placement
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '7': # nova-cloud-controller
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '8': # dashboard
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '9': # vault
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '10': # rabbitmq
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '11': # heat
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '12': # cinder
    constraints: tags=cinder-cirrus zones=cirrus
# '13': # nova-compute 0 (compute 0 cirrus)
#   constraints: tags=c0c zones=cirrus
# '14': # nova-compute 1 (compute 1 cirrus)
#   constraints: tags=c1c zones=cirrus
# '15': # octavia
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
# '16': # swift-proxy
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
# '17': # grafana
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus

relations:
- - cinder:image-service                          # image-service
  - glance:image-service
- - cinder:cinder-volume-service                  # cinder-volume-service
  - nova-cloud-controller:cinder-volume-service
- - cinder:certificates                           # certificates
  - vault:certificates
- - cinder-mysql-router:db-router                 # db-router
  - mysql-innodb-cluster:db-router
- - cinder-mysql-router:shared-db                 # shared-db
  - cinder:shared-db
- - cinder:amqp                                   # amqp
  - rabbitmq-server:amqp
- - cinder:identity-service                       # identity-service
  - keystone:identity-service
- - cinder:storage-backend                        # storage-backend
  - cinder-lvm:storage-backend

applications:
  cinder:
    charm: ch:cinder
    channel: 2023.1/stable
    num_units: 1
    options:
      block-device: none
      glance-api-version: 2
    to:
    - '12'
    bindings:
      "": cirrus

  cinder-lvm:
    charm: ch:cinder-lvm
    channel: 2023.1/stable
    options:
      block-device: sdb sdc
      config-flags: "target_helper=lioadm"
    bindings:
      "": cirrus

  cinder-mysql-router:
    charm: ch:mysql-router
    channel: 8.0/stable
    bindings:
      "": cirrus
```

## overlay nova: bundle-overlay-nova.yaml
```yaml
machines:
  '0': # mysql 1, ovn-central 1
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '1': # mysql 2, ovn-central 2
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '2': # mysql 3, ovn-central 3
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '3': # glance
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '4': # keystone
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '5': # neutron-api
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '6': # placement
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '7': # nova-cloud-controller
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '8': # dashboard
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '9': # vault
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '10': # rabbitmq
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '11': # heat
    constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
  '12': # cinder
    constraints: tags=cinder-cirrus zones=cirrus
  '13': # nova-compute 0 (compute 0 cirrus)
    constraints: tags=c0c zones=cirrus
  '14': # nova-compute 1 (compute 1 cirrus)
    constraints: tags=c1c zones=cirrus
# '15': # octavia
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
# '16': # swift-proxy
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus
# '17': # grafana
#   constraints: mem=6G cores=2 root-disk=20G tags=^c0c,^c1c,^cinder-cirrus zones=cirrus

relations:
# nova-compute
- - nova-compute:amqp                       # amqp
  - rabbitmq-server:amqp
- - nova-compute:image-service              # glance
  - glance:image-service
- - nova-compute:neutron-plugin             # neutron-plugin
  - ovn-chassis:nova-compute
- - nova-compute:cloud-compute              # cloud-compute
  - nova-cloud-controller:cloud-compute
- - ovn-chassis:certificates                # certificates
  - vault:certificates
- - ovn-central:ovsdb                       # ovsdb
  - ovn-chassis:ovsdb

applications:
  nova-compute:
    charm: nova-compute
    channel: 2023.1/stable
    num_units: 2
    options:
      config-flags: default_ephemeral_format=ext4
      ephemeral-device: /dev/sdb
      enable-live-migration: true
      enable-resize: true
      migration-auth-type: ssh
      virt-type: kvm
    to:
    - '13'
    - '14'
    bindings:
      "": cirrus

  ovn-chassis:
    charm: ovn-chassis
    channel: 23.03/stable
    options:
      bridge-interface-mappings: br-ex:eno2
      ovn-bridge-mappings: physnet:br-ex
      prefer-chassis-as-gw: true
    bindings:
      "": cirrus
```

## configure-cloud-flavors.sh
```sh
#!/bin/bash

# openstack flavor create
#     [--id <id>]
#     [--ram <size-mb>]
#     [--disk <size-gb>]
#     [--ephemeral-disk <size-gb>]
#     [--swap <size-mb>]
#     [--vcpus <num-cpu>]
#     [--rxtx-factor <factor>]
#     [--public | --private]
#     [--property <key=value> [...] ]
#     [--project <project>]
#     [--project-domain <project-domain>]
#     <flavor-name>

# openstack flavor create --ram 512   --vcpus 1  m1.nano
# openstack flavor create --ram 1024  --vcpus 1  m1.micro
# openstack flavor create --ram 2048  --vcpus 1  m1.small
# openstack flavor create --ram 4096  --vcpus 2  m1.medium
# openstack flavor create --ram 8192  --vcpus 4  m1.large
# openstack flavor create --ram 16384 --vcpus 4  m1.xlarge
# openstack flavor create --ram 32768 --vcpus 4  m1.2xlarge

openstack flavor create --ram 512   --disk 1   --vcpus 1  m2.nano
openstack flavor create --ram 1024  --disk 1   --vcpus 1  m2.micro
openstack flavor create --ram 2048  --disk 20  --vcpus 1  m2.small
openstack flavor create --ram 4096  --disk 10  --vcpus 2  m2.medium
openstack flavor create --ram 8192  --disk 80  --vcpus 4  m2.large
openstack flavor create --ram 16384 --disk 80  --vcpus 4  m2.xlarge
openstack flavor create --ram 32768 --disk 80  --vcpus 4  m2.2xlarge
```

## configure-cloud-images.sh
```sh
#!/bin/bash

wget https://cloud-images.ubuntu.com/xenial/current/xenial-server-cloudimg-amd64-uefi1.img                      	    # Ubuntu 16.04 LTS (Xenial Xerus)
wget https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64.img                            	    # Ubuntu 18.04 LTS (Bionic Beaver)
wget https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img                              	    # Ubuntu 20.04 LTS (Focal Fossa)
wget https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img                              	    # Ubuntu 22.04 LTS (Jammy Jellyfish)
wget https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img					                    # Ubuntu 24.04 LTS (Noble Numbat)
wget https://ap.edge.kernel.org/fedora/releases/40/Cloud/x86_64/images/Fedora-Cloud-Base-Generic.x86_64-40-1.14.qcow2	# Fedora Cloud 40
wget https://ap.edge.kernel.org/fedora/releases/39/Cloud/x86_64/images/Fedora-Cloud-Base-39-1.5.x86_64.qcow2    	    # Fedora Cloud 39
wget https://ap.edge.kernel.org/fedora/releases/38/Cloud/x86_64/images/Fedora-Cloud-Base-38-1.6.x86_64.qcow2    	    # Fedora Cloud 38
wget https://ap.edge.kernel.org/fedora/releases/37/Cloud/x86_64/images/Fedora-Cloud-Base-37-1.7.x86_64.qcow2    	    # Fedora Cloud 37
wget https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-generic-amd64.qcow2				                # Debian 11 (Bullseye)
wget https://cloud.debian.org/images/cloud/bullseye/latest/debian-11-generic-amd64.qcow2				                # Debian 12 (Bookworm)

# openstack image create --disk-format qcow2 --container-format docker --shared --file <qcow-disk> --min-disk 5 --min-ram 1024 '<name-distro>' --fit-width
# openstack image set --public <image-uuid>
# openstack image set <image-uuid> --property hw_vif_model=virtio

openstack image create --disk-format qcow2 --container-format docker --shared --file xenial-server-cloudimg-amd64-uefi1.img --min-disk 5 --min-ram 1024 'Ubuntu 16.04 LTS (Xenial Xerus)' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file bionic-server-cloudimg-amd64.img --min-disk 5 --min-ram 1024 'Ubuntu 18.04 LTS (Bionic Beaver)' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file focal-server-cloudimg-amd64.img --min-disk 5 --min-ram 1024 'Ubuntu 20.04 LTS (Focal Fossa)' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file jammy-server-cloudimg-amd64.img --min-disk 5 --min-ram 1024 'Ubuntu 22.04 LTS (Jammy Jellyfish)' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file noble-server-cloudimg-amd64.img --min-disk 5 --min-ram 1024 'Ubuntu 24.04 LTS (Noble Numbat)' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file Fedora-Cloud-Base-Generic.x86_64-40-1.14.qcow2 --min-disk 5 --min-ram 1024 'Fedora 40' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file Fedora-Cloud-Base-39-1.5.x86_64.qcow2 --min-disk 5 --min-ram 1024 'Fedora 39' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file Fedora-Cloud-Base-38-1.6.x86_64.qcow2 --min-disk 5 --min-ram 1024 'Fedora 38' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file Fedora-Cloud-Base-37-1.7.x86_64.qcow2 --min-disk 5 --min-ram 1024 'Fedora 37' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file debian-11-generic-amd64.qcow2 --min-disk 5 --min-ram 1024 'Debian 11 (Bullseye)' --fit-width
openstack image create --disk-format qcow2 --container-format docker --shared --file debian-12-generic-amd64.qcow2 --min-disk 5 --min-ram 1024 'Debian 12 (Bookworm)' --fit-width

openstack image set --public 'Ubuntu 16.04 LTS (Xenial Xerus)'
openstack image set --public 'Ubuntu 18.04 LTS (Bionic Beaver)'
openstack image set --public 'Ubuntu 20.04 LTS (Focal Fossa)'
openstack image set --public 'Ubuntu 22.04 LTS (Jammy Jellyfish)'
openstack image set --public 'Ubuntu 24.04 LTS (Noble Numbat)'
openstack image set --public 'Debian 11 (Bullseye)'
openstack image set --public 'Debian 12 (Bookworm)'
openstack image set --public 'Fedora 40'
openstack image set --public 'Fedora 39'
openstack image set --public 'Fedora 38'
openstack image set --public 'Fedora 37'
```

## configure-cloud-provider.sh
```sh
#!/bin/bash

# openstack network create                                                                                                                                                                   
# usage: openstack network create [-h] [-f {json,shell,table,value,yaml}] [-c COLUMN] [--noindent] [--prefix PREFIX] [--max-width <integer>] [--fit-width] [--print-empty]
#     [--extra-property type=<property_type>,name=<property_name>,value=<property_value>] [--share | --no-share] [--enable | --disable] [--project <project>]
#     [--description <description>] [--mtu <mtu>] [--project-domain <project-domain>] [--availability-zone-hint <availability-zone>]
#     [--enable-port-security | --disable-port-security] [--external | --internal] [--default | --no-default] [--qos-policy <qos-policy>]
#     [--transparent-vlan | --no-transparent-vlan] [--provider-network-type <provider-network-type>] [--provider-physical-network <provider-physical-network>]
#     [--provider-segment <provider-segment>] [--dns-domain <dns-domain>] [--tag <tag> | --no-tag]
#     <name>

# openstack subnet create                                                                                                                                                               1 ↵  
# usage: openstack subnet create [-h] [-f {json,shell,table,value,yaml}] [-c COLUMN] [--noindent] [--prefix PREFIX] [--max-width <integer>] [--fit-width] [--print-empty]
#     [--extra-property type=<property_type>,name=<property_name>,value=<property_value>] [--project <project>] [--project-domain <project-domain>]
#     [--subnet-pool <subnet-pool> | --use-prefix-delegation USE_PREFIX_DELEGATION | --use-default-subnet-pool] [--prefix-length <prefix-length>] [--subnet-range <subnet-range>]
#     [--dhcp | --no-dhcp] [--dns-publish-fixed-ip | --no-dns-publish-fixed-ip] [--gateway <gateway>] [--ip-version {4,6}]
#     [--ipv6-ra-mode {dhcpv6-stateful,dhcpv6-stateless,slaac}] [--ipv6-address-mode {dhcpv6-stateful,dhcpv6-stateless,slaac}] [--network-segment <network-segment>] --network
#     <network> [--description <description>] [--allocation-pool start=<ip-address>,end=<ip-address>] [--dns-nameserver <dns-nameserver>]
#     [--host-route destination=<subnet>,gateway=<ip-address>] [--service-type <service-type>] [--tag <tag> | --no-tag]
#     <name>

PUBLIC_NETWORK=200.18.99.0/24
PUBLIC_NETWORK_START=200.18.99.112
PUBLIC_NETWORK_END=200.18.99.119
PUBLIC_NETWORK_GATEWAY=200.18.99.1

openstack network create \
--share \
--external \
--provider-network-type flat \
--provider-physical-network physnet \
public-network

openstack subnet create \
--network 'public-network' \
--subnet-range $PUBLIC_NETWORK \
--allocation-pool start=$PUBLIC_NETWORK_START,end=$PUBLIC_NETWORK_END \
--gateway $PUBLIC_NETWORK_GATEWAY \
--dns-nameserver $PUBLIC_NETWORK_GATEWAY --dns-nameserver 1.1.1.1 --dns-nameserver 8.8.8.8 \
--no-dhcp \
'public-subnet'
```

## maas-backup.sh
```sh
#!/bin/sh
# https://maas.io/docs/how-to-back-up-maas

date_timestamp=$(date +%s)

sudo mkdir -p /tmp/maas-backups/$date_timestamp
sudo -i -u postgres pg_dumpall -c > "/tmp/maas-backups/$date_timestamp/database_dump.sql"
sudo snap stop maas
sudo systemctl stop postgresql.service
sudo snap save maas
snapshot_id=$(sudo snap saved | tail -n 1 | awk '{print $1}')
sudo snap export-snapshot $snapshot_id /tmp/maas-backups/$date_timestamp/maas_snapshot.snap

sudo systemctl start postgresql.service
sudo snap restart maas
```