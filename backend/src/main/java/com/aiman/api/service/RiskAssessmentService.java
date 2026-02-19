package com.aiman.api.service;

// import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
@Service
public class RiskAssessmentService {

    // private final ChatClient chatClient;

    // public RiskAssessmentService(ChatClient.Builder builder) {
    //     this.chatClient = builder.build();
    // }

    public AssessmentResult analyze(String nationalId, String ip, String userAgent) {
    //     String userPromptTemplate = """
    //         Evaluate the security risk of this Saudi Nafath login attempt:
    //         - National ID: {id}
    //         - Origin IP: {ip}
    //         - Device: {ua}
    //         - Time: {time}
            
    //         Return JSON only: { "score": 0.0-1.0, "status": "SAFE|CAUTION|BLOCK", "reason": "string" }
    //         """;

    //     return chatClient.prompt()
    //             .user(u -> u.text(userPromptTemplate)
    //                         .params(Map.of(
    //                             "id", nationalId,
    //                             "ip", ip,
    //                             "ua", userAgent,
    //                             "time", LocalDateTime.now().toString()
    //                         )))
    //             .call()
    //             .entity(AssessmentResult.class);
    
    // Mock Assesment begin
        double score = Math.random();
        String status = (score > 0.9) ? "BLOCK" : "SAFE";
        return new AssessmentResult(score, status, "Mocked AI Assessment for testing");
    // Mock Assesment end

    }

    public record AssessmentResult(double score, String status, String reason) {}
}