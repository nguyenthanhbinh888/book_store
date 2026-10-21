$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=== TEST ORDER CANCELLATION & INVENTORY RESTORATION ==="
$loginBody = @{ email = "long.le@example.com"; password = "Password@123" } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json; charset=utf-8"
$token = $loginRes.data.token
$headers = @{ "Authorization" = "Bearer $token" }

# 1. Place order for 3 books of ID 2 (Refactoring)
$orderBody = @{
    recipientName = "Lê Hoàng Long"
    recipientPhone = "0944556677"
    shippingAddress = "789 Điện Biên Phủ, TP.HCM"
    items = @( @{ bookId = 2; quantity = 3 } )
} | ConvertTo-Json
$newOrder = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" -Method Post -Body $orderBody -Headers $headers -ContentType "application/json; charset=utf-8"
Write-Host "Created Order to cancel: $($newOrder.data.orderCode) | Status: $($newOrder.data.status)"

# 2. Cancel order
$cancelRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders/my/$($newOrder.data.id)/cancel" -Method Post -Headers $headers
Write-Host "Cancelled Order successfully. New Status: $($cancelRes.data.status)"

# 3. Check inventory log to verify stock was restored (+3)
$adminLoginBody = @{ email = "admin@bookstore.local"; password = "Admin@123456" } | ConvertTo-Json
$adminLoginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json; charset=utf-8"
$adminHeaders = @{ "Authorization" = "Bearer $($adminLoginRes.data.token)" }
$inv = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/admin/inventory/transactions?size=2" -Method Get -Headers $adminHeaders
foreach ($t in $inv.data.content) {
    Write-Host "- [Log] Type: $($t.transactionType) | QtyChange: $($t.quantityChange) | Note: $($t.note)"
}
