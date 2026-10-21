-- =======================================================
-- V2__seed_initial_data.sql: Dữ liệu mẫu an toàn, có thể chạy lại
-- =======================================================

-- 1. Tài khoản mẫu
-- Admin: admin@bookstore.local / Admin@123456
-- Customer: customer@bookstore.local / Customer@123456
INSERT INTO users (id, full_name, email, password_hash, phone, role, active)
VALUES 
(1, 'Quản Trị Viên Hệ Thống', 'admin@bookstore.local', '$2a$10$3KzG6HF8kD2RMq7A5KHZK.aQveIzUrZ5YkO7jPAdYtERWL/CFvatG', '0901234567', 'ADMIN', TRUE),
(2, 'Nguyễn Văn An', 'customer@bookstore.local', '$2a$10$oiycfIbSnmwy1UdFKPo8kOsNJ9M9Q/4yVGf7RHYd7.pgvkUI5K19W', '0987654321', 'CUSTOMER', TRUE)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 2. Danh mục sách
INSERT INTO categories (id, name, description, active)
VALUES
(1, 'Công nghệ thông tin', 'Sách về khoa học máy tính, lập trình, trí tuệ nhân tạo và kiến trúc phần mềm.', TRUE),
(2, 'Kinh tế & Quản trị', 'Sách về khởi nghiệp, tài chính, đầu tư, quản lý doanh nghiệp và kỹ năng lãnh đạo.', TRUE),
(3, 'Văn học & Nghệ thuật', 'Tiểu thuyết kinh điển, văn học đương đại, thơ ca và nghệ thuật sáng tạo.', TRUE),
(4, 'Kỹ năng sống & Tư duy', 'Sách rèn luyện bản thân, tư duy phản biện, kỹ năng giao tiếp và tâm lý học ứng dụng.', TRUE),
(5, 'Khoa học & Khám phá', 'Khám phá vũ trụ, tự nhiên, sinh học và các tiến trình lịch sử nhân loại.', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 3. Tác giả
INSERT INTO authors (id, name, biography)
VALUES
(1, 'Robert C. Martin', 'Kỹ sư phần mềm kỳ cựu, đồng tác giả của Tuyên ngôn Agile và tác giả của nhiều đầu sách kinh điển về phát triển phần mềm sạch.'),
(2, 'Martin Fowler', 'Chuyên gia kiến trúc phần mềm, nhà khoa học máy tính chuyên về thiết kế hướng đối tượng và tái cấu trúc mã nguồn (Refactoring).'),
(3, 'Dale Carnegie', 'Nhà văn, diễn giả người Mỹ phát triển các khóa học kỹ năng nổi tiếng về giao tiếp và phát triển nhân cách.'),
(4, 'Yuval Noah Harari', 'Nhà sử học, triết học và tác giả nổi tiếng thế giới với bộ sách lịch sử văn minh nhân loại.'),
(5, 'Nguyễn Nhật Ánh', 'Nhà văn Việt Nam nổi tiếng với những tác phẩm văn học tuổi thơ và tình cảm tuổi thiếu niên trong sáng.')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 4. Nhà xuất bản
INSERT INTO publishers (id, name, address, phone)
VALUES
(1, 'NXB Trẻ', '161B Lý Chính Thắng, Phường 7, Quận 3, TP. Hồ Chí Minh', '02839316289'),
(2, 'NXB Kim Đồng', '55 Quang Trung, Nguyễn Du, Hai Bà Trưng, Hà Nội', '02439434730'),
(3, 'NXB Thế Giới', '46 Trần Hưng Đạo, Hàng Bài, Hoàn Kiếm, Hà Nội', '02438253841'),
(4, 'NXB Lao Động', '175 Giảng Võ, Cát Linh, Đống Đa, Hà Nội', '02438515380')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 5. Nhà cung cấp
INSERT INTO suppliers (id, name, contact_name, phone, email, address)
VALUES
(1, 'Công ty Cổ phần Phát hành Sách Fahasa', 'Phòng Kinh Doanh Fahasa', '02838225446', 'kinhdoanh@fahasa.com.vn', '60-62 Lê Lợi, Quận 1, TP. Hồ Chí Minh'),
(2, 'Công ty Văn hóa Phương Nam', 'Đại diện phân phối Phương Nam', '02838332155', 'distribution@phuongnam.com.vn', '940 Đường 3/2, Phường 15, Quận 11, TP. Hồ Chí Minh')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 6. Sách
INSERT INTO books (id, isbn, title, description, category_id, publisher_id, selling_price, cost_price, stock_quantity, cover_image_url, active)
VALUES
(1, '9780132350884', 'Clean Code: Mã Sạch Và Con Đường Trở Thành Lập Trình Viên Chuyên Nghiệp', 
 'Cẩm nang toàn diện về việc viết mã nguồn dễ đọc, dễ kiểm thử và dễ bảo trì dành cho mọi lập trình viên chuyên nghiệp.', 
 1, 3, 215000.00, 140000.00, 45, 
 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd9?auto=format&fit=crop&w=600&q=80', TRUE),

(2, '9780201485677', 'Refactoring: Tái Cấu Trúc Mã Nguồn Hiện Có', 
 'Hướng dẫn chi tiết từng bước cách nâng cao cấu trúc mã nguồn bên trong mà không làm thay đổi hành vi bên ngoài của hệ thống.', 
 1, 3, 280000.00, 185000.00, 30, 
 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', TRUE),

(3, '9780671027032', 'Đắc Nhân Tâm (Bản Chuẩn)', 
 'Cuốn sách nghệ thuật thu phục lòng người kinh điển của Dale Carnegie, đã thay đổi cuộc đời hàng triệu người trên thế giới.', 
 4, 1, 86000.00, 52000.00, 120, 
 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80', TRUE),

(4, '9780062316097', 'Sapiens: Lược Sử Loài Người', 
 'Khám phá hành trình phi thường của Homo sapiens từ loài linh trưởng vô danh trở thành bá chủ hành tinh xanh.', 
 5, 3, 195000.00, 125000.00, 60, 
 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80', TRUE),

(5, '9780062464316', 'Homo Deus: Lược Sử Tương Lai', 
 'Tập trung vào tương lai của nhân loại khi con người đối mặt với trí tuệ nhân tạo, công nghệ sinh học và khát vọng bất tử.', 
 5, 3, 210000.00, 135000.00, 40, 
 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', TRUE),

(6, '9786041076938', 'Mắt Biếc', 
 'Một trong những tiểu thuyết nổi tiếng nhất của nhà văn Nguyễn Nhật Ánh về tình yêu thanh xuân ngọt ngào và day dứt.', 
 3, 1, 110000.00, 70000.00, 55, 
 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', TRUE),

(7, '9786041005235', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 
 'Bức tranh đồng quê tuổi thơ với những vui buồn, tình anh em và những rung động đầu đời trong trẻo.', 
 3, 1, 95000.00, 60000.00, 8, 
 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80', TRUE),

(8, '9780134494166', 'Clean Architecture: Cấu Trúc Phần Mềm Chuẩn', 
 'Quy tắc thiết kế kiến trúc độc lập framework, giao diện và cơ sở dữ liệu giúp ứng dụng bền vững hàng thập kỷ.', 
 1, 3, 245000.00, 160000.00, 5, 
 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),

(9, '9780062457714', '21 Bài Học Cho Thế Kỷ 21', 
 'Nhìn nhận những vấn đề cấp bách nhất của nhân loại hiện đại: chiến tranh hạt nhân, biến đổi khí hậu và chuyển đổi số.', 
 5, 3, 185000.00, 120000.00, 25, 
 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80', TRUE),

(10, '9780671723651', 'Quẳng Gánh Lo Đi Và Vui Sống', 
 'Phương pháp kiểm soát căng thẳng, loại bỏ âu lo để tận hưởng trọn vẹn từng khoảnh khắc ý nghĩa của cuộc sống.', 
 4, 1, 92000.00, 58000.00, 70, 
 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- 7. Liên kết Sách và Tác giả
INSERT INTO book_authors (book_id, author_id)
VALUES
(1, 1), -- Clean Code - Robert C. Martin
(2, 2), -- Refactoring - Martin Fowler
(3, 3), -- Đắc Nhân Tâm - Dale Carnegie
(4, 4), -- Sapiens - Yuval Noah Harari
(5, 4), -- Homo Deus - Yuval Noah Harari
(6, 5), -- Mắt Biếc - Nguyễn Nhật Ánh
(7, 5), -- Tôi Thấy Hoa Vàng Trên Cỏ Xanh - Nguyễn Nhật Ánh
(8, 1), -- Clean Architecture - Robert C. Martin
(9, 4), -- 21 Bài Học Cho Thế Kỷ 21 - Yuval Noah Harari
(10, 3) -- Quẳng Gánh Lo Đi Và Vui Sống - Dale Carnegie
ON DUPLICATE KEY UPDATE author_id = VALUES(author_id);

-- 8. Lịch sử kho ban đầu
INSERT INTO inventory_transactions (book_id, transaction_type, reference_type, reference_id, quantity_change, note, created_by)
VALUES
(1, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 45, 'Khởi tạo tồn kho ban đầu', 1),
(2, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 30, 'Khởi tạo tồn kho ban đầu', 1),
(3, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 120, 'Khởi tạo tồn kho ban đầu', 1),
(4, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 60, 'Khởi tạo tồn kho ban đầu', 1),
(5, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 40, 'Khởi tạo tồn kho ban đầu', 1),
(6, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 55, 'Khởi tạo tồn kho ban đầu', 1),
(7, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 8, 'Khởi tạo tồn kho ban đầu (sắp hết hàng)', 1),
(8, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 5, 'Khởi tạo tồn kho ban đầu (sắp hết hàng)', 1),
(9, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 25, 'Khởi tạo tồn kho ban đầu', 1),
(10, 'ADJUSTMENT', 'INITIAL_STOCK', NULL, 70, 'Khởi tạo tồn kho ban đầu', 1);
