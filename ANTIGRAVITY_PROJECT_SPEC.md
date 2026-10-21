# ĐẶC TẢ DỰ ÁN --- WEBSITE QUẢN LÝ BÁN SÁCH

> **Mục tiêu của tài liệu:** Đây là tài liệu yêu cầu chính để AI Agent
> trong Antigravity đọc, lập kế hoạch, xây dựng, chạy thử và kiểm tra dự
> án. Đọc toàn bộ tài liệu trước khi tạo hoặc sửa mã nguồn.\
> **Ngôn ngữ trao đổi và tài liệu:** Tiếng Việt.\
> **Phạm vi hiện tại:** Chỉ chạy local trên máy phát triển. Không triển
> khai hosting, cloud hoặc production ở giai đoạn này.

------------------------------------------------------------------------

## 1. Vai trò và nguyên tắc làm việc của AI Agent

Bạn là kỹ sư phần mềm full-stack cấp cao, chịu trách nhiệm triển khai
một ứng dụng có thể chạy được, không chỉ tạo giao diện minh họa.

### Quy tắc bắt buộc

1.  Trước khi sửa mã nguồn, kiểm tra cấu trúc thư mục và các tệp hiện
    có. Không ghi đè hoặc xóa mã nguồn đang hoạt động nếu chưa hiểu mục
    đích.
2.  Nếu thư mục dự án chưa có mã nguồn, hãy khởi tạo cấu trúc theo tài
    liệu này.
3.  Thực hiện theo từng giai đoạn nhỏ. Sau mỗi giai đoạn, chạy
    build/test phù hợp và xử lý lỗi trước khi tiếp tục.
4.  Ưu tiên chức năng hoạt động thực sự: giao diện phải gọi API backend,
    backend phải thao tác MySQL; không dùng dữ liệu giả cố định thay cho
    luồng nghiệp vụ thật, trừ dữ liệu seed được ghi rõ.
5.  Không tuyên bố một chức năng đã hoàn thành nếu chưa kiểm tra bằng
    build, test hoặc thao tác thực tế.
6.  Không tự ý thêm thư viện, kiến trúc hoặc chức năng lớn không cần
    thiết. Nếu cần thay đổi yêu cầu, hãy nêu lý do và lựa chọn trước khi
    thực hiện.
7.  Không lưu mật khẩu dạng văn bản thuần. Không đưa secret hoặc mật
    khẩu thực vào Git.
8.  Không dùng hosting, dịch vụ cloud, API trả phí hoặc dịch vụ bên
    ngoài để dự án hoạt động. Ứng dụng phải chạy local.
9.  Nếu có thông tin chưa xác định, áp dụng các giả định mặc định trong
    tài liệu này và ghi rõ trong README; chỉ hỏi người dùng khi thiếu
    thông tin khiến không thể triển khai an toàn hoặc hợp lý.
10. Dùng tên biến, tên lớp và tên bảng bằng tiếng Anh; giao diện hiển
    thị cho người dùng bằng tiếng Việt.
11. Dùng định dạng ngày giờ và tiền tệ phù hợp Việt Nam. Tiền tệ mặc
    định là VND, hiển thị ví dụ `150.000 ₫`.
12. Không tạo các tệp lớn chỉ chứa mã giả hoặc TODO để thay thế chức
    năng cần hoàn thiện.

------------------------------------------------------------------------

## 2. Mục tiêu sản phẩm

Xây dựng website quản lý bán sách có hai khu vực:

-   **Khu vực quản trị:** quản lý sách, danh mục, tác giả, nhà xuất bản,
    tồn kho, đơn hàng, khách hàng và thống kê cơ bản.
-   **Khu vực khách hàng:** duyệt và tìm kiếm sách, xem chi tiết sách,
    giỏ hàng, đặt hàng, đăng ký/đăng nhập và xem đơn hàng của mình.

Đây là phiên bản MVP để học tập và phát triển local. Không yêu cầu
hosting, tên miền, thanh toán trực tuyến hoặc tích hợp đơn vị vận chuyển
ở giai đoạn đầu.

### Quy tắc nghiệp vụ mặc định

-   Một khách hàng có thể đặt nhiều đơn hàng.
-   Một đơn hàng có nhiều dòng chi tiết; mỗi dòng tham chiếu một cuốn
    sách.
-   Giá bán và tên sách tại thời điểm đặt hàng phải được lưu trong chi
    tiết đơn hàng để lịch sử không thay đổi khi thông tin sách được
    chỉnh sửa.
