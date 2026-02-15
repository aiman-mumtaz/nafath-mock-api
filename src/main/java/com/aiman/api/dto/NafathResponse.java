package com.aiman.api.dto;

import java.util.UUID;

public record NafathResponse(
    UUID transdId,
    Integer randomCode,
    String status
) {
    
}
