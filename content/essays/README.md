# essays 폴더 안내

이 폴더는 사이트에 올라갈 글을 보관하는 곳입니다. 글 하나가 `.mdx` 파일 하나입니다.

## 새 글을 쓸 때

1. `_template.mdx`를 복사합니다.
2. 파일 이름을 새 글에 맞게 바꿉니다.
3. 파일 맨 위의 제목, 날짜, 분류, 시리즈를 수정합니다.
4. 본문을 작성합니다.
5. 공개할 준비가 되면 `draft: false`로 바꿉니다.

## 파일 이름 규칙

파일 이름에는 빈칸을 넣지 않는 것이 좋습니다.

좋은 예:

- `punishment-and-revenge.mdx`
- `criminal-responsibility-note.mdx`

피하는 예:

- `새 글.mdx`
- `my essay draft.mdx`

## draft 사용법

`draft: true`인 글은 사이트에 보이지 않습니다. 작성 중이거나 검토 중인 글은 이 상태로 두면 됩니다.

공개할 때만 아래처럼 바꿉니다.

```md
draft: false
```

## category와 series 예시

`category`는 글의 큰 분류입니다.

```md
category: "형벌론"
category: "책임론"
category: "판례 읽기"
```

`series`는 여러 글을 한 주제로 묶는 이름입니다. 같은 시리즈 이름을 쓰면 `/series`에서 함께 모입니다.

```md
series: "형벌의 기초 문제"
series: "형사책임 다시 읽기"
series: "강의실의 질문들"
```
