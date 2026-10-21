package com.bookstore.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryResponse {
    private long activeBookCount;
    private long totalOrderCount;
    private long pendingOrderCount;
    private BigDecimal totalRevenue;
    private List<OrderResponse> recentOrders;
    private List<BookResponse> lowStockBooks;

    public DashboardSummaryResponse() {}

    public DashboardSummaryResponse(
        long activeBookCount,
        long totalOrderCount,
        long pendingOrderCount,
        BigDecimal totalRevenue,
        List<OrderResponse> recentOrders,
        List<BookResponse> lowStockBooks
    ) {
        this.activeBookCount = activeBookCount;
        this.totalOrderCount = totalOrderCount;
        this.pendingOrderCount = pendingOrderCount;
        this.totalRevenue = totalRevenue;
        this.recentOrders = recentOrders;
        this.lowStockBooks = lowStockBooks;
    }

    public long getActiveBookCount() { return activeBookCount; }
    public void setActiveBookCount(long activeBookCount) { this.activeBookCount = activeBookCount; }

    public long getTotalOrderCount() { return totalOrderCount; }
    public void setTotalOrderCount(long totalOrderCount) { this.totalOrderCount = totalOrderCount; }

    public long getPendingOrderCount() { return pendingOrderCount; }
    public void setPendingOrderCount(long pendingOrderCount) { this.pendingOrderCount = pendingOrderCount; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }

    public List<BookResponse> getLowStockBooks() { return lowStockBooks; }
    public void setLowStockBooks(List<BookResponse> lowStockBooks) { this.lowStockBooks = lowStockBooks; }
}
