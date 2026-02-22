package com.aiman.api.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.aiman.api.dto.InitiateRequest;
import com.aiman.api.dto.NafathResponse;
import com.aiman.api.entity.NafathRequest;
import com.aiman.api.service.NafathService;
import com.aiman.api.service.RiskAssessmentService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(
    origins = "http://localhost:3000", 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS}
)
@RequestMapping("/nafath/api/v1")
public class NafathController {

    @Autowired private NafathService nafathService;
    @Autowired private RiskAssessmentService riskService;

    @PostMapping("/initiate")
    public ResponseEntity<?> initiate(@RequestBody InitiateRequest req, HttpServletRequest request) {

        String ip = request.getRemoteAddr();
        String ua = request.getHeader("User-Agent");

        var risk = riskService.analyze(req.nationalId(), ip, ua);

        if ("BLOCK".equals(risk.status()) || risk.score() > 0.85) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Security Block", "reason", risk.reason()));
        }

        NafathRequest nafath = nafathService.initiateNafathRequest(req.nationalId());
        return ResponseEntity.ok(Map.of("nafath", nafath, "aiInsight", risk));
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> poll (@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            
            String status = nafathService.checkStatus(uuid);
            return ResponseEntity.ok(new NafathResponse(uuid, null, status));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid ID format. Please provide a valid UUID.");
        }
    }

    @PatchMapping("/simulate-approval/{id}")
    public void simulateApproval(@PathVariable UUID id, @RequestBody Map<String, String> body){
        nafathService.simulateApproval(id, body.get("status"));
    }
}
