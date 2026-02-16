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
    private boolean isValidNationalId(String nationalId){
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            int digit = Character.getNumericValue(nationalId.charAt(i));
            if (i % 2 == 0) {
                int doubled = digit * 2;
                sum += (doubled > 9) ? (doubled - 9) : doubled;
            } else {
                sum += digit;
            }
        }
        int checkDigit = Character.getNumericValue(nationalId.charAt(9));
        return (10 - (sum % 10)) % 10 == checkDigit;
    }
    
    public NafathRequest initiateNafathRequest(String nationalId){
        if(!isValidNationalId(nationalId)){
            throw new IllegalArgumentException("Invalid National ID format");
        }
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
