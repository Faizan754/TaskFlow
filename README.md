# TaskFlow

A full-stack Kanban task board. Sign up, create boards, organize work in columns of cards, drag cards between columns, and let AI break a card into subtasks.

**Live demo:** https://task-flow-lake-eight.vercel.app

<!-- Add screenshots to docs/screenshots/, then uncomment these lines:
![Board view](docs/screenshots/board.png)
![Card dialog with AI subtask suggestions](docs/screenshots/card-dialog.png)
![Dark mode](docs/screenshots/dark-mode.png)
-->

## Features

- **Accounts:** sign up, log in, log out, and password reset by email. Protected routes keep the dashboard private.
- **Boards:** create and delete boards. Every new board starts with To Do, In Progress and Done columns.
- **Columns:** add, rename and delete columns.
- **Cards:** title, description, priority (low, medium, high) and colored labels. Open a card to read its details, then press Edit to change them.
- **Drag and drop:** move cards within and between columns with the mouse, touch or keyboard. The order is saved, and a failed save rolls the card back.
- **Subtasks:** a checklist on every card with a progress bar.
- **AI subtask suggestions:** one click suggests subtasks for a card. You can edit, untick or discard them before adding. Choose between Gemini and Groq.
- **Labels:** colored labels are managed per board and assigned to cards.
- **Light and dark theme** with a toggle that remembers your choice.
- **Contact form** that stores messages in the database.
- Responsive layout, keyboard-accessible dialogs with focus management, and reduced-motion support.

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS v4, Headless UI, dnd-kit, lucide-react |
| Backend | Supabase: PostgreSQL, Auth, Row Level Security, Edge Functions (Deno) |
| AI | Gemini and Groq through their OpenAI-compatible APIs, called only from the Edge Function |
| Hosting | Vercel (frontend), Supabase (database and functions) |

## How it works

**Security is enforced in the database.** The Supabase anon key is public, so the frontend can't be trusted to protect data. Every table has Row Level Security. Policies follow foreign keys up to the board owner (`card → column → board → user`), so a user can only read and change their own boards, columns, cards, subtasks and labels. The label-to-card link additionally requires both to belong to the same board. `ProtectedRoute` only improves the experience; it isn't the protection.

**Moving a card is one transaction.** Dropping a card calls a PostgreSQL function (`move_card`) that updates the card's column and renumbers the positions of the affected columns (0..n), all at once. It runs as the calling user, so Row Level Security still applies. On screen the card moves immediately (optimistic update), and if the save fails the board returns to where it was.

**API keys stay on the server.** AI suggestions go through a Supabase Edge Function. It checks that the caller is a signed-in user, accepts only a provider name from a fixed list, validates and limits the input, parses the model's output defensively, and falls back to the other provider if one fails or hits its limit. The keys are stored as Supabase secrets, never in the browser or the repo.

**Services layer.** All Supabase calls live in `src/services`, so components never talk to the database directly.

**Design tokens.** Colors, shadows and fonts are CSS variables with light and dark values, exposed to Tailwind as semantic classes (`bg-surface`, `text-muted`, `border-border`), so components switch themes without `dark:` variants.

## Project structure

```
src/
  components/   reusable UI (board, cards, dialogs, forms)
  pages/        route pages (landing, auth, dashboard, board, contact, 404)
  services/     all Supabase calls (boards, columns, cards, subtasks, labels, AI, contact)
  entities/     TypeScript types for database rows
  context/      auth context
  lib/          Supabase client, shared class strings, color maps
supabase/
  schema.sql                       tables, policies and the move_card function
  functions/suggest-subtasks/      Edge Function for AI suggestions
```

## Run it locally

Requirements: Node.js 20 or newer and a free Supabase project.

```bash
git clone https://github.com/Faizan754/TaskFlow.git
cd TaskFlow
npm install
cp .env.example .env
```

1. In `.env`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Supabase dashboard, Project Settings, API).
2. In the Supabase SQL Editor, run `supabase/schema.sql` on a fresh project. It creates the tables, policies and the `move_card` function.
3. In Authentication, URL Configuration, add `http://localhost:5173/reset-password` to the redirect URLs. For quick testing you can turn off "Confirm email".
4. Start the app:

```bash
npm run dev
```

### AI suggestions (optional)

The feature needs the Edge Function and at least one free API key (Google AI Studio for Gemini, or Groq).

```bash
npx supabase login
npx supabase secrets set GEMINI_API_KEY=your-key GROQ_API_KEY=your-key --project-ref YOUR_PROJECT_REF
npx supabase functions deploy suggest-subtasks --project-ref YOUR_PROJECT_REF
```

You can also set `GEMINI_MODEL` and `GROQ_MODEL` secrets to choose the models. Without a key, the rest of the app works and only the suggestion button fails with a friendly message.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | start the dev server |
| `npm run build` | type-check and build for production |
| `npm run preview` | preview the production build |
| `npm run lint` | run ESLint |

## Deployment

The frontend deploys to Vercel with the Vite preset. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables, and keep the `vercel.json` rewrite so refreshing on a client-side route doesn't return a 404. In Supabase, set the Site URL to your Vercel address and add its `/reset-password` URL to the redirect list.

## Known limitations

- Supabase's built-in email sender only delivers to project team members and is limited to a few emails per hour, so password-reset emails to other people need a custom SMTP provider (for example Brevo or Resend).
- The contact form accepts messages from anyone. A hidden field and database length limits stop casual abuse; a captcha or a rate-limited function would be the next step.
- AI suggestions use free-tier quotas, which can run out. The function falls back to the other provider and the app shows a message if both fail.
- Boards belong to one user. There is no sharing or real-time collaboration.

## What I learned

Designing Row Level Security policies for related tables, keeping multi-step updates atomic with a database function, debugging a cross-column drag-and-drop loop in dnd-kit, keeping secrets off the client with Edge Functions, and building a themeable design system with CSS variables and Tailwind v4.

## License

MIT. See [LICENSE](LICENSE).
