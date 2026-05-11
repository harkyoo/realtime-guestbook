# Realtime Guestbook

사진 업로드 또는 캔버스 그림과 함께 메시지를 남기고, 포스트잇 게시판과 댓글을 실시간으로 공유하는 Next.js 기반 전자 방명록입니다.

## 사용 기술 스택 선정 이유

- **Next.js App Router + TypeScript**: 페이지 라우팅, 서버 액션, 서버 렌더링 초기 데이터 로드를 한 프로젝트 안에서 구현할 수 있고 배포가 쉽습니다.
- **Tailwind CSS**: 모바일 우선 UI와 포스트잇/종이 질감 스타일을 빠르게 일관성 있게 만들 수 있습니다.
- **Supabase Postgres**: 방명록 항목과 댓글을 관계형 데이터로 안정적으로 저장합니다.
- **Supabase Realtime**: 새 글과 댓글을 새로고침 없이 구독자 화면에 반영할 수 있어 별도 WebSocket 서버 운영 부담이 작습니다.
- **Supabase Storage**: 업로드 사진과 캔버스 PNG 결과물을 같은 버킷에 파일로 저장합니다.
- **닉네임 기반 참여**: 행사장, 전시, 모임에서 인증 없이 빠르게 참여할 수 있습니다.

## 폴더 구조

```text
.
├── app/
│   ├── actions.ts                 # 방명록/댓글 서버 액션
│   ├── globals.css                # 전역 스타일과 배경 질감
│   ├── layout.tsx
│   ├── page.tsx                   # 첫 화면: 방명록 작성
│   └── wall/page.tsx              # 두 번째 페이지: 포스트잇 게시판
├── components/
│   ├── comments/CommentForm.tsx
│   ├── guestbook/DrawingCanvas.tsx
│   ├── guestbook/GuestbookForm.tsx
│   └── wall/
│       ├── EntryDetailModal.tsx
│       ├── StickyNoteCard.tsx
│       └── StickyNoteGrid.tsx
├── lib/
│   ├── supabase/                  # Supabase 클라이언트/환경/미디어 URL
│   ├── utils/                     # 날짜, className 유틸
│   └── validation/guestbook.ts    # 입력값 검증 규칙
├── supabase/schema.sql            # DB, RLS, Storage 정책 초안
├── types/database.ts              # 앱 데이터 타입
└── memory-bank/                   # 프로젝트 기록과 계획
```

## 주요 페이지/컴포넌트

- **`/` 작성 화면**: 닉네임, 짧은 메시지, 그림 그리기, 사진 첨부, 등록 버튼을 제공합니다.
- **`/wall` 게시판 화면**: 등록된 항목을 귀여운 포스트잇 카드로 보여주며 새 항목을 실시간으로 반영합니다.
- **`DrawingCanvas`**: 터치/마우스 포인터로 그림을 그리고 PNG 파일로 변환합니다.
- **`StickyNoteGrid`**: Supabase Realtime을 구독하고 포스트잇 카드 목록 상태를 관리합니다.
- **`EntryDetailModal`**: 원본 이미지/그림, 작성자, 메시지, 댓글 목록과 댓글 입력 폼을 표시합니다.

## DB 스키마 초안

자세한 SQL은 `supabase/schema.sql`을 확인하세요.

### `guestbook_entries`

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `uuid` | 기본 키 |
| `nickname` | `text` | 작성자 닉네임, 1-24자 |
| `message` | `text` | 짧은 메시지, 1-180자 |
| `media_type` | `text` | `photo` 또는 `drawing` |
| `media_path` | `text` | Supabase Storage 버킷 상대 경로 |
| `thumbnail_path` | `text` | 향후 썸네일 경로용 nullable 컬럼 |
| `created_at` | `timestamptz` | 생성 시각 |

### `comments`

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `uuid` | 기본 키 |
| `entry_id` | `uuid` | `guestbook_entries.id` 외래 키 |
| `nickname` | `text` | 댓글 작성자 닉네임, 1-24자 |
| `message` | `text` | 댓글 내용, 1-160자 |
| `created_at` | `timestamptz` | 생성 시각 |

### `entries_with_comment_counts`

게시판 카드에서 댓글 수를 보여주기 위한 read view입니다.

## 실시간 처리 방식

1. `/wall`은 서버에서 최신 방명록 목록을 먼저 가져옵니다.
2. 브라우저에서는 `guestbook_entries`의 `INSERT` 이벤트를 구독합니다.
3. 새 방명록이 들어오면 현재 목록 맨 앞에 중복 없이 추가합니다.
4. 상세 모달은 선택된 방명록의 댓글을 조회한 뒤 `comments`의 entry별 `INSERT` 이벤트를 구독합니다.
5. 새 댓글이 들어오면 댓글 목록에 추가하고 카드의 댓글 수를 갱신합니다.

## 이미지/그림 저장 방식

- 사진은 `<input type="file">`로 받은 파일을 서버 액션에서 검증한 후 Storage에 업로드합니다.
- 그림은 Canvas를 PNG Blob/File로 변환해 사진과 동일한 업로드 경로를 사용합니다.
- 저장 경로는 `entries/{entryId}.{extension}` 형식입니다.
- DB에는 전체 URL이 아니라 버킷 상대 경로만 저장합니다.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill Supabase values.
3. Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.
4. Enable Realtime for `public.guestbook_entries` and `public.comments` in Supabase.
5. Start locally: `npm run dev`

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET=guestbook-media
```

## 이후 확장 아이디어

- 행사별 독립 방명록 room 기능
- 좋아요/하트/이모지 반응
- 관리자용 숨김/삭제/신고 처리
- 이미지 리사이징과 썸네일 생성
- 닉네임 로컬 저장
- QR 코드 초대 링크
- 검색, 필터, 날짜별 보기
