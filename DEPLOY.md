# 🚀 Guia de Deploy - API de Usuários

Este guia fornece instruções passo a passo para configurar o deploy automático da API de Usuários no servidor VPS da Hostinger usando Docker e GitHub Actions.

## 🖥️ Informações do Servidor

- **IP do Servidor**: `72.61.223.230`
- **Servidor**: VPS Hostinger
- **Porta Homologação**: `5333`
- **Porta Produção**: `3333`

## 📋 Pré-requisitos

- Servidor VPS da Hostinger com acesso SSH
- Conta no GitHub com acesso ao repositório
- Docker e Docker Compose instalados no servidor
- Git instalado no servidor

## 🏗️ Estrutura de Deploy

- **Homologação**: Porta `5333` (branch `homolog`)
- **Produção**: Porta `3333` (branch `main`)

Cada ambiente roda em um container Docker separado.

---

## 📝 Passo 1: Configuração Inicial no Servidor VPS

### 1.1 Conectar ao servidor VPS

```bash
ssh seu-usuario@72.61.223.230
# Exemplo: ssh root@72.61.223.230
```

### 1.2 Executar script de configuração inicial

```bash
# Fazer upload do script setup-server.sh para o servidor ou criar manualmente
# Depois executar:
chmod +x setup-server.sh
./setup-server.sh
```

**OU** instalar manualmente:

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Git (se necessário)
sudo apt-get update
sudo apt-get install -y git
```

### 1.3 Criar diretório do projeto

```bash
sudo mkdir -p /var/www/api-usuarios
sudo chown $USER:$USER /var/www/api-usuarios
cd /var/www/api-usuarios
```

### 1.4 Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git .
# OU se já existe:
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git fetch origin
git checkout -b homolog origin/homolog
```

---

## 🔐 Passo 2: Configurar Variáveis de Ambiente no GitHub Actions

As variáveis de ambiente serão configuradas como **Secrets** no GitHub Actions, não é necessário criar arquivo `.env` no servidor.

### 2.1 Acessar configurações de Secrets

1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret** para cada variável abaixo

### 2.2 Adicionar as seguintes Secrets:

Configure as seguintes secrets no GitHub Actions:

#### Secrets de Infraestrutura:
- `VPS_SSH_PRIVATE_KEY` - Chave SSH privada para acesso ao servidor (veja **Passo 3** para instruções detalhadas de como gerar)
- `VPS_HOST` - `72.61.223.230`
- `VPS_USER` - Usuário SSH do servidor (ex: `root`)
- `VPS_DEPLOY_PATH` - `/var/www/api-usuarios`

#### Secrets de Banco de Dados:
- `DB_HOST_HOMOLOG` - Host do banco de dados PostgreSQL para homologação
- `DB_HOST_MAIN` - Host do banco de dados PostgreSQL para produção
- `DB_PORT_HOMOLOG` - Porta do banco para homologação (geralmente `5432`)
- `DB_PORT_MAIN` - Porta do banco para produção (geralmente `5432`)
- `DB_NAME_HOMOLOG` - Nome do banco de homologação (ex: `marshall_homolog`)
- `DB_NAME_MAIN` - Nome do banco de produção (ex: `marshall_prod`)
- `DB_USER_HOMOLOG` - Usuário do banco de dados para homologação
- `DB_USER_MAIN` - Usuário do banco de dados para produção
- `DB_PASS_HOMOLOG` - Senha do banco de dados para homologação
- `DB_PASS_MAIN` - Senha do banco de dados para produção

#### Secrets de Aplicação:
- `APP_WEB_URL_HOMOLOG` - URL da aplicação web para homologação (ex: `https://homolog.seu-dominio.com`)
- `APP_WEB_URL_MAIN` - URL da aplicação web para produção (ex: `https://seu-dominio.com`)
- `API_COMUNICACOES_URL_HOMOLOG` - URL da API de comunicações para homologação (ex: `http://localhost:3334/api`)
- `API_COMUNICACOES_URL_MAIN` - URL da API de comunicações para produção (ex: `http://localhost:3334/api`)

#### Secrets de Segurança:
- `JWT_SECRET` - Chave secreta para JWT (use uma string longa e aleatória)
- `JWT_EXPIRES_IN` - Tempo de expiração do JWT (ex: `2h`)
- `CRYPTO_SECRET` - Chave secreta para criptografia (use uma string longa e aleatória)

**⚠️ IMPORTANTE**: 
- Todas essas secrets serão usadas automaticamente pelo GitHub Actions durante o deploy
- Não é necessário criar arquivo `.env` no servidor
- As secrets são injetadas como variáveis de ambiente nos containers Docker durante o deploy

