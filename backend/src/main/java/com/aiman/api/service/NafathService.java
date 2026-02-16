package com.aiman.api.service;

import java.util.Random;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aiman.api.entity.NafathRequest;
import com.aiman.api.repository.NafathRequestRepo;

@Service
public class NafathService {
    
    @Autowired private NafathRequestRepo nafathRequestRepo;

    public NafathRequest initiateNafathRequest(String nationalId){
        NafathRequest nafathRequest = new NafathRequest();

        nafathRequest.setNationalId(nationalId);
        nafathRequest.setRandomCode(new Random().nextInt(90)+10);

        return nafathRequestRepo.save(nafathRequest);
    }

    public String checkStatus(UUID id){
        return nafathRequestRepo.findById(id)
                .map(NafathRequest::getStatus)
                .orElse("NOT_FOUND");
    }

    public void simulateApproval(UUID id, String status){
        NafathRequest nafathRequest = nafathRequestRepo.findById(id).orElseThrow();
        nafathRequest.setStatus(status);
        nafathRequestRepo.save(nafathRequest);
    }
}
