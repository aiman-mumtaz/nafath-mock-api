package com.aiman.api.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aiman.api.dto.InitiateRequest;
import com.aiman.api.dto.NafathResponse;
import com.aiman.api.entity.NafathRequest;
import com.aiman.api.service.NafathService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/nafath/api/v1")
public class NafathController {

    @Autowired private NafathService nafathService;

    // 1. Initiate the request
    @PostMapping("/initiate")
    public ResponseEntity<NafathRequest> initiateNafathRequest(@Valid @RequestBody InitiateRequest req){
        return ResponseEntity.ok(nafathService.initiateNafathRequest(req.nationalId()));
    }
    // 2. Poll for status
    @GetMapping("/status/{id}")
    public ResponseEntity<NafathResponse> poll (@PathVariable UUID id) {
        String status = nafathService.checkStatus(id);
        return ResponseEntity.ok(new NafathResponse(id, null, status));
    }
    
    // 3. Mock simulate the user clicking "Approve" in the Nafath App
    @PatchMapping("/simulate-approval/{id}")
    public void simulateApproval(@PathVariable UUID id, @RequestBody Map<String, String> body){
        nafathService.simulateApproval(id, body.get("status"));
    }
}
