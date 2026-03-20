# Guia de Configuração — Sistema Clínica de Estética

## 1. Criar Projeto no Firebase

1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Criar projeto"**
3. Dê um nome (ex: `clinica-estetica`) e clique em **Continuar**
4. Desative o Google Analytics (opcional) e clique em **Criar projeto**

---

## 2. Ativar Autenticação Google

1. No painel do Firebase, vá em **Authentication** > **Sign-in method**
2. Clique em **Google** e ative
3. Informe o e-mail de suporte e salve

---

## 3. Criar Banco de Dados Firestore

1. No painel do Firebase, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Modo de produção** e selecione a região (ex: `southamerica-east1`)
4. Após criado, vá em **Regras** e substitua pelo conteúdo abaixo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Isso permite acesso a qualquer usuário autenticado com Google.

---

## 4. Obter as Credenciais do Firebase

1. No painel do Firebase, clique na **engrenagem** > **Configurações do projeto**
2. Role até **Seus apps** e clique em **Adicionar app** > ícone Web (`</>`)
3. Registre o app (ex: `clinica-web`) e clique em **Registrar app**
4. Copie o objeto `firebaseConfig` que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 5. Configurar Variáveis de Ambiente

### Para desenvolvimento local:

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Para deploy no Netlify:

1. No Netlify, vá em **Site settings** > **Environment variables**
2. Adicione cada variável acima com seus respectivos valores

---

## 6. Configurar Domínio Autorizado no Firebase

Para que o login com Google funcione no Netlify:

1. No Firebase, vá em **Authentication** > **Settings** > **Authorized domains**
2. Clique em **Add domain**
3. Adicione o domínio do seu site no Netlify (ex: `seu-site.netlify.app`)

---

## 7. Deploy no Netlify

### Opção A — Via GitHub (recomendado):

1. Faça push do código para um repositório GitHub
2. No Netlify, clique em **Add new site** > **Import an existing project**
3. Conecte ao GitHub e selecione o repositório
4. Configure:
   - **Build command:** `pnpm build`
   - **Publish directory:** `dist/public`
5. Adicione as variáveis de ambiente (passo 5)
6. Clique em **Deploy site**

### Opção B — Via CLI:

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist/public
```

---

## 8. Testar o Sistema

Após o deploy:

1. Acesse o URL do seu site no Netlify
2. Clique em **"Entrar com Google"**
3. Faça login com qualquer conta Google
4. Você será redirecionado para o Dashboard
5. Cadastre o primeiro cliente e teste as fichas!

---

## Estrutura do Banco de Dados (Firestore)

O sistema cria automaticamente as seguintes coleções:

| Coleção | Descrição |
|---------|-----------|
| `clientes` | Dados cadastrais dos clientes |
| `fichas` | Fichas de avaliação (corporal, facial, glúteos) |
| `evolucoes` | Registros de evolução de tratamento |

---

## Suporte

Em caso de dúvidas, verifique:
- [Documentação Firebase](https://firebase.google.com/docs)
- [Documentação Netlify](https://docs.netlify.com)