-   Không cho phép đặt số lượng lớn hơn tồn kho.
-   Giá và số lượng phải được kiểm tra ở backend; không tin dữ liệu giá
    do frontend gửi lên.
-   Đơn hàng chỉ được tạo nếu toàn bộ mặt hàng hợp lệ và đủ tồn kho.
-   Việc tạo đơn hàng, tạo chi tiết đơn và trừ kho phải nằm trong một
    transaction database.
-   Không xóa cứng sách đã xuất hiện trong đơn hàng; sử dụng trạng thái
    ngừng kinh doanh hoặc `active = false`.
-   Giỏ hàng MVP có thể lưu trong state/localStorage ở trình duyệt;
    backend phải kiểm tra lại giá và tồn kho khi đặt hàng.
-   Thanh toán ở MVP là **thanh toán khi nhận hàng (COD)** hoặc ghi nhận
    "chưa thanh toán". Không tích hợp cổng thanh toán trực tuyến.
-   Các trạng thái đơn hàng mặc định: `PENDING`, `CONFIRMED`,
    `SHIPPING`, `COMPLETED`, `CANCELLED`.
-   Chỉ cho phép chuyển trạng thái theo luồng hợp lý. Hủy đơn phải xử lý
    tồn kho nhất quán, tránh hoàn kho hai lần.
-   Khi khách hàng đặt hàng thành công, giảm tồn kho trong transaction.
    Khi đơn bị hủy theo chính sách cho phép, hoàn kho đúng một lần.
-   Chỉ quản trị viên được truy cập API quản trị.
-   Khách hàng chỉ được xem đơn hàng và hồ sơ của chính mình.
-   Mật khẩu phải được băm bằng BCrypt thông qua Spring Security.

------------------------------------------------------------------------

## 3. Công nghệ bắt buộc

### Backend

-   Java 21 LTS.
-   Spring Boot 3.x, chọn bản ổn định tương thích Java 21 tại thời điểm
    triển khai.
-   Maven.
-   Spring Web.
-   Spring Data JPA / Hibernate.
-   MySQL Connector/J.
-   Spring Security.
-   Xác thực JWT nếu triển khai đăng nhập stateless; cấu hình secret qua
    biến môi trường local, không hard-code secret thật.
-   Bean Validation.
-   Spring Boot Actuator chỉ khi thực sự cần cho kiểm tra local.
-   JUnit 5, Spring Boot Test và Mockito cho kiểm thử.

Dùng REST API để frontend gọi backend. Tổ chức backend theo các lớp
`controller`, `service`, `repository`, `entity`, `dto`, `mapper` (nếu
cần), `config`, `security`, `exception`.

### Frontend

-   React.
-   TypeScript ở chế độ strict.
-   Vite.
-   HTML5 và CSS3.
-   React Router.
-   Axios hoặc một lớp API client tương đương.
-   Có thể dùng thư viện icon phổ biến nếu cần; không phụ thuộc vào CDN
    để giao diện hoạt động.
-   CSS module hoặc CSS thuần có cấu trúc. Chỉ chọn một chiến lược
    chính, không trộn nhiều hệ UI không cần thiết.
-   Giao diện responsive, ưu tiên desktop cho trang quản trị và hỗ trợ
    màn hình điện thoại cho trang khách hàng.

### Database

-   MySQL 8.4 LTS hoặc phiên bản MySQL ổn định đang có sẵn trên máy.
-   Mã hóa UTF-8 bằng `utf8mb4`.
-   Dùng khóa chính, khóa ngoại, unique constraint và index phù hợp.
-   Dùng `DECIMAL` cho tiền; không dùng kiểu số thực `FLOAT`/`DOUBLE`
    cho giá tiền.
-   Không lưu danh sách ID hoặc nhiều giá trị phân tách bằng dấu phẩy
    trong một cột.
-   Không đưa mật khẩu database vào mã nguồn.

### Công cụ local

-   Git.
-   JDK 21.
-   Maven Wrapper được khuyến nghị để giảm khác biệt phiên bản Maven.
-   Node.js LTS và npm.
-   MySQL Server và MySQL Workbench (Workbench là tùy chọn).
-   Có thể cung cấp `docker-compose.yml` để chạy MySQL local nếu máy có
    Docker; không bắt buộc dự án phải dùng Docker.

Không triển khai hosting hoặc cloud trong phạm vi này.

