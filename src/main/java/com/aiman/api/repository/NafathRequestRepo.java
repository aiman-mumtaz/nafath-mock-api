package com.aiman.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aiman.api.entity.NafathRequest;

public interface NafathRequestRepo extends JpaRepository<NafathRequest, UUID>{}
