package com.aiman.api.dto;

import java.util.UUID;

public record NafathResponse(
    UUID id,
    Integer randomCode,
    String status
) {
    
}