------------------------------------------------------------------------

## 4. Cấu trúc repository mong muốn

Nếu chưa có cấu trúc phù hợp, dùng cấu trúc sau:

``` text
bookstore-management/
├── README.md
├── ANTIGRAVITY_PROJECT_SPEC.md
├── .gitignore
├── .env.example
├── docker-compose.yml              # tùy chọn, chỉ phục vụ MySQL local
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/.../bookstore/
│       │   │   ├── config/
│       │   │   ├── security/
│       │   │   ├── controller/
│       │   │   ├── service/
│       │   │   ├── repository/
│       │   │   ├── entity/
│       │   │   ├── dto/
│       │   │   ├── mapper/
│       │   │   ├── exception/
│       │   │   └── BookstoreApplication.java
│       │   └── resources/
│       │       └── application.yml
│       └── test/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── api/
        ├── assets/
        ├── components/
        ├── layouts/
        ├── pages/
        ├── routes/
        ├── hooks/
        ├── types/
        ├── utils/
        ├── styles/
        ├── App.tsx
        └── main.tsx
```

Thay `...` bằng package Java thực tế, ví dụ `com.example.bookstore`.
Không tạo toàn bộ thư mục rỗng nếu chưa cần.

------------------------------------------------------------------------

## 5. Phân hệ và chức năng

### 5.1. Xác thực và phân quyền

-   Đăng nhập.
-   Đăng ký tài khoản khách hàng.
-   Đăng xuất ở frontend và xóa token phía client.
-   Lấy thông tin người dùng hiện tại.
-   Phân quyền tối thiểu: `ADMIN`, `CUSTOMER`.
-   Chặn trang quản trị ở frontend và bắt buộc kiểm tra quyền ở backend.
-   Kiểm tra dữ liệu đầu vào và trả lỗi rõ ràng.
-   Không trả mật khẩu hoặc password hash trong API response.

Có thể tạo tài khoản quản trị mặc định bằng seed hoặc script local.
Không tự ý dùng mật khẩu dễ đoán trong môi trường thật. Nếu có tài khoản
demo, phải ghi rõ đây chỉ là local và hướng dẫn đổi thông tin.

### 5.2. Quản lý sách

Thông tin tối thiểu của sách:

-   ID.
-   ISBN (không bắt buộc nhưng nếu có thì phải unique).
-   Tên sách.
-   Mô tả.
-   Danh mục.
-   Một hoặc nhiều tác giả.
-   Nhà xuất bản.
-   Giá bán.
-   Giá nhập (chỉ quản trị viên xem).
-   Số lượng tồn kho.
-   URL ảnh bìa hoặc đường dẫn ảnh local.
-   Trạng thái đang kinh doanh/ngừng kinh doanh.
-   Ngày tạo và ngày cập nhật.

Chức năng:

-   Danh sách sách có phân trang.
-   Tìm kiếm theo tên hoặc ISBN.
-   Lọc theo danh mục và trạng thái.
-   Xem chi tiết.
-   Thêm, sửa, ngừng kinh doanh.
-   Validate giá không âm, tồn kho không âm, tên sách không rỗng.
-   Không để khách hàng xem giá nhập hoặc trường nội bộ.

### 5.3. Danh mục, tác giả, nhà xuất bản

-   CRUD cơ bản cho quản trị viên.
-   Có kiểm tra dữ liệu bắt buộc.
-   Không xóa dữ liệu đang được sách tham chiếu nếu gây lỗi toàn vẹn; ưu
    tiên ngừng sử dụng hoặc báo lỗi dễ hiểu.
-   Danh sách có tìm kiếm khi phù hợp.

### 5.4. Kho hàng và nhập sách

MVP phải quản lý số lượng tồn kho. Tạo chức năng nhập kho cơ bản:

-   Tạo phiếu nhập với nhà cung cấp, ngày nhập, ghi chú và các dòng
    sách/số lượng/giá nhập.
-   Khi xác nhận phiếu nhập, tăng tồn kho trong transaction.
-   Lưu lịch sử biến động kho để truy vết.
-   Không cho phép xác nhận cùng một phiếu nhập nhiều lần.
-   Không cho phép số lượng nhập bằng hoặc nhỏ hơn 0.

Nếu không đủ thời gian để hoàn thành UI phiếu nhập trong giai đoạn đầu,
vẫn cần thiết kế database và service rõ ràng, sau đó triển khai ở giai
đoạn kế tiếp. Không giả lập nhập kho bằng cách sửa trực tiếp dữ liệu
database mà không ghi lịch sử.

