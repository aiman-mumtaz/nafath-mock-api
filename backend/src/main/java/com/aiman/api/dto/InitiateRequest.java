package com.aiman.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record InitiateRequest(
    @NotBlank(message = "National ID is required")
    @Size(min = 10, max = 10, message = "National ID must be exactly 10 characters")
    @Pattern(regexp = "^[12][0-9]{9}$", message = "National ID must be 10 digits and start with 1 or 2")
    String nationalId
) {}