---

## 🔑 Passo 3: Gerar e Configurar Chave SSH

### 3.1 Conectar ao servidor VPS

Primeiro, conecte-se ao servidor usando suas credenciais:

```bash
ssh seu-usuario@72.61.223.230
```

**Nota**: Se você ainda não tem acesso SSH configurado, use as credenciais fornecidas pela Hostinger (geralmente via painel de controle ou email de boas-vindas).

### 3.2 Gerar chave SSH para deploy

Uma vez conectado ao servidor, execute os seguintes comandos:

```bash
# Gerar uma nova chave SSH específica para o GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Quando solicitado, pressione ENTER para usar a senha padrão (vazio)
# Ou defina uma senha se preferir maior segurança
```

**Importante**: Pressione ENTER quando solicitado a inserir uma passphrase (senha), ou defina uma senha se preferir. Para deploy automatizado, geralmente é melhor deixar sem senha.

### 3.3 Adicionar chave pública ao authorized_keys

Adicione a chave pública ao arquivo `authorized_keys` para permitir o acesso:

```bash
# Adicionar a chave pública ao authorized_keys
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys

# Garantir permissões corretas
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3.4 Obter a chave privada

Agora você precisa copiar a chave **privada** completa. Execute:

```bash
# Exibir a chave privada completa
cat ~/.ssh/github_actions_deploy
```

Você verá algo como:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACD...
(muitas linhas de caracteres)
...
-----END OPENSSH PRIVATE KEY-----
```

**⚠️ IMPORTANTE**: 
- Copie **TUDO**, incluindo as linhas `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`
- Esta é uma informação sensível - mantenha-a segura
- Você precisará desta chave completa no próximo passo

### 3.5 Alternativa: Usar chave SSH existente

Se você já tem uma chave SSH configurada no servidor e deseja usá-la:

```bash
# Verificar chaves SSH existentes
ls -la ~/.ssh/

# Se você já tem uma chave (ex: id_rsa, id_ed25519), pode usar ela:
cat ~/.ssh/id_ed25519
# OU
cat ~/.ssh/id_rsa
```

**Nota**: Se usar uma chave existente, certifique-se de que a chave pública correspondente já está em `~/.ssh/authorized_keys`.

### 3.6 Adicionar chave SSH como Secret no GitHub

Agora você precisa adicionar a chave privada como uma secret no GitHub Actions:

1. **Acesse seu repositório no GitHub**
   - Vá para: `https://github.com/seu-usuario/seu-repositorio`

2. **Navegue até as configurações de Secrets**
   - Clique em **Settings** (no topo do repositório)
   - No menu lateral esquerdo, clique em **Secrets and variables**
   - Clique em **Actions**

3. **Criar nova secret**
   - Clique no botão **New repository secret**
   - **Name**: Digite exatamente `VPS_SSH_PRIVATE_KEY`
   - **Secret**: Cole a chave privada completa que você copiou no passo 3.4
     - Certifique-se de incluir as linhas `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`
     - Cole tudo em uma única linha ou mantenha a formatação original
   - Clique em **Add secret**

4. **Verificar**
   - Você deve ver `VPS_SSH_PRIVATE_KEY` na lista de secrets
   - O valor não será exibido por segurança (mostra apenas `••••••••`)

**Nota**: As outras secrets (VPS_HOST, VPS_USER, VPS_DEPLOY_PATH e todas as variáveis de ambiente) devem ser configuradas no **Passo 2.2** acima.

---

## 🐳 Passo 4: Testar Deploy Manual (Opcional)

Antes de configurar o deploy automático, teste manualmente:

```bash
cd /var/www/api-usuarios

# Para homologação
./scripts/deploy.sh homolog

# Para produção
./scripts/deploy.sh main
```

Ou manualmente:

```bash
# Para homologação
git checkout homolog
git pull origin homolog
docker-compose build api-usuarios-homolog
docker-compose up -d api-usuarios-homolog

# Para produção
git checkout main
git pull origin main
docker-compose build api-usuarios-main
docker-compose up -d api-usuarios-main
```

### Verificar se os containers estão rodando:

```bash
docker-compose ps
docker-compose logs api-usuarios-homolog
docker-compose logs api-usuarios-main
```

### Testar a API:

```bash
# Homologação
curl http://localhost:5333/api/health

# Produção
curl http://localhost:3333/api/health
```

---

## ⚙️ Passo 5: Configurar Deploy Automático

### 5.1 Fazer commit e push dos arquivos de configuração