### 5.5. Giỏ hàng và đặt hàng

-   Trang danh sách sách và trang chi tiết.
-   Thêm vào giỏ, đổi số lượng, xóa dòng, xóa toàn bộ giỏ.
-   Hiển thị tổng tiền.
-   Nhập tên người nhận, số điện thoại, địa chỉ và ghi chú.
-   Xác nhận đặt hàng COD.
-   Backend tải lại dữ liệu sách từ database và tự tính tổng tiền.
-   Kiểm tra tồn kho và trạng thái kinh doanh.
-   Trả mã đơn hàng và thông tin tóm tắt khi thành công.
-   Nếu một mặt hàng hết hàng hoặc giá thay đổi, trả lỗi rõ ràng để
    khách hàng cập nhật giỏ.
-   Không để hai request đồng thời làm tồn kho âm; xử lý bằng
    transaction và chiến lược khóa/cập nhật phù hợp.

### 5.6. Quản lý đơn hàng

Quản trị viên có thể:

-   Xem danh sách đơn hàng, lọc theo trạng thái và tìm theo mã đơn.
-   Xem chi tiết đơn, khách hàng, địa chỉ nhận và các dòng hàng.
-   Xác nhận đơn.
-   Chuyển sang giao hàng.
-   Đánh dấu hoàn thành.
-   Hủy đơn theo các quy tắc trạng thái.
-   Xem tổng tiền và thời điểm tạo đơn.

Khách hàng có thể:

-   Xem đơn hàng của chính mình.
-   Xem chi tiết đơn.
-   Xem trạng thái.
-   Hủy đơn khi trạng thái còn cho phép theo chính sách MVP.

Backend phải kiểm tra trạng thái hiện tại trước khi chuyển trạng thái.
Không cho phép tùy ý chuyển từ `CANCELLED` sang `COMPLETED`. Việc hoàn
kho khi hủy phải được bảo vệ để không thực hiện lặp.

### 5.7. Quản lý khách hàng

-   Quản trị viên xem danh sách khách hàng và thông tin cơ bản.
-   Tìm kiếm theo tên, email hoặc số điện thoại.
-   Không hiển thị password hash.
-   Khách hàng cập nhật hồ sơ cá nhân của chính mình.

### 5.8. Dashboard và báo cáo cơ bản

Trang tổng quan quản trị hiển thị số liệu lấy từ backend:

-   Tổng số sách đang kinh doanh.
-   Tổng số đơn hàng.
-   Đơn hàng đang chờ xử lý.
-   Tổng doanh thu từ đơn hàng hoàn thành.
-   Danh sách đơn hàng mới.
-   Sách tồn kho thấp.

Các chỉ số phải được truy vấn từ MySQL, không hard-code số liệu. Ghi rõ
cách tính doanh thu, mặc định chỉ tính đơn hàng `COMPLETED`; không tính
đơn hủy.

------------------------------------------------------------------------

## 6. Thiết kế database đề xuất

Tạo các bảng tối thiểu sau, điều chỉnh kiểu dữ liệu và quan hệ cho hợp
lý:

### `users`

-   `id`
-   `full_name`
-   `email` (unique)
-   `password_hash`
-   `phone`
-   `role` (`ADMIN`, `CUSTOMER`)
-   `active`
-   `created_at`
-   `updated_at`

### `categories`

-   `id`
-   `name`
-   `description`
-   `active`
-   `created_at`
-   `updated_at`

Tên danh mục cần được kiểm tra trùng theo quy tắc nhất quán.

### `authors`

-   `id`
-   `name`
-   `biography`
-   `created_at`
-   `updated_at`

### `publishers`

-   `id`
-   `name`
-   `address`
-   `phone`
-   `created_at`
-   `updated_at`

### `books`

-   `id`
-   `isbn` (nullable, unique khi có giá trị)
-   `title`
-   `description`
-   `category_id`
-   `publisher_id` (nullable nếu chưa biết)
-   `selling_price` (`DECIMAL`)
-   `cost_price` (`DECIMAL`, chỉ nội bộ)
-   `stock_quantity`
-   `cover_image_url` (nullable)
-   `active`
-   `created_at`
-   `updated_at`

### `book_authors`

-   `book_id`
-   `author_id`
-   Khóa chính ghép `(book_id, author_id)`.

