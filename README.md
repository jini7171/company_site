# ESE 공식 웹사이트

**Experience-Driven Smart Innovation** — White Editorial Tech 컨셉의 ESE Co., Ltd. 기업 웹사이트입니다.

## Tech Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Lucide Icons
Animation은 별도 Library 없이 CSS Animation + IntersectionObserver 하나로 처리합니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Production Build
```

## 폴더 구조

```
src/
├─ app/                 # Route (layout, page, not-found, globals.css)
├─ content/             # 중앙 관리 Content Data (향후 CMS/API 연동 지점)
│  ├─ site.ts           # 회사 정보, Metrics, 연락처
│  ├─ navigation.ts     # Main Navigation / Mega Menu
│  ├─ business.ts       # 사업 분야 + 사업 실적
│  ├─ technology.ts     # AI / Big Data / Smart Platform
│  ├─ solutions.ts      # rino Solution 9종
│  └─ history.ts        # 연혁 (Era + Milestone)
├─ components/
│  ├─ layout/           # Header, MegaMenu, MobileNavigation, Footer
│  ├─ home/             # 홈페이지 Section 및 전용 Component
│  ├─ graphics/         # 추상 Line Graphic (실제 Asset으로 교체 가능)
│  ├─ ui/               # Button, SectionHeader, Metric, Logo
│  └─ motion/           # RevealObserver
└─ lib/
```

## Design Token

`tailwind.config.ts`에 정의되어 있습니다.

| Token | 값 | 용도 |
| --- | --- | --- |
| `canvas` | `#FFFFFF` | Main 배경 |
| `subtle` | `#F6F8FB` | Secondary 배경 |
| `ink` | `#0B1220` | Primary 텍스트 |
| `muted` | `#667085` | Secondary 텍스트 |
| `line` | `#E5E7EB` | Border |
| `brand` | `#185ADB` | Primary 브랜드 (Cobalt Blue) |
| `cyan` | `#0EA5C6` | Accent (Data Flow) |
| `night` | `#0B1220` | Technology Section 배경 |

Font: 한글 Pretendard (Dynamic Subset CDN) / 영문 Inter (`next/font`)

## 확인이 필요한 정보 (TODO)

임의로 지어내지 않고 Placeholder로 비워둔 항목입니다. 해당 파일만 수정하면 전체 사이트에 반영됩니다.

- [ ] 대표 전화, Email, KakaoTalk 채널, 회사 주소 — `src/content/site.ts`
- [ ] 사업 분야별 수행 건수 / 지역 — `src/content/business.ts` (`businessPerformance`)
- [ ] rino 제품 9종 공식 Label · 한 줄 설명 — `src/content/solutions.ts`
  - DataHUB, IOT, VMS, GIS, FMS는 제품명에서 유추한 **초안**이며 `verified: false` 상태입니다.
  - SOS, UXP, WCS, NFM은 Placeholder 문구입니다.
- [ ] 연혁 Milestone — `src/content/history.ts`
- [ ] 공식 로고 SVG — `src/components/ui/Logo.tsx`
- [ ] OG 이미지 (1200×630) 및 배포 도메인 (`NEXT_PUBLIC_SITE_URL`)

## 진행 현황

- [x] 프로젝트 구조, Design System, 공통 Header / Mega Menu / Mobile Navigation / Footer
- [x] 홈페이지 (Hero → Experience → Business → Technology → Solution → Contact)
- [x] Subpage (Company / Business / Technology / Solution / Support / 약관)

## Subpage 구조

| Route | 파일 | Content |
| --- | --- | --- |
| `/company/about` · `vision` · `history` · `location` | `src/app/company/*` | `content/company.ts`, `content/history.ts` |
| `/business/[slug]` (5개) | `src/app/business/[slug]` | `content/business-detail.ts` |
| `/business/performance` | `src/app/business/performance` | `content/business.ts` (`businessPerformance`) |
| `/technology/[slug]` (3개) | `src/app/technology/[slug]` | `content/technology-detail.ts` |
| `/solution/[slug]` (9개) | `src/app/solution/[slug]` | `content/solution-detail.ts` |
| `/news` · `/press` (게시판 목록) | `src/app/news`, `src/app/press` | `content/board.ts` (`boardPosts`) |
| `/news/[id]` · `/press/[id]` (게시물 상세) | `src/app/news/[id]`, `src/app/press/[id]` | `content/board.ts` |
| `/contact` | `src/app/contact` + `api/inquiry` | `INQUIRY_WEBHOOK_URL` |
| `/privacy` · `/terms` | `src/app/privacy`, `src/app/terms` | 공식 본문 필요 |

공통 Component는 `src/components/subpage/`에 있습니다. (SubpageHero, SubNav, SubSection, FeatureGrid, ProcessFlow, RelatedCards, Timeline, InquiryCTA, Placeholder)

### Subpage 추가 TODO

- [ ] 사업·기술·솔루션 상세 문구는 **초안**입니다. 담당 부서 검토 후 수정하세요.
- [ ] 사업-솔루션, 기술-솔루션 연결(`relatedSolutions`)은 제품명 기준 임시 매핑입니다.
- [ ] rino SOS · UXP · WCS · NFM 상세 정보 (현재 Placeholder)
- [ ] 비전 문구·핵심가치·기업 철학 확정
- [ ] 오시는 길 주소·교통편, 지도 Embed
- [ ] 소식·보도자료 게시물 (CMS 연동 전까지 `boardPosts`에 추가 — 공지 고정·첨부파일·원문 링크 지원, 페이지당 10건)
- [ ] 사업문의 전달 경로 — `INQUIRY_WEBHOOK_URL` 미설정 시 Production에서는 접수하지 않습니다(503).
- [ ] 개인정보취급방침·이용약관 공식 본문
