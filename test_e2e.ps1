$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=== 1. TEST REGISTER NEW CUSTOMER ==="
$regBody = @{
    fullName = "Lê Hoàng Long"
    email    = "long.le@example.com"
    password = "Password@123"
    phone    = "0944556677"
} | ConvertTo-Json

$regRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/register" -Method Post -Body $regBody -ContentType "application/json; charset=utf-8"
Write-Host "Registered: $($regRes.data.user.fullName), Email: $($regRes.data.user.email)"
$custToken = $regRes.data.token

Write-Host "=== 2. TEST PLACE COD ORDER ==="
$orderHeaders = @{
    "Authorization" = "Bearer $custToken"
}
$orderBody = @{
    recipientName   = "Lê Hoàng Long"
    recipientPhone  = "0944556677"
    shippingAddress = "789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM"
    note            = "Giao giờ hành chính"
    items           = @(
        @{ bookId = 1; quantity = 2 }
    )
} | ConvertTo-Json

$orderRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" -Method Post -Body $orderBody -Headers $orderHeaders -ContentType "application/json; charset=utf-8"
Write-Host "Order Placed Successfully: $($orderRes.data.orderCode) | Total: $($orderRes.data.totalAmount) | Status: $($orderRes.data.status)"

Write-Host "=== 3. TEST ADMIN LOGIN ==="
$adminLoginBody = @{
    email    = "admin@bookstore.local"
    password = "Admin@123456"
} | ConvertTo-Json
$adminLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json; charset=utf-8"
$adminToken = $adminLoginRes.data.token
Write-Host "Admin Logged in: $($adminLoginRes.data.user.fullName), Role: $($adminLoginRes.data.user.role)"

Write-Host "=== 4. TEST ADMIN UPDATE ORDER STATUS ==="
$adminHeaders = @{
    "Authorization" = "Bearer $adminToken"
}
$statusBody = @{ status = "COMPLETED" } | ConvertTo-Json
$statusRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/orders/$($orderRes.data.id)/status" -Method Patch -Body $statusBody -Headers $adminHeaders -ContentType "application/json; charset=utf-8"
Write-Host "Order status updated to: $($statusRes.data.status) | PaymentStatus: $($statusRes.data.paymentStatus)"

Write-Host "=== 5. TEST ADMIN DASHBOARD ==="
$dashRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/dashboard/summary" -Method Get -Headers $adminHeaders
Write-Host "Dashboard Summary:"
Write-Host "  - Active books count: $($dashRes.data.activeBookCount)"
Write-Host "  - Total orders: $($dashRes.data.totalOrderCount)"
Write-Host "  - Total revenue (COMPLETED): $($dashRes.data.totalRevenue)"
Write-Host "  - Recent orders count: $($dashRes.data.recentOrders.Count)"
Write-Host "  - Low stock books count: $($dashRes.data.lowStockBooks.Count)"

Write-Host "=== 6. TEST CREATE & CONFIRM PURCHASE RECEIPT ==="
$receiptBody = @{
    supplierId = 1
    note       = "Nhập thêm 15 cuốn Clean Code"
    items      = @(
        @{ bookId = 1; quantity = 15; unitCost = 140000 }
    )
} | ConvertTo-Json
$prRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/purchase-receipts" -Method Post -Body $receiptBody -Headers $adminHeaders -ContentType "application/json; charset=utf-8"
Write-Host "Created Purchase Receipt: $($prRes.data.receiptCode) | Status: $($prRes.data.status) | TotalCost: $($prRes.data.totalCost)"

$confirmRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/purchase-receipts/$($prRes.data.id)/confirm" -Method Post -Headers $adminHeaders
Write-Host "Confirmed Purchase Receipt: $($confirmRes.data.receiptCode) | New Status: $($confirmRes.data.status)"

Write-Host "=== 7. VERIFY INVENTORY LOGS ==="
$invRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/inventory/transactions?size=5" -Method Get -Headers $adminHeaders
foreach ($t in $invRes.data.content) {
    Write-Host "  * [Type: $($t.transactionType)] Book: $($t.bookTitle) | QtyChange: $($t.quantityChange) | Note: $($t.note)"
}