### `suppliers`

-   `id`
-   `name`
-   `contact_name`
-   `phone`
-   `email`
-   `address`
-   `created_at`
-   `updated_at`

### `purchase_receipts`

-   `id`
-   `receipt_code` (unique)
-   `supplier_id`
-   `created_by`
-   `status` (ví dụ `DRAFT`, `CONFIRMED`, `CANCELLED`)
-   `note`
-   `total_cost`
-   `created_at`
-   `confirmed_at`

### `purchase_receipt_details`

-   `id`
-   `purchase_receipt_id`
-   `book_id`
-   `quantity`
-   `unit_cost`
-   `line_total`

### `orders`

-   `id`
-   `order_code` (unique, dễ đọc)
-   `customer_id`
-   `recipient_name`
-   `recipient_phone`
-   `shipping_address`
-   `note`
-   `subtotal`
-   `discount_amount` (mặc định 0)
-   `total_amount`
-   `status`
-   `payment_method` (MVP: `COD`)
-   `payment_status` (ví dụ `UNPAID`, `PAID`, `REFUNDED`)
-   `created_at`
-   `updated_at`
-   `cancelled_at` (nullable)

### `order_details`

-   `id`
-   `order_id`
-   `book_id`
-   `book_title_snapshot`
-   `unit_price`
-   `quantity`
-   `line_total`

### `inventory_transactions`

-   `id`
-   `book_id`
-   `transaction_type` (ví dụ `PURCHASE`, `ORDER`, `ORDER_CANCEL`,
    `ADJUSTMENT`)
-   `reference_type`
-   `reference_id`
-   `quantity_change` (số dương khi tăng, âm khi giảm)
-   `note`
-   `created_by` (nullable tùy luồng)
-   `created_at`

### Ràng buộc database

-   Đặt foreign key phù hợp.
-   Index các trường thường tìm kiếm/lọc: `books.title`, `books.isbn`,
    `orders.order_code`, `orders.status`, `orders.customer_id`, thời
    điểm tạo.
-   Giá tiền dùng `DECIMAL(12,2)` hoặc độ chính xác phù hợp.
-   Không dùng `ON DELETE CASCADE` một cách tùy tiện với đơn hàng và
    lịch sử kho.
-   Dùng migration có version (khuyến nghị Flyway) hoặc cơ chế schema rõ
    ràng. Không dựa vào `ddl-auto=update` như giải pháp migration lâu
    dài.
-   Dữ liệu demo phải được tạo bằng seed có thể chạy lại an toàn, không
    nhân bản dữ liệu mỗi lần khởi động.

------------------------------------------------------------------------

## 7. API REST đề xuất

Dùng tiền tố `/api/v1`. Tên endpoint có thể điều chỉnh nhất quán theo
quy ước REST.

### Xác thực

-   `POST /api/v1/auth/register`
-   `POST /api/v1/auth/login`
-   `GET /api/v1/auth/me`

### Sách và danh mục công khai

-   `GET /api/v1/books`
-   `GET /api/v1/books/{id}`
-   `GET /api/v1/categories`
-   `GET /api/v1/categories/{id}/books`

Danh sách hỗ trợ `page`, `size`, `sort`, `keyword`, `categoryId` và
`active` khi phù hợp. Không trả `costPrice` cho API công khai.

### Quản trị sách

-   `POST /api/v1/admin/books`
-   `PUT /api/v1/admin/books/{id}`
-   `PATCH /api/v1/admin/books/{id}/status`
-   `GET /api/v1/admin/books`

### Quản trị danh mục, tác giả, nhà xuất bản

-   CRUD tại `/api/v1/admin/categories`
-   CRUD tại `/api/v1/admin/authors`
-   CRUD tại `/api/v1/admin/publishers`

### Kho hàng

-   `GET /api/v1/admin/inventory`
-   `GET /api/v1/admin/inventory/transactions`
-   `POST /api/v1/admin/purchase-receipts`
-   `GET /api/v1/admin/purchase-receipts`
-   `GET /api/v1/admin/purchase-receipts/{id}`
-   `POST /api/v1/admin/purchase-receipts/{id}/confirm`

### Đơn hàng

-   `POST /api/v1/orders`
-   `GET /api/v1/orders/my`
-   `GET /api/v1/orders/my/{id}`
-   `POST /api/v1/orders/my/{id}/cancel`
-   `GET /api/v1/admin/orders`
-   `GET /api/v1/admin/orders/{id}`
-   `PATCH /api/v1/admin/orders/{id}/status`

