# MindMate Deployment Guide (Industrial-Grade)

Follow these steps to move MindMate from your local environment to a production-ready cloud deployment.

---

## 1. Supabase Production Setup
1. Create a **New Project** in the Supabase Dashboard.
2. In the **SQL Editor**, run the following migrations from the repository root:
   - `supabase_schema.sql` (Core tables)
   - `supabase_user_memory.sql` (AI Memory)
   - `supabase_forum_posts.sql` (Forums)
   - `supabase_moderation.sql` (Reporting/Admin)
3. Set your **Site URL** in Auth > Settings to your production domain (e.g., `https://mindmate.vercel.app`).

## 2. Environment Variables
Copy `.env.example` to your hosting provider's (Vercel/Netlify) environment variable settings. Ensure you use the **Production** keys from your new Supabase project and Groq console.

## 3. Vercel Deployment (Recommended)
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Vercel will automatically detect the Next.js framework.
4. Add the environment variables from Step 2.
5. Click **Deploy**.

## 4. Post-Deployment Audit
- [ ] **SSL**: Verify your domain has a valid HTTPS certificate (automatic on Vercel).
- [ ] **PWA**: Open the site on mobile Chrome/Safari and check for the "Install" prompt.
- [ ] **Admin**: Test the `/admin` dashboard with your admin email.
- [ ] **Crisis**: Verify the footer disclaimers are visible on all pages.

---

## Technical Security Checklist
- [ ] **RLS**: Run `SECURITY.md` audit scripts to ensure no table has `ALL` permission for `anon`.
- [ ] **Sanitization**: Ensure all forum inputs are stripped of `<script>` tags (Handled by React/Next.js by default).
- [ ] **Rate Limiting**: Implementation recommended at the Vercel/WAF level for `/api/chat`.
