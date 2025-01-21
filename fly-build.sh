#! /bin/bash

# Installa BunJS
curl -fsSL https://bun.sh/install | bash

# Aggiungi Bun al PATH
export PATH="/root/.bun/bin:$PATH"

# Installa le dipendenze con Bun
bun install

# Esegui la build del progetto
bun build
