# Variáveis de Ambiente para Deploy

## Firebase Configuration

Para fazer o deploy no Vercel, você precisa configurar as seguintes variáveis de ambiente no painel do Vercel:

### Variáveis Obrigatórias:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Como configurar no Vercel:

1. Acesse o painel do Vercel
2. Vá para o seu projeto
3. Clique em "Settings"
4. Vá para "Environment Variables"
5. Adicione cada variável acima com os valores do seu projeto Firebase

### Onde encontrar essas informações:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá para "Project Settings" (ícone de engrenagem)
4. Na aba "General", role até "Your apps"
5. Selecione sua app web ou crie uma nova
6. Copie as configurações do objeto `firebaseConfig`

### Exemplo de configuração:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Variável Opcional:

```
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Esta variável é necessária apenas se você estiver usando Firebase Analytics. 