### Dashboard

-   `GET /api/v1/admin/dashboard/summary`
-   `GET /api/v1/admin/dashboard/recent-orders`
-   `GET /api/v1/admin/dashboard/low-stock`

### Quy chuẩn API

-   Dùng DTO request/response; không trả trực tiếp entity JPA.
-   Dùng HTTP status hợp lý: `200`, `201`, `400`, `401`, `403`, `404`,
    `409`, `500`.
-   Validate request bằng Bean Validation.
-   Response lỗi có cấu trúc thống nhất, thông báo hữu ích và không làm
    lộ stack trace.
-   Dùng `BigDecimal` cho tiền.
-   Không cho frontend tự quyết định quyền hạn, tổng tiền, giá nhập hoặc
    tồn kho.
-   Bảo đảm các endpoint quản trị yêu cầu role `ADMIN`.
-   Kiểm tra quyền sở hữu đơn hàng ở backend, không chỉ ẩn nút trên giao
    diện.

------------------------------------------------------------------------

## 8. Yêu cầu giao diện

### Phong cách

-   Hiện đại, sạch, dễ đọc và nhất quán.
-   Tên và thông báo trên giao diện bằng tiếng Việt có dấu.
-   Có trạng thái loading, lỗi, danh sách rỗng và thông báo thành công.
-   Có xác nhận trước các thao tác ảnh hưởng dữ liệu như xóa/ngừng kinh
    doanh/hủy đơn.
-   Form có nhãn rõ ràng, validate và hiển thị lỗi cạnh trường tương
    ứng.
-   Bảng quản trị dễ đọc, có phân trang, tìm kiếm và lọc.
-   Dùng layout chung cho trang quản trị: sidebar, header, nội dung
    chính.
-   Trang khách hàng có header, thanh tìm kiếm, danh mục, danh sách sách
    và giỏ hàng.
-   Dùng ảnh placeholder nội bộ nếu chưa có ảnh bìa; không phụ thuộc ảnh
    bên ngoài để toàn bộ trang hoạt động.
-   Có thể sử dụng dữ liệu seed thực tế nhưng phải ghi rõ là dữ liệu
    mẫu.

### Các trang tối thiểu

**Khách hàng** - Trang chủ/danh sách sách. - Chi tiết sách. - Giỏ
hàng. - Đặt hàng. - Đăng nhập. - Đăng ký. - Đơn hàng của tôi. - Chi tiết
đơn hàng. - Hồ sơ cá nhân.

**Quản trị** - Đăng nhập quản trị hoặc trang đăng nhập dùng chung có
phân quyền. - Dashboard. - Quản lý sách. - Tạo/sửa sách. - Quản lý danh
mục. - Quản lý tác giả. - Quản lý nhà xuất bản. - Quản lý phiếu nhập. -
Quản lý tồn kho và lịch sử kho. - Quản lý đơn hàng và chi tiết đơn. -
Quản lý khách hàng.

Không để trang hiển thị nút thao tác mà không có hành vi thực sự.

------------------------------------------------------------------------

## 9. Cấu hình local và biến môi trường

### Backend

Mặc định chạy tại `http://localhost:8080`.

Cấu hình qua biến môi trường hoặc file cấu hình local không được commit
secret. Ví dụ các biến:

``` env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bookstore_db
DB_USERNAME=bookstore_app
DB_PASSWORD=change_me_local
JWT_SECRET=replace_with_a_long_random_local_secret
FRONTEND_ORIGIN=http://localhost:5173
```

Có thể cung cấp `backend/src/main/resources/application-local.yml` trong
`.gitignore` nếu chứa thông tin nhạy cảm. Tệp cấu hình mẫu chỉ chứa
placeholder.

### Frontend

Mặc định chạy tại `http://localhost:5173`.

Tạo `frontend/.env.example` với biến:

