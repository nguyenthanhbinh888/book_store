# 📐 BỘ QUY CHUẨN THIẾT KẾ GIAO DIỆN — BOOKSTORE MANAGEMENT SYSTEM

> **Phiên bản:** 1.0.0 · **Cập nhật:** 2026-10-21  
> **Mục tiêu:** Đảm bảo giao diện nhất quán, hiện đại, thẩm mỹ cao và trải nghiệm người dùng xuất sắc trên toàn bộ hệ thống.

---

## 1. TRIẾT LÝ THIẾT KẾ

### 1.1 Nguyên tắc cốt lõi

| Nguyên tắc | Mô tả |
|---|---|
| **Premium First** | Mọi component phải trông như sản phẩm thương mại cao cấp |
| **Motion is Emotion** | Animation và micro-interaction khiến giao diện sống động |
| **Dark Depth** | Sử dụng shadow, blur, gradient để tạo chiều sâu thị giác |
| **Whitespace Luxury** | Khoảng trắng đủ rộng, không nhồi nhét thông tin |
| **Consistent Delight** | Mỗi hover, click, transition đều nhất quán |

### 1.2 Tuyên ngôn UX

> *"Người dùng không nhớ tính năng, họ nhớ cảm giác khi dùng."*

Giao diện BookStore phải tạo cảm giác: **Sang trọng · Nhanh nhạy · Tin cậy · Thú vị**

---

## 2. HỆ THỐNG MÀU SẮC (COLOR SYSTEM)

### 2.1 Bảng màu chính

```css
/* Primary: Indigo Royale */
--primary-50:  #eef2ff;
--primary-600: #4f46e5;  /* Interactive */
--primary-700: #4338ca;  /* Hover */
--primary-900: #312e81;  /* Deep */

/* Accent: Amber Glow — dùng cho "Mua ngay", sale badges */
--accent-500: #f59e0b;
--accent-600: #d97706;

/* Status */
--success-600: #059669;
--danger-600:  #e11d48;
--warning-600: #d97706;
```

### 2.2 Backgrounds và Text

```css
--bg-page:        #f1f5f9;   /* Nền trang */
--bg-surface:     #ffffff;   /* Card, panel, modal */
--bg-surface-2:   #f8fafc;   /* Table header, section bg */

--text-primary:   #0f172a;   /* Main content */
--text-secondary: #475569;   /* Descriptions */
--text-muted:     #94a3b8;   /* Placeholders, captions */
```

### 2.3 Gradient definitions

```css
/* Hero */
--gradient-hero:    linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
/* Primary CTA */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%);
/* Buy Now CTA */
--gradient-amber:   linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
```

### 2.4 Quy tắc màu

- ✅ `--primary-600` → nút CTA chính, link active
- ✅ `--accent-500/600` → nút "Mua ngay", sale, highlight
- ❌ Không dùng màu thuần không qua biến CSS

---

## 3. TYPOGRAPHY

### 3.1 Font

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
--font-primary: 'Plus Jakarta Sans', system-ui, sans-serif;
```

### 3.2 Type scale

| Token | Size | Weight | Dùng cho |
|---|---|---|---|
| xs | 0.75rem | 400-600 | Labels, badges |
| sm | 0.875rem | 400-500 | Meta, captions |
| base | 1rem | 400-500 | Body text |
| lg | 1.125rem | 600-700 | Subheadings |
| xl | 1.25rem | 700 | Card titles |
| 2xl | 1.5rem | 700-800 | Page titles |
| 3xl | 1.875rem | 800 | Hero headers |

### 3.3 Quy tắc

- ✅ Heading chính mỗi trang dùng `<h1>` — chỉ một
- ✅ `letter-spacing: -0.025em` cho heading ≥ 1.5rem
- ✅ `font-variant-numeric: tabular-nums` cho giá tiền

---

## 4. SPACING & BORDER RADIUS

```css
/* Spacing (4px base) */
--space-1: 0.25rem;   --space-2: 0.5rem;
--space-3: 0.75rem;   --space-4: 1rem;
--space-6: 1.5rem;    --space-8: 2rem;
--space-12: 3rem;     --space-16: 4rem;

