-- =========================================================
-- ESE 회사 사이트: 게시판(소식/보도자료) + 사업 문의
-- =========================================================

-- 소식/보도자료 게시판
create table if not exists public.company_board_posts (
  id          text primary key check (char_length(id) between 1 and 50),
  category    text not null check (category in ('news', 'press')),
  title       text not null check (char_length(title) between 1 and 300),
  date        date not null default current_date,
  body        text[] not null default '{}',
  pinned      boolean not null default false,
  source_url  text,
  attachments jsonb not null default '[]'::jsonb,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists company_board_posts_list_idx on public.company_board_posts (category, pinned desc, date desc);

alter table public.company_board_posts enable row level security;
drop policy if exists "public can read published posts" on public.company_board_posts;
create policy "public can read published posts"
  on public.company_board_posts for select
  to anon, authenticated
  using (published = true);

-- 사업 문의
create table if not exists public.company_inquiries (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 1 and 50),
  affiliation text not null check (char_length(affiliation) between 1 and 100),
  position    text check (char_length(position) <= 50),
  phone       text check (char_length(phone) <= 30),
  email       text not null check (char_length(email) between 3 and 200),
  type        text not null check (char_length(type) between 1 and 50),
  subject     text not null check (char_length(subject) between 1 and 200),
  message     text not null check (char_length(message) between 1 and 5000),
  agreed      boolean not null check (agreed = true),
  status      text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  created_at  timestamptz not null default now()
);

alter table public.company_inquiries enable row level security;
-- 방문자 접수 정책은 다음 마이그레이션(관리자 기능)에서 답변 칸과 함께 정의합니다.
