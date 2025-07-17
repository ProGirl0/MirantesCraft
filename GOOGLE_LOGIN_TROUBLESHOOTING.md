# 🔧 Solução de Problemas - Login com Google

## ❌ Erro: "Erro ao fazer login com o Google. Tente novamente."

### 🔍 **Passos para Diagnosticar:**

#### 1. **Verificar Console do Navegador**
- Abra as Ferramentas do Desenvolvedor (F12)
- Vá para a aba "Console"
- Procure por mensagens de erro relacionadas ao Firebase
- Verifique se há mensagens sobre configuração

#### 2. **Verificar Variáveis de Ambiente**
Certifique-se de que o arquivo `.env` contém todas as variáveis necessárias:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### 3. **Verificar Configuração do Firebase Console**

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para **Authentication** > **Sign-in method**
4. Verifique se **Google** está habilitado
5. Clique em **Google** e configure:
   - **Project support email**: Seu email
   - **Web SDK configuration**: Deve estar habilitado

#### 4. **Verificar Domínios Autorizados**

1. No Firebase Console, vá para **Authentication** > **Settings**
2. Na seção **Authorized domains**, verifique se inclui:
   - `localhost` (para desenvolvimento)
   - Seu domínio de produção (se aplicável)

#### 5. **Verificar Configuração do Projeto Google Cloud**

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione o projeto do Firebase
3. Vá para **APIs & Services** > **OAuth consent screen**
4. Verifique se o app está configurado corretamente

### 🛠️ **Soluções Comuns:**

#### **Problema: Popup Bloqueado**
```
Erro: auth/popup-blocked
```
**Solução:**
- Permita popups para o site
- Tente em uma aba privada/incógnito
- Desative bloqueadores de anúncios temporariamente

#### **Problema: Cross-Origin-Opener-Policy (COOP)**
```
Erro: Cross-Origin-Opener-Policy policy would block the window.closed call
```
**Solução:**
- O sistema agora usa redirecionamento automaticamente
- Se persistir, tente em uma aba privada/incógnito
- Verifique se não há extensões de segurança bloqueando
- Tente em um navegador diferente (Chrome, Firefox, Edge)

#### **Problema: Domínio Não Autorizado**
```
Erro: auth/unauthorized-domain
```
**Solução:**
- Adicione o domínio no Firebase Console
- Para desenvolvimento: adicione `localhost`
- Para produção: adicione seu domínio real

#### **Problema: Configuração Incorreta**
```
Erro: auth/invalid-api-key
```
**Solução:**
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor de desenvolvimento
- Limpe o cache do navegador

#### **Problema: Rede/Conectividade**
```
Erro: auth/network-request-failed
```
**Solução:**
- Verifique sua conexão com a internet
- Tente desativar VPN temporariamente
- Verifique se não há firewall bloqueando

### 🔄 **Como Testar:**

1. **Limpe o cache do navegador**
2. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
3. **Abra o console do navegador (F12)**
4. **Tente fazer login com Google**
5. **Verifique as mensagens no console**

### 📞 **Se o Problema Persistir:**

1. Verifique se o projeto Firebase está ativo
2. Confirme se a faturação está configurada (se necessário)
3. Verifique se não há limites de quota excedidos
4. Consulte a [documentação oficial do Firebase](https://firebase.google.com/docs/auth/web/google-signin)

### 🎯 **Mensagens de Erro Específicas:**

- **"Login cancelado"**: Usuário fechou o popup
- **"Popup bloqueado"**: Bloqueador de popup ativo
- **"Erro de conexão"**: Problema de rede
- **"Domínio não autorizado"**: Configuração do Firebase
- **"API Key inválida"**: Variáveis de ambiente incorretas 