/* Border radius */
--radius-sm:   6px;    --radius-md:   10px;
--radius-lg:   16px;   --radius-xl:   24px;
--radius-full: 9999px;
```

---

## 5. SHADOW SYSTEM

```css
--shadow-sm:  0 1px 3px rgb(0 0 0 / 0.08);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.04);

/* Colored glows */
--shadow-primary: 0 8px 25px -5px rgba(79, 70, 229, 0.40);
--shadow-amber:   0 8px 25px -5px rgba(245, 158, 11, 0.40);
```

---

## 6. ANIMATION & TRANSITIONS

### 6.1 Timing functions

```css
--ease-out:    cubic-bezier(0.0, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

--duration-fast:   150ms;
--duration-normal: 250ms;
--duration-slow:   400ms;
```

### 6.2 Keyframes bắt buộc

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
@keyframes spin { to { transform: rotate(360deg); } }

@keyframes bounceIn {
  0%   { transform: scale(0); }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

### 6.3 Quy tắc

- ✅ Tất cả hover có transition ≥ 150ms
- ✅ Button click: `transform: scale(0.97)` — 100ms
- ✅ Modal open: `scaleIn` — 200ms
- ✅ Toast: `slideInRight` — 300ms
- ❌ Không dùng `transition: all` — chỉ property cụ thể

---

## 7. COMPONENT SPECIFICATIONS

### 7.1 Button Components

#### Primary Button
- Background: `--gradient-primary`
- Hover: `translateY(-2px)` + deeper shadow
- Click: `scale(0.97)`
- Shimmer effect on hover với `::before` pseudo

#### Buy Now Button (BẮT BUỘC trong BookCard & BookDetailPage)
- Background: `--gradient-amber`
- Shadow: `--shadow-amber`
- Icon: Zap/Lightning ⚡
- Label: "Mua ngay"
- Action: `addToCart()` rồi `navigate('/checkout')`

#### Add to Cart Button
- Border: 2px solid `--primary-600`
- Color: `--primary-600` text
- Hover: invert (white text on primary bg)

### 7.2 BookCard — Layout bắt buộc

```
┌─────────────────────┐
│                     │
│     BOOK COVER      │  ← aspect-ratio 3/4
│     [category badge]│
│  [overlay: "Xem"]   │  ← hiển thị khi hover
│                     │
├─────────────────────┤
│ Tác giả             │
│ Tên sách (2 dòng)   │
│ ████ Còn 5 cuốn     │  ← Stock indicator
├─────────────────────┤
│ 150.000 ₫           │
│ [🛒 Giỏ] [⚡ Mua]   │  ← 2 action buttons
└─────────────────────┘
```

**Stock indicator màu:**
- > 5 cuốn: `--success-600` (xanh)
- 1–5 cuốn: `--warning-600` (vàng/cam)
- 0 cuốn: `--danger-600` (đỏ) + disabled buttons

### 7.3 BookDetail Page — Action area

```
┌──────────────────────────────────────────┐
│  [- 1 +]                                 │
│  [🛒 Thêm vào giỏ hàng]                  │
│  [⚡ Mua ngay]          ← Amber gradient │
└──────────────────────────────────────────┘
```

### 7.4 Auth Pages — Split Layout

```
Desktop:
┌─────────────────┬─────────────────┐
│   ILLUSTRATION  │   LOGIN FORM    │
│   + Brand quote │   + Demo creds  │
│   Dark gradient │   White bg      │
└─────────────────┴─────────────────┘

Mobile: Form only, illustration hidden
```

**Animation:** Fields dùng `fadeInUp` stagger 50ms/field

### 7.5 Login Bug Fix — Navigation Race Condition

**Vấn đề:** `navigate()` gọi ngay sau `login()` nhưng `ProtectedRoute` vẫn đang check `loading === true` → redirect về `/login`

**Fix required:** `ProtectedRoute` phải show loading spinner khi `loading === true`, chỉ check `isAuthenticated` khi `loading === false`

```tsx
// ProtectedRoute.tsx
if (loading) return <LoadingPage />;
if (!isAuthenticated) return <Navigate to="/login" />;
return children;
```

### 7.6 AI Assistant — Giọng điệu chuẩn

**DO:**
- Ngắn gọn, tối đa 2–3 câu/response
- Câu mệnh lệnh thân thiện: "Thử tìm với từ khóa khác nhé 😊"
- Gợi ý action cụ thể kèm theo
- Dùng 1–2 emoji phù hợp context

**DON'T:**
- Bắt đầu mỗi tin bằng "Xin chào" hoặc tự giới thiệu lặp
- Giải thích dài dòng khi không cần
- Dùng ngôn ngữ quá formal ("Kính thưa", "Trân trọng")
- Quá nhiều emoji (> 3)

---

## 8. FORM STANDARDS

### 8.1 Input states

| State | Border | Background | Shadow |
|---|---|---|---|
| Default | `--border-default` | white | none |
| Focus | `--primary-600` | white | `0 0 0 3px rgba(99,102,241,0.15)` |
| Error | `--danger-600` | `#fff5f5` | none |
| Disabled | `--border-default` | `--bg-surface-2` | none |

### 8.2 Validation

- ✅ Validate `onBlur` + `onSubmit`
- ✅ Show ALL errors cùng lúc khi submit
- ✅ Error message: icon ⚠️ + text đỏ, font-size 0.82rem
- ❌ Không validate while typing (trừ confirm password)

---

## 9. NOTIFICATION PATTERNS

### 9.1 Toast

| Type | BG Color | Duration |
|---|---|---|
| success | `#059669` | 3.5s |
| error | `#e11d48` | 5s |
| warning | `#d97706` | 4s |
| info | `#2563eb` | 3.5s |

- Vị trí: bottom-right
- Animation: `slideInRight` 300ms
- Max 3 toasts hiển thị cùng lúc

### 9.2 Loading States

| Context | Component |
|---|---|
| Danh sách items | Skeleton loader (shimmer) |
| Button action | Inline spinner + disabled |
| Full page | Centered spinner + logo |
| Modal action | Overlay spinner |

---

## 10. RESPONSIVE BREAKPOINTS

| Breakpoint | Value | Usage |
|---|---|---|
| Mobile | < 640px | Single column, stacked |
| Tablet | 640–1024px | 2 columns, adapted |
| Desktop | ≥ 1024px | Full layout |
| Wide | ≥ 1280px | Max-width container |

| Component | Mobile | Desktop |
|---|---|---|
| Book grid | 2 cols | 4–5 cols |
| Book detail | Vertical stack | 2-col grid |
| Admin layout | Drawer sidebar | Fixed 260px |
| Auth pages | Single col | 50/50 split |

---

## 11. BUG TRACKING (v1.0)

| ID | Mô tả | File | Priority |
|---|---|---|---|
| BUG-001 | Đăng nhập không redirect trang chủ | `LoginPage.tsx`, `ProtectedRoute.tsx` | 🔴 Critical |
| BUG-002 | BookCard thiếu nút "Mua ngay" | `BookCard.tsx` | 🔴 Critical |
| BUG-003 | BookDetailPage thiếu nút "Mua ngay" | `BookDetailPage.tsx` | 🔴 Critical |
| BUG-004 | Giao diện thiếu animation, quá đơn giản | `index.css` + components | 🟡 High |
| BUG-005 | AI giọng điệu cứng nhắc, không tự nhiên | AI widget | 🟡 High |

---

## 12. CHECKLIST TRƯỚC KHI MERGE

- [ ] Buttons có `id` unique
- [ ] Images có `alt` attribute
- [ ] Async actions có loading state
- [ ] Error states được handle
- [ ] Empty states hiển thị khi data rỗng
- [ ] Mobile test tại 375px và 768px
- [ ] Không `console.error` trong production code
- [ ] Animation có `prefers-reduced-motion` fallback

---

*Tài liệu này là nguồn sự thật duy nhất cho thiết kế. Mọi thay đổi style phải tuân theo hoặc cập nhật tài liệu này.*
