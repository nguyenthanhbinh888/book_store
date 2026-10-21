# HỆ THỐNG QUẢN LÝ BÁN SÁCH TRỰC TUYẾN (LOCAL BOOKSTORE MVP)

> Dự án website quản lý bán sách được phát triển theo đặc tả chi tiết tại `ANTIGRAVITY_PROJECT_SPEC.md`, vận hành hoàn toàn trên môi trường máy tính cục bộ (Local Development), không phụ thuộc vào hạ tầng cloud hay dịch vụ trả phí bên ngoài.

---

## 1. Mô tả dự án và Công nghệ sử dụng

Dự án là một hệ thống thương mại điện tử và quản lý kho sách hoàn chỉnh với hai phân hệ:
- **Khu vực Khách hàng (Storefront):** Duyệt danh mục sách, tìm kiếm & lọc theo giá/tác giả/danh mục, xem chi tiết sách, quản lý giỏ hàng cục bộ, đặt hàng thanh toán khi nhận hàng (COD), theo dõi trạng thái đơn hàng và hủy đơn hàng khi còn ở trạng thái Chờ xử lý.
- **Khu vực Quản trị viên (Admin Dashboard & Management):** Dashboard thời gian thực (doanh thu, đơn hàng, khách hàng, cảnh báo tồn kho thấp), CRUD danh mục, tác giả, nhà xuất bản, quản lý sách (giá bán, giá nhập bí mật, trạng thái mở bán), xử lý đơn hàng theo quy trình (PENDING -> CONFIRMED -> SHIPPING -> COMPLETED / CANCELLED), lập và xác nhận phiếu nhập hàng (tự động cộng dồn tồn kho), theo dõi toàn bộ nhật ký biến động kho (Inventory Transactions).

### Công nghệ Backend
- **Ngôn ngữ & Nền tảng:** Java 21 LTS
- **Framework:** Spring Boot 3.3.4
- **Bảo mật:** Spring Security 6, JJWT (io.jsonwebtoken 0.12.6) với cơ chế Stateless JWT Bearer Authentication & BCrypt Password Encoder
- **Truy xuất dữ liệu:** Spring Data JPA, Hibernate, Jakarta Validation
- **Cơ sở dữ liệu:** MySQL 8.x
- **Quản lý Migration:** Flyway Community Edition
- **Build Tool:** Apache Maven 3.9+

### Công nghệ Frontend
- **Framework & Runtime:** React 19, TypeScript
- **Bundler:** Vite 6
- **Giao diện & Trải nghiệm:** Vanilla CSS Design System (Tone màu Indigo & Emerald cao cấp, Typography Plus Jakarta Sans, Dark/Light accents, Glassmorphism, Responsive Mobile/Desktop)
- **Icons:** Lucide React
- **HTTP Client:** Axios với Request/Response Interceptors tự động gắn Token & xử lý lỗi 401

---

## 2. Yêu cầu cài đặt môi trường

Trước khi khởi chạy dự án, máy tính cần được cài đặt sẵn:
1. **Java Development Kit (JDK):** Phiên bản 21 LTS trở lên.
   ```powershell
   java -version
   ```
2. **Apache Maven:** Phiên bản 3.9+ (hoặc dùng Maven Wrapper).
   ```powershell
   mvn -version
   ```
3. **Node.js & npm:** Node.js v18+ (khuyến nghị Node v20 hoặc v24), npm 9+.
   ```powershell
   node -v
   npm -v
   ```
4. **MySQL Server:** Phiên bản 8.0+ đang chạy dịch vụ local tại cổng `3306`.

---

## 3. Hướng dẫn thiết lập Cơ sở dữ liệu MySQL

Đăng nhập vào MySQL với tài khoản `root` (hoặc tài khoản quản trị MySQL cục bộ của bạn):

```powershell
mysql -u root -p
```

Thực thi các lệnh SQL sau để tạo cơ sở dữ liệu `bookstore_db` và người dùng chuyên dụng `bookstore_app`:

```sql
-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS bookstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Tạo User chuyên dụng
CREATE USER IF NOT EXISTS 'bookstore_app'@'localhost' IDENTIFIED BY 'bookstore_local_pass_2026';

-- 3. Cấp toàn quyền trên database bookstore_db
GRANT ALL PRIVILEGES ON bookstore_db.* TO 'bookstore_app'@'localhost';
FLUSH PRIVILEGES;

-- 4. Kiểm tra
SHOW DATABASES;
EXIT;
```

