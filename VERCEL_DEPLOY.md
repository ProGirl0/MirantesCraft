# 🚀 Deploy no Vercel - MirantesCraft

## Pré-requisitos

1. **Conta no Vercel**: [vercel.com](https://vercel.com)
2. **Conta no Firebase**: [firebase.google.com](https://firebase.google.com)
3. **Projeto no GitHub/GitLab/Bitbucket** (recomendado)

## Passo a Passo

### 1. Preparar o Projeto

✅ O projeto já está configurado com:
- `vercel.json` - Configuração do Vercel
- `package.json` - Scripts de build
- `vite.config.js` - Configuração do Vite

### 2. Fazer Deploy

#### Opção A: Via GitHub (Recomendado)

1. **Push para GitHub**:
   ```bash
   git add .
   git commit -m "Preparando para deploy no Vercel"
   git push origin main
   ```

2. **Conectar no Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - O Vercel detectará automaticamente que é um projeto Vite

#### Opção B: Via CLI do Vercel

1. **Instalar Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Fazer deploy**:
   ```bash
   vercel
   ```

### 3. Configurar Variáveis de Ambiente

**IMPORTANTE**: Configure as variáveis de ambiente no Vercel:

1. No painel do Vercel, vá para seu projeto
2. Settings → Environment Variables
3. Adicione as variáveis do Firebase (veja `ENVIRONMENT_VARIABLES.md`)

### 4. Configurar Domínio (Opcional)

1. No painel do Vercel, vá para "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruído

## Configurações Específicas

### Firebase Auth Domains

Após o deploy, adicione o domínio do Vercel no Firebase:

1. Console do Firebase → Authentication → Settings
2. Em "Authorized domains", adicione:
   - `seu-projeto.vercel.app`
   - `seu-dominio.com` (se tiver domínio personalizado)

### CORS Configuration

O projeto já está configurado para lidar com problemas de COOP/CORS através do `vercel.json`.

## Troubleshooting

### Erro de Build

Se houver erro de build, verifique:
1. Todas as variáveis de ambiente estão configuradas
2. O comando `npm run build` funciona localmente
3. Logs de erro no painel do Vercel

### Problemas de Autenticação

Se o login não funcionar:
1. Verifique se o domínio está autorizado no Firebase
2. Confirme se as variáveis de ambiente estão corretas
3. Teste o login em modo incógnito

### Problemas de CORS

O projeto já inclui headers para resolver problemas de COOP/CORS no `vercel.json`.

## URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Documentação Vercel**: https://vercel.com/docs

## Suporte

Se encontrar problemas:
1. Verifique os logs no painel do Vercel
2. Teste localmente com `npm run build`
3. Consulte a documentação do Vercel e Firebase 