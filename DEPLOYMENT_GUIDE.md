# UniTask AI 배포 가이드 (Deployment Guide)

본 프로젝트는 Next.js 14 기반으로 제작되어 다양한 무료 호스팅 플랫폼(Vercel, Netlify, Cloudflare Pages 등)에 원클릭으로 영구 배포할 수 있습니다.

---

## 1. Vercel 원클릭 배포 (가장 권장 ⭐)

Vercel은 Next.js의 공식 제작사로 가장 빠르고 안정적인 무료 호스팅을 제공합니다.

1. **GitHub에 코드 푸시**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for UniTask AI"
   git branch -M main
   git remote add origin <사용자분의 GitHub 저장소 URL>
   git push -u origin main
   ```
2. **[Vercel 대시보드](https://vercel.com/new) 접속**:
   - `Import Git Repository`에서 방금 올린 저장소 선택
   - Framework Preset: `Next.js` 확인
   - `Deploy` 버튼 클릭 ➡️ **30초 내에 `https://your-project.vercel.app` 형태의 영구 무료 HTTPS 도메인 발급 완료!**

---

## 2. Vercel CLI로 터미널에서 즉시 배포

```bash
npx vercel
```
- 로그인 및 안내에 따라 Enter를 몇 번 누르면 즉시 라이브 배포 URL이 생성됩니다.

---

## 3. Netlify 배포
1. [Netlify](https://app.netlify.com) 접속 후 `Import from Git`
2. Build command: `npm run build`
3. Publish directory: `.next`