```bash
# No seu ambiente local
cd api-usuarios

git add .
git commit -m "feat: adiciona configuração de deploy com Docker e GitHub Actions"
git push origin homolog
```

### 5.2 Verificar o workflow no GitHub

1. Acesse seu repositório no GitHub
2. Vá em **Actions**
3. Você verá o workflow "Deploy API Usuários - Homologação" sendo executado
4. Clique para ver os logs em tempo real

### 5.3 Deploy automático

Agora, sempre que você fizer push para a branch `homolog`, o deploy será executado automaticamente!

Para a branch `main`, o deploy também será automático quando houver push.

---

## 🔍 Passo 6: Verificar e Monitorar

### 6.1 Verificar status dos containers

```bash
ssh seu-usuario@72.61.223.230
cd /var/www/api-usuarios
docker-compose ps
```

### 6.2 Ver logs

```bash
# Logs de homologação
docker-compose logs -f api-usuarios-homolog

# Logs de produção
docker-compose logs -f api-usuarios-main
```

### 6.3 Verificar saúde da aplicação

```bash
# Homologação
curl http://localhost:5333/api/health

# Produção
curl http://localhost:3333/api/health
```

---

## 🛠️ Comandos Úteis

### Parar containers

```bash
docker-compose stop api-usuarios-homolog
docker-compose stop api-usuarios-main
```

### Reiniciar containers

```bash
docker-compose restart api-usuarios-homolog
docker-compose restart api-usuarios-main
```

### Rebuild completo

```bash
docker-compose build --no-cache api-usuarios-homolog
docker-compose up -d api-usuarios-homolog
```

### Limpar recursos não utilizados

```bash
docker system prune -a
```

### Ver uso de recursos

```bash
docker stats
```

---

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs api-usuarios-homolog

# Verificar variáveis de ambiente
docker-compose config
```

### Erro de conexão com banco de dados

- Verifique se as variáveis de banco de dados estão corretas no GitHub Secrets:
  - Para homologação: `DB_HOST_HOMOLOG`, `DB_PORT_HOMOLOG`, `DB_NAME_HOMOLOG`, `DB_USER_HOMOLOG`, `DB_PASS_HOMOLOG`
  - Para produção: `DB_HOST_MAIN`, `DB_PORT_MAIN`, `DB_NAME_MAIN`, `DB_USER_MAIN`, `DB_PASS_MAIN`
- Verifique se o banco de dados está acessível do servidor
- Teste a conexão manualmente: `psql -h DB_HOST_MAIN -U DB_USER_MAIN -d DB_NAME_MAIN` (ou use as variáveis de homologação conforme necessário)

### Porta já em uso

```bash
# Verificar qual processo está usando a porta
sudo lsof -i :5333
sudo lsof -i :3333

# Parar o processo ou mudar a porta no docker-compose.yml
```

### Erro no GitHub Actions

- Verifique se todas as secrets estão configuradas corretamente
- Verifique se a chave SSH está correta e tem permissões adequadas
- Verifique os logs do workflow no GitHub Actions

### Container para após iniciar

```bash
# Ver logs para identificar o erro
docker-compose logs api-usuarios-homolog

# Verificar healthcheck
docker inspect api-usuarios-homolog | grep -A 10 Health
```

---

## 📚 Estrutura de Arquivos Criados

```
api-usuarios/
├── Dockerfile                    # Imagem Docker da aplicação
├── docker-compose.yml            # Orquestração dos containers
├── .dockerignore                # Arquivos ignorados no build
├── .github/
│   └── workflows/
│       ├── deploy-homolog.yml   # Workflow para branch homolog
│       └── deploy-main.yml      # Workflow para branch main
├── scripts/
│   ├── deploy.sh                # Script de deploy manual
│   └── setup-server.sh          # Script de configuração inicial
└── DEPLOY.md                    # Esta documentação
```

---

## ✅ Checklist de Deploy

- [ ] Docker e Docker Compose instalados no servidor
- [ ] Repositório clonado no servidor
- [ ] Arquivo `.env` criado com todas as variáveis
- [ ] Secrets configuradas no GitHub
- [ ] Chave SSH configurada e testada
- [ ] Deploy manual testado com sucesso
- [ ] Containers rodando e acessíveis
- [ ] GitHub Actions workflow funcionando
- [ ] Healthcheck respondendo corretamente

---

## 🎉 Pronto!

Agora você tem um sistema de deploy automatizado configurado! 

- Push para `homolog` → Deploy automático na porta 5333
- Push para `main` → Deploy automático na porta 3333

Para dúvidas ou problemas, consulte a seção de Troubleshooting acima.

