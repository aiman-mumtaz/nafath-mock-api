package com.aiman.api.entity;

import java.sql.Timestamp;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;

@Entity
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

    // Standard Boilerplate (Guarantees the compiler won't fail)
    public NafathRequest() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }

    public Integer getRandomCode() { return randomCode; }
    public void setRandomCode(Integer randomCode) { this.randomCode = randomCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public Timestamp getUpdatedAt() { return updatedAt; }
}