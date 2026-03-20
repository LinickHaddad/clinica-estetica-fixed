# Sistema de Gestão — Clínica de Estética

Sistema web completo para digitalizar fichas de clientes, gerenciar avaliações e acompanhar evoluções de tratamento.

## 🎯 Características

✅ **Autenticação Google** — Qualquer pessoa com conta Google pode entrar  
✅ **Gestão de Clientes** — Cadastro e edição de dados dos clientes  
✅ **3 Tipos de Fichas** — Avaliação Corporal, Facial e Anamnese Glúteos  
✅ **Módulo de Evolução** — Registre procedimentos e acompanhamento  
✅ **Design Responsivo** — Funciona perfeitamente no celular  
✅ **Banco de Dados Gratuito** — Supabase (sem configuração necessária)  

## 🚀 Deploy no Netlify (Recomendado)

### Passo 1: Preparar o repositório

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/clinica-estetica.git
git push -u origin main
```

### Passo 2: Conectar ao Netlify

1. Acesse [netlify.com](https://netlify.com) e faça login
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Selecione **GitHub** e autorize
4. Escolha o repositório `clinica-estetica`
5. Configure:
   - **Build command:** `pnpm build`
   - **Publish directory:** `dist/public`
6. Clique em **"Deploy site"**

### Passo 3: Pronto!

Seu sistema estará disponível em `https://seu-site.netlify.app`

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Acessar em http://localhost:3000
```

## 📋 Estrutura do Projeto

```
client/
  ├── src/
  │   ├── pages/          # Páginas (Login, Dashboard, Fichas, etc)
  │   ├── components/     # Componentes reutilizáveis
  │   ├── contexts/       # Contextos (Autenticação)
  │   ├── lib/            # Utilitários (Supabase, Firebase)
  │   └── index.css       # Estilos globais
  └── public/             # Arquivos estáticos
```

## 🔐 Autenticação

O sistema usa **Supabase + Google OAuth**:
- Qualquer pessoa com Google pode entrar
- Sem necessidade de configuração
- Dados protegidos no Supabase

## 📊 Fichas Disponíveis

### 1. Avaliação Corporal
- Dados clínicos e hábitos
- Patologias e medicamentos
- Alimentação e atividade física

### 2. Avaliação Facial
- Tipo de pele e fototipo
- Alterações faciais
- Histórico de procedimentos

### 3. Anamnese Glúteos
- Dados clínicos específicos
- Histórico de saúde
- Patologias existentes

## 🎨 Design

- **Paleta:** Vinho (#4A1942) + Rosé (#C4748A)
- **Tipografia:** Nunito (títulos) + Inter (corpo)
- **Estilo:** Clinical Modern / Soft Professional

## 📱 Responsividade

O sistema é totalmente responsivo:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)

## 🛠️ Tecnologias

- **Frontend:** React 19 + TypeScript
- **Roteamento:** Wouter
- **Autenticação:** Supabase Auth
- **Banco de Dados:** Supabase (PostgreSQL)
- **Estilos:** Tailwind CSS 4
- **Componentes:** shadcn/ui

## 📝 Licença

MIT
