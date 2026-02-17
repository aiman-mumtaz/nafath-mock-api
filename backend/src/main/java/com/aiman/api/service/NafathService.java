package com.aiman.api.service;

import com.aiman.api.entity.NafathRequest;
import com.aiman.api.repository.NafathRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
public class NafathService {

    @Autowired
    private NafathRequestRepo repository;

    public NafathRequest initiateNafathRequest(String nationalId) {
        NafathRequest request = new NafathRequest();
        request.setNationalId(nationalId);
        
        request.setRandomCode(new Random().nextInt(90) + 10);
        request.setStatus("PENDING");
        
        return repository.save(request);
    }

    public String checkStatus(UUID id) {
        return repository.findById(id)
                .map(NafathRequest::getStatus)
                .orElse("NOT_FOUND");
    }

    public void simulateApproval(UUID id, String newStatus) {
        repository.findById(id).ifPresent(request -> {
            request.setStatus(newStatus);
            repository.save(request);
        });
    }
}