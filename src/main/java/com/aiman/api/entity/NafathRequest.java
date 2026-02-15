package com.aiman.api.entity;

import java.sql.Timestamp;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "nafath_request")
public class NafathRequest {
    @Id
    @Column(name = "id")
    private UUID id = UUID.randomUUID();

    @Column(name = "national_id")
    private String nationalId;

    @Column(name = "random_code")
    private Integer randomCode;

    @Column(name = "status")
    private String status = "PENDING";

    @CreationTimestamp
    @Column(name = "created_at")
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;
}