``` env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Không đưa secret backend vào biến `VITE_*`, vì các biến này có thể được
đóng gói vào trình duyệt.

### MySQL

-   Database mặc định: `bookstore_db`.
-   Tạo user database riêng cho ứng dụng khi có thể, không dùng tài
    khoản `root` trong cấu hình ứng dụng thường ngày.
-   Hướng dẫn tạo database và user trong README.
-   Nếu dùng Docker Compose, chỉ expose port cho local và ghi rõ cách
    lưu dữ liệu bền vững.
-   Cấu hình CORS chỉ cho origin local cần thiết.
-   Không yêu cầu kết nối internet để các chức năng cốt lõi hoạt động.

------------------------------------------------------------------------

## 10. Bảo mật và chất lượng

-   BCrypt cho mật khẩu.
-   Xác thực và phân quyền ở backend.
-   Không log mật khẩu, JWT hoặc thông tin bí mật.
-   Không trả password hash qua API.
-   Validate và chuẩn hóa dữ liệu đầu vào.
-   Chống truy cập IDOR bằng kiểm tra quyền sở hữu dữ liệu.
-   Dùng transaction cho đặt hàng, xác nhận nhập kho và hủy đơn.
-   Tránh tồn kho âm và cập nhật tồn kho trùng lặp.
-   Xử lý lỗi tập trung.
-   Không hiển thị stack trace cho người dùng.
-   Cấu hình CORS rõ ràng cho local.
-   Không lưu secret trong Git.
-   Không thêm dữ liệu cá nhân thật vào seed.
-   Có kiểm thử cho nghiệp vụ quan trọng, đặc biệt là đặt hàng và cập
    nhật tồn kho.

------------------------------------------------------------------------

## 11. Lộ trình triển khai bắt buộc

### Giai đoạn 0 --- Khảo sát và kế hoạch

1.  Kiểm tra máy và repository hiện tại.
2.  Xác định JDK, Maven, Node.js/npm, MySQL và Docker (nếu có).
3.  Báo cáo ngắn các công cụ đã có và thiếu.
4.  Tạo kế hoạch theo giai đoạn và danh sách tệp dự kiến.
5.  Không bắt đầu bằng cách sinh tất cả code cùng lúc.

### Giai đoạn 1 --- Khởi tạo và database

1.  Tạo repository backend/frontend.
2.  Khởi tạo Spring Boot và React TypeScript bằng Vite.
3.  Cấu hình MySQL local.
4.  Tạo migration schema.
5.  Thêm dữ liệu seed an toàn, có thể chạy lại.
6.  Viết README hướng dẫn khởi chạy.
7.  Kiểm tra backend build và frontend build.

### Giai đoạn 2 --- Backend nền tảng

1.  Entity, repository và migration.
2.  DTO và validation.
3.  Cấu trúc response lỗi thống nhất.
4.  Xác thực, phân quyền và seed tài khoản admin local.
5.  CRUD danh mục, tác giả, nhà xuất bản và sách.
6.  Kiểm thử API và quyền truy cập.

### Giai đoạn 3 --- Frontend nền tảng

1.  Thiết lập router, layout và API client.
2.  Màn hình đăng nhập/đăng ký.
3.  Route guard và xử lý phiên đăng nhập.
4.  Trang danh sách sách và chi tiết sách.
5.  Trang quản trị sách/danh mục/tác giả/nhà xuất bản.
6.  Kết nối API thật; xử lý loading/error/empty state.

### Giai đoạn 4 --- Đơn hàng và kho

1.  Giỏ hàng.
2.  Tạo đơn hàng COD.
3.  Kiểm tra tồn kho và tính tiền tại backend.
4.  Lưu chi tiết đơn hàng snapshot.
5.  Transaction cập nhật kho và ghi lịch sử.
6.  Quản trị đơn hàng, chuyển trạng thái và hủy đơn.
7.  Phiếu nhập hàng và xác nhận nhập kho.
8.  Kiểm thử các trường hợp lỗi và request đồng thời nếu phù hợp.

### Giai đoạn 5 --- Dashboard và hoàn thiện

1.  Dashboard lấy số liệu thật từ API.
2.  Quản lý khách hàng.
3.  Tìm kiếm, lọc, phân trang.
4.  Hoàn thiện responsive và trải nghiệm người dùng.
5.  Kiểm thử end-to-end các luồng quan trọng.
6.  Kiểm tra lỗi console, lỗi backend và log.
7.  Cập nhật README với hướng dẫn cài đặt, chạy, test và tài khoản demo
    local.

Sau mỗi giai đoạn, báo cáo: - Những gì đã hoàn thành. - Các tệp quan
trọng đã tạo/sửa. - Lệnh đã chạy và kết quả thực tế. - Lỗi còn tồn
tại. - Bước tiếp theo.

Không được chỉ báo cáo thành công dựa trên việc đã viết code.

------------------------------------------------------------------------

## 12. Kiểm thử và tiêu chí nghiệm thu

### Kiểm thử backend

-   Đăng ký với dữ liệu hợp lệ.
-   Từ chối email trùng và dữ liệu không hợp lệ.
-   Đăng nhập sai mật khẩu bị từ chối.
-   API quản trị từ chối khách hàng thường.
-   CRUD sách hoạt động với MySQL.
-   API công khai không trả giá nhập hoặc password hash.
-   Không tạo đơn nếu thiếu hàng.
-   Backend tự tính tổng tiền từ dữ liệu database.
-   Đặt hàng thành công tạo order và order details, giảm kho chính xác.
-   Nếu một bước trong transaction thất bại, dữ liệu không bị ghi dở
    dang.
-   Hủy đơn hoàn kho đúng một lần.
-   Không xem được đơn hàng của người khác.
-   Xác nhận phiếu nhập chỉ tăng kho một lần.
-   Dashboard trả số liệu dựa trên dữ liệu database.

### Kiểm thử frontend

-   Các trang tải được khi backend hoạt động.
-   Hiển thị đúng trạng thái loading, lỗi và danh sách rỗng.
-   Form báo lỗi rõ ràng.
-   Route quản trị được bảo vệ ở frontend và backend.
-   Giỏ hàng tính tổng đúng ở giao diện; backend vẫn là nguồn tính tiền
    cuối cùng.
-   Đặt hàng thành công hiển thị mã đơn.
-   Tìm kiếm, lọc và phân trang hoạt động.
-   Không có lỗi nghiêm trọng trong console.

### Điều kiện hoàn thành MVP

-   Có hướng dẫn chạy local rõ ràng.
-   Backend kết nối MySQL thực.
-   Frontend gọi API backend thực.
-   Các chức năng CRUD sách và danh mục hoạt động.
-   Có đăng nhập và phân quyền.
-   Có giỏ hàng và đặt hàng COD.
-   Có quản lý đơn hàng và tồn kho cơ bản.
-   Có kiểm thử nghiệp vụ chính.
-   Không cần hosting hoặc cloud.

------------------------------------------------------------------------

## 13. README phải có

Tạo `README.md` bằng tiếng Việt, tối thiểu gồm:

1.  Mô tả dự án và các công nghệ.
2.  Yêu cầu cài đặt.
3.  Cách tạo database/user MySQL.
4.  Cách cấu hình biến môi trường.
5.  Cách chạy backend.
6.  Cách chạy frontend.
7.  URL local và API base URL.
8.  Cách chạy migration và seed.
9.  Cách chạy test.
10. Tài khoản demo local (nếu tạo), ghi rõ mật khẩu demo và cách đổi.
11. Các lỗi phổ biến: sai thông tin DB, port bị chiếm, thiếu JDK/Node,
    CORS.
12. Giới hạn của MVP và các chức năng chưa triển khai.

Các lệnh chạy phải khớp với tệp cấu hình thực tế; không ghi lệnh giả
định mà chưa kiểm tra.

------------------------------------------------------------------------

## 14. Chỉ dẫn bắt đầu cho Antigravity

Khi nhận được tài liệu này:

1.  Đọc toàn bộ `ANTIGRAVITY_PROJECT_SPEC.md`.
2.  Khảo sát repository và công cụ local trước khi chỉnh sửa.
3.  Tóm tắt kế hoạch triển khai và những giả định quan trọng.
4.  Bắt đầu với **Giai đoạn 0 và Giai đoạn 1**, không sinh toàn bộ ứng
    dụng trong một lượt.
5.  Sau khi khởi tạo, chạy build/test để xác minh môi trường.
6.  Tiếp tục từng giai đoạn theo thứ tự, đảm bảo backend, frontend và
    MySQL tích hợp được với nhau.
7.  Nếu gặp lỗi, đọc log, xác định nguyên nhân, sửa và chạy lại kiểm
    tra.
8.  Cập nhật README và báo cáo tiến độ thực tế.
9.  Ưu tiên hoàn thành một luồng end-to-end nhỏ nhưng hoạt động (đọc
    danh sách sách từ MySQL qua API lên React) trước khi mở rộng các
    phân hệ khác.
10. Không triển khai hosting. Mọi hướng dẫn chạy phải hướng tới local.

**Ưu tiên kỹ thuật:** đúng nghiệp vụ, an toàn dữ liệu, dễ chạy local,
cấu trúc dễ bảo trì, rồi mới đến hiệu ứng giao diện.