---

## 4. Cấu hình Biến môi trường

### 4.1. Backend (`backend/src/main/resources/application.properties` hoặc biến môi trường)
Dự án đã thiết lập các giá trị mặc định sẵn sàng cho môi trường local. Nếu bạn muốn ghi đè, hãy tạo file `.env` hoặc thiết lập biến môi trường hệ thống:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/bookstore_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
SPRING_DATASOURCE_USERNAME=bookstore_app
SPRING_DATASOURCE_PASSWORD=bookstore_local_pass_2026

APP_JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
APP_JWT_EXPIRATION_MS=86400000

SERVER_PORT=8080
```

### 4.2. Frontend (`frontend/.env`)
Tệp `frontend/.env` đã được cấu hình trỏ về backend local:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 5. Hướng dẫn chạy Backend

1. Di chuyển vào thư mục `backend`:
   ```powershell
   cd backend
   ```
2. Khởi chạy ứng dụng Spring Boot:
   ```powershell
   mvn spring-boot:run
   ```
3. Backend sẽ tự động:
   - Chạy Flyway Migration để khởi tạo cấu trúc bảng (12 bảng quan hệ).
   - Nạp dữ liệu mẫu ban đầu (admin, customer, danh mục, tác giả, sách mẫu, nhà cung cấp).
   - Lắng nghe tại cổng `http://localhost:8080`.

---

## 6. Hướng dẫn chạy Frontend

1. Mở một cửa sổ dòng lệnh (Terminal) mới và di chuyển vào thư mục `frontend`:
   ```powershell
   cd frontend
   ```
2. Cài đặt các gói phụ thuộc (nếu chưa cài):
   ```powershell
   cmd /c npm install
   ```
   *(Lưu ý trên Windows: Nếu gặp lỗi PowerShell ExecutionPolicy khi chạy `npm`, hãy dùng cú pháp `cmd /c npm ...`)*
3. Khởi chạy máy chủ phát triển Vite:
   ```powershell
   cmd /c npm run dev
   ```
4. Truy cập giao diện người dùng tại `http://localhost:5173`.

---

## 7. Địa chỉ Local và API Endpoints

- **Giao diện Khách hàng & Quản trị:** `http://localhost:5173`
- **Backend API Base URL:** `http://localhost:8080/api/v1`

