#!/bin/bash

# Script para configurar o git-flow automaticamente
# Este script aplica as configurações compartilhadas do git-flow no repositório

echo "🚀 Configurando git-flow..."

# Verifica se o git-flow está instalado
if ! command -v git-flow &> /dev/null; then
    echo "❌ git-flow não está instalado. Por favor, instale com:"
    echo "   macOS: brew install git-flow-avh"
    echo "   Linux: apt-get install git-flow ou yum install git-flow"
    exit 1
fi

# Aplica as configurações do git-flow
git config gitflow.branch.master main
git config gitflow.branch.develop homolog
git config gitflow.prefix.feature feature/
git config gitflow.prefix.bugfix bugfix/
git config gitflow.prefix.release release/
git config gitflow.prefix.hotfix hotfix/
git config gitflow.prefix.support support/
git config gitflow.prefix.versiontag ""

echo "✅ Git-flow configurado com sucesso!"
echo ""
echo "Configurações aplicadas:"
echo "  - Branch master: main"
echo "  - Branch develop: homolog"
echo "  - Prefixo feature: feature/"
echo "  - Prefixo bugfix: bugfix/"
echo "  - Prefixo release: release/"
echo "  - Prefixo hotfix: hotfix/"
echo "  - Prefixo support: support/"
echo ""
echo "Agora você pode usar o git-flow normalmente!"

