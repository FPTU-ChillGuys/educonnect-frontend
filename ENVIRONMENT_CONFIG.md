# Environment Configuration Guide

## Cấu hình môi trường cho EduConnect Frontend

### Setup ban đầu cho team members:

1. **Copy file template**: Sao chép `.env.example` thành `.env`

   ```bash
   cp .env.example .env
   ```

2. **Tạo file production** (nếu cần): Sao chép `.env.example` thành `.env.production`

   ```bash
   cp .env.example .env.production
   ```

3. **Cập nhật values** trong file tương ứng với môi trường của bạn

### Thay đổi URL Backend API

Để thay đổi URL của backend API, bạn chỉ cần sửa file environment tương ứng:

#### Development (Môi trường phát triển)

Sửa file `.env`:

```bash
VITE_API_URL=https://localhost:7299
```

#### Production (Môi trường sản xuất)

Sửa file `.env.production`:

```bash
VITE_API_URL=https://educonnectapi20250716223316-b4a5e0e7afhwd8cz.indonesiacentral-01.azurewebsites.net
```

### File Structure & Git Tracking:

```
├── .env                 # ❌ Git ignored - Local development config
├── .env.local          # ❌ Git ignored - Local overrides (optional)
├── .env.production     # ❌ Git ignored - Production config (create locally)
└── .env.example        # ✅ Git tracked - Template for team
```

### Các file được tự động sử dụng URL từ environment:

1. **axiosInstance.ts** - Tất cả API calls
2. **UserManagement.tsx** - Email verification URL

### Lưu ý quan trọng:

- **Bảo mật**: Files `.env*` (trừ `.env.example`) không được commit vào Git
- **Setup**: Sau khi clone repo, tạo file `.env` từ `.env.example`
- **Restart**: Sau khi thay đổi file `.env`, cần restart development server: `npm run dev`
- **Local override**: File `.env.local` có thể được tạo để override settings cục bộ

### Cách hoạt động:

```typescript
// Thay vì hardcode URL như này:
clientUri: "https://hardcoded-url.com/api/auth/verify-email";

// Bây giờ sử dụng environment variable:
clientUri: `${import.meta.env.VITE_API_URL}/api/auth/verify-email`;
```

Điều này giúp:

- ✅ Dễ dàng chuyển đổi giữa môi trường dev/prod
- ✅ Không cần thay đổi code khi đổi URL
- ✅ Tập trung quản lý cấu hình tại một nơi
- ✅ Bảo mật hơn khi deploy (sensitive data không trong Git)
- ✅ Bảo mật hơn khi deploy