### Bảng tóm tắt các nhóm API chính
| Phân hệ | Phương thức | Đường dẫn API | Quyền truy cập | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/v1/auth/register` | Công khai | Đăng ký khách hàng mới |
| | POST | `/api/v1/auth/login` | Công khai | Đăng nhập lấy JWT Bearer token |
| | GET | `/api/v1/auth/me` | Đã đăng nhập | Xem thông tin tài khoản hiện tại |
| | PUT | `/api/v1/auth/me` | Đã đăng nhập | Cập nhật hồ sơ & đổi mật khẩu |
| **Catalog** | GET | `/api/v1/books` | Công khai | Danh sách sách mở bán (lọc, phân trang) |
| | GET | `/api/v1/books/{id}` | Công khai | Chi tiết sách (ẩn giá nhập) |
| | GET | `/api/v1/categories` | Công khai | Danh mục hiển thị trên menu |
| | GET | `/api/v1/authors` | Công khai | Danh sách tác giả |
| | GET | `/api/v1/publishers` | Công khai | Danh sách nhà xuất bản |
| **Order** | POST | `/api/v1/orders` | Khách hàng | Đặt hàng COD (tính toán lại giá & trừ kho) |
| | GET | `/api/v1/orders/my-orders` | Khách hàng | Lịch sử mua hàng của khách |
| | GET | `/api/v1/orders/{id}` | Khách hàng/Admin | Chi tiết đơn hàng |
| | POST | `/api/v1/orders/my/{id}/cancel` | Khách hàng | Hủy đơn & hoàn kho tự động |
| **Admin** | GET | `/api/v1/admin/dashboard` | ADMIN | Số liệu thống kê, doanh thu, cảnh báo kho |
| | GET/POST/PUT | `/api/v1/admin/books/**` | ADMIN | Quản lý sách (gồm giá nhập, tồn kho) |
| | GET/POST/PUT | `/api/v1/admin/categories/**` | ADMIN | Quản lý danh mục |
| | GET/POST/PUT | `/api/v1/admin/authors/**` | ADMIN | Quản lý tác giả |
| | GET/POST/PUT | `/api/v1/admin/publishers/**` | ADMIN | Quản lý nhà xuất bản |
| | GET/PUT/PATCH| `/api/v1/admin/orders/**` | ADMIN | Quản lý trạng thái đơn hàng |
| | GET/POST | `/api/v1/admin/purchase-receipts/**` | ADMIN | Lập phiếu nhập và xác nhận tăng kho |
| | GET | `/api/v1/admin/inventory/transactions`| ADMIN | Tra cứu nhật ký biến động kho |
| | GET/PUT | `/api/v1/admin/customers/**` | ADMIN | Quản trị khách hàng |

---

## 8. Migration và Dữ liệu Seed

Dự án sử dụng **Flyway** để quản trị phiên bản schema database tự động nằm trong `backend/src/main/resources/db/migration`:
- `V1__init_schema.sql`: Khởi tạo 12 bảng chuẩn hóa (`users`, `categories`, `authors`, `publishers`, `books`, `suppliers`, `purchase_receipts`, `purchase_receipt_items`, `orders`, `order_details`, `inventory_transactions`, `cart_items`).
- `V2__seed_initial_data.sql`:
  - 1 Quản trị viên hệ thống (Admin).
  - 1 Khách hàng mẫu (Customer).
  - 5 Danh mục sách (Công nghệ thông tin, Kinh tế & Khởi nghiệp, Văn học, Tâm lý & Kỹ năng sống, Lịch sử - Triết học).
  - 6 Tác giả nổi tiếng.
  - 4 Nhà xuất bản hàng đầu tại Việt Nam.
  - 8 Đầu sách tiêu biểu với giá niêm yết, tồn kho và hình ảnh bìa mẫu.
  - 3 Nhà cung cấp sách.
  - Dữ liệu nhật ký tồn kho ban đầu (`INITIAL`).

Khi ứng dụng Spring Boot khởi động, Flyway sẽ tự động kiểm tra bảng `flyway_schema_history` và áp dụng các migration chưa chạy một cách an toàn.

---

## 9. Hướng dẫn Kiểm thử (Testing)

### 9.1. Kiểm thử Tích hợp Backend (JUnit 5 + Spring Boot Test)
Chạy bộ test tự động kiểm tra toàn bộ luồng Auth, Mã hóa mật khẩu, Quyền hạn Security và Catalog API:

```powershell
cd backend
mvn test
```
*Kết quả:* Toàn bộ các test suite `AuthAndCatalogIntegrationTest`, `PasswordHashTest`, `BookstoreApplicationTests` đều PASS với 0 failure / 0 error.

### 9.2. Kiểm thử Tự động Luồng End-to-End (E2E Integration Script)
Trong thư mục gốc có sẵn 2 kịch bản PowerShell tự động kiểm thử toàn bộ luồng thực tế qua REST API:
1. **Luồng E2E Đặt hàng -> Hoàn thành -> Dashboard -> Nhập hàng:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File test_e2e.ps1
   ```
   Kịch bản thực hiện:
   - Đăng ký tài khoản khách hàng mới.
   - Thêm sách vào đơn và đặt hàng COD.
   - Kiểm tra tồn kho bị trừ chính xác.
   - Đăng nhập quyền Admin và chuyển trạng thái đơn hàng: `PENDING` -> `CONFIRMED` -> `SHIPPING` -> `COMPLETED`.
   - Kiểm tra Dashboard cập nhật doanh thu thực tế.
   - Lập phiếu nhập hàng mới và xác nhận nhập kho.
   - Kiểm tra tồn kho được cộng dồn và nhật ký kho ghi nhận đầy đủ.

2. **Luồng Hủy đơn hàng và Hoàn kho tự động:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File test_cancel.ps1
   ```
   Kịch bản thực hiện: Tạo đơn hàng thử nghiệm, tiến hành hủy đơn khi đang chờ duyệt, kiểm tra trạng thái chuyển thành `CANCELLED` và kho được hoàn trả đúng số lượng với nhật ký `ORDER_CANCEL`.

---

## 10. Tài khoản Demo Local

Để tiện cho việc đánh giá và chấm điểm nhanh, hệ thống tích hợp sẵn các tài khoản demo (có các nút **"Điền nhanh tài khoản Quản trị viên"** và **"Điền nhanh tài khoản Khách hàng"** trực tiếp tại trang Đăng nhập `http://localhost:5173/login`):

| Quyền hạn | Địa chỉ Email | Mật khẩu mặc định | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin@bookstore.local` | `Admin@123456` | Có toàn quyền truy cập khu vực Quản trị `/admin` |
| **Khách hàng (CUSTOMER)** | `customer@bookstore.local` | `Customer@123456` | Mua hàng, xem lịch sử đơn, giỏ hàng |

*Cách đổi mật khẩu:*
- Sau khi đăng nhập, nhấn vào biểu tượng tài khoản trên thanh điều hướng để vào trang **Hồ sơ cá nhân** (`/profile`). Tại đây người dùng có thể đổi mật khẩu mới.
- Hoặc quản trị viên có thể tạo tài khoản mới qua form Đăng ký trên giao diện.

---

## 11. Các lỗi phổ biến & Cách khắc phục (Troubleshooting)

1. **Lỗi kết nối MySQL (`Access denied for user 'bookstore_app'` hoặc `Unknown database 'bookstore_db'`):**
   - *Nguyên nhân:* Chưa tạo database hoặc user theo mục 3, hoặc mật khẩu sai.
   - *Xử lý:* Đăng nhập `mysql -u root -p` và thực thi lại các câu lệnh trong **Mục 3**. Kiểm tra dịch vụ MySQL đang chạy (trên Windows: `Get-Service MySQL80` hoặc `net start MySQL80`).
2. **Lỗi cổng bị chiếm dụng (`Port 8080 is already in use` hoặc `Port 5173 is in use`):**
   - *Xử lý:* Tìm PID tiến trình chiếm cổng và kết thúc:
     ```powershell
     netstat -ano | findstr :8080
     taskkill /PID <PID_NUMBER> /F
     ```
3. **Lỗi PowerShell ExecutionPolicy khi chạy `npm` hoặc script PowerShell:**
   - *Nguyên nhân:* Mặc định Windows chặn chạy các script `.ps1`.
   - *Xử lý:* Luôn gọi npm qua `cmd /c npm ...` hoặc chạy script PowerShell với cờ `-ExecutionPolicy Bypass`:
     ```powershell
     powershell -ExecutionPolicy Bypass -File test_e2e.ps1
     ```
4. **Lỗi thiếu JDK 21 hoặc sai JAVA_HOME:**
   - *Xử lý:* Đảm bảo biến môi trường `JAVA_HOME` trỏ tới thư mục cài đặt JDK 21 và `Path` có `%JAVA_HOME%\bin`.
5. **Lỗi CORS khi gọi API từ Frontend:**
   - *Xử lý:* Backend đã cấu hình `CorsConfig` cho phép các request từ `http://localhost:5173`. Nếu bạn đổi cổng frontend, hãy cập nhật `CorsConfig.java` trong backend.

---

## 12. Giới hạn của Phiên bản MVP & Định hướng tương lai

Dự án tập trung đạt tiêu chuẩn chất lượng cao nhất cho môi trường phát triển cục bộ và học tập. Các giới hạn có chủ đích trong giai đoạn này bao gồm:
- **Phương thức thanh toán:** Hệ thống sử dụng phương thức thanh toán tiền mặt khi nhận hàng (**COD**). Chưa tích hợp các cổng thanh toán trung gian trực tuyến (VNPay, MoMo, ZaloPay, Stripe) để tránh yêu cầu cấu hình Merchant Account và Webhook ra ngoài Internet.
- **Vận chuyển:** Đơn vị vận chuyển và chi phí giao hàng được quy định cố định (miễn phí hoặc biểu phí nội bộ), chưa kết nối API động của các đơn vị Giao Hàng Tiết Kiệm (GHTK), Giao Hàng Nhanh (GHN).
- **Email thông báo:** Chưa cấu hình SMTP Server gửi email thực tế khi đặt hàng thành công để đảm bảo ứng dụng chạy hoàn toàn offline không phụ thuộc internet.
- **Hóa đơn điện tử:** Chi tiết hóa đơn và đơn hàng được hiển thị trực tiếp trên giao diện web và có thể in ấn qua trình duyệt, chưa tích hợp nhà cung cấp hóa đơn điện tử có mã số thuế.
