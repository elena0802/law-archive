# criminal-law-archive

원로 형사법학자의 글을 에세이와 시리즈로 정리하는 디지털 서재입니다.

## 운영자용: 새 글 추가 방법

1. `content/essays/_template.mdx` 파일을 복사해 새 `.mdx` 파일을 만듭니다.
2. 파일 맨 위의 `title`, `date`, `category`, `series`를 새 글에 맞게 바꿉니다.
3. 아래쪽에 본문을 작성합니다.
4. 공개할 때 `draft: true`를 `draft: false`로 바꿉니다.

`draft: true`인 글은 사이트 목록에 보이지 않습니다.

## 운영자용: 수정 내용을 배포하는 방법

글을 추가하거나 수정한 뒤 아래 순서로 저장하면 Vercel에 자동 반영됩니다.

```bash
git add .
git commit -m "Add new essay"
git push
```

## 개발자용: 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 개발자용: 배포 전 확인

```bash
npm run lint
npm run build
```
