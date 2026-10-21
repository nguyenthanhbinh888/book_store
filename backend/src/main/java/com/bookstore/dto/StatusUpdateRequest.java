package com.bookstore.dto;

import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private Boolean active;

    public StatusUpdateRequest() {}

    public StatusUpdateRequest(Boolean active) {
        this.active = active;
    }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
