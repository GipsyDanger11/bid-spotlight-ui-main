package com.example.demo.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.repository.BidRepository;
import com.example.demo.entity.Bid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.demo.dto.BidDTO;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private BidRepository bidRepository;

    @GetMapping("/key")
    public ResponseEntity<java.util.Map<String, String>> getKey() {
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("keyId", keyId);
        return ResponseEntity.ok(response);
    }

    public static class CreateOrderRequest {
        public Long amount;
        public String currency;
        public String receipt;
    }

    @PostMapping("/order")
    public ResponseEntity<java.util.Map<String, Object>> createOrder(@RequestBody CreateOrderRequest req) {
        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", req.amount); // amount in paise
            orderRequest.put("currency", req.currency != null ? req.currency : "INR");
            orderRequest.put("receipt", req.receipt != null ? req.receipt : "rcpt_" + System.currentTimeMillis());

            Order order = client.orders.create(orderRequest);
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("id", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("receipt", order.get("receipt"));
            response.put("status", order.get("status"));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            java.util.Map<String, Object> error = new java.util.HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @PostMapping("/mark-wins-paid/{userId}")
    public ResponseEntity<String> markWinsPaid(@PathVariable Long userId) {
        List<Bid> bids = bidRepository.findWinningUnpaidByBidder(userId);
        for (Bid b : bids) {
            b.setIsPaid(true);
            b.setPaidTime(LocalDateTime.now());
            bidRepository.save(b);
        }
        return ResponseEntity.ok("{\"updated\":" + bids.size() + "}");
    }

    public static class PaymentSummary {
        public double totalPaid;
        public double totalDue;
    }

    @GetMapping("/summary")
    public ResponseEntity<PaymentSummary> getSummary() {
        PaymentSummary s = new PaymentSummary();
        Double paid = bidRepository.sumAllWinningByPaid(true);
        Double due = bidRepository.sumAllWinningByPaid(false);
        s.totalPaid = paid != null ? paid : 0.0;
        s.totalDue = due != null ? due : 0.0;
        return ResponseEntity.ok(s);
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<PaymentSummary> getUserSummary(@PathVariable Long userId) {
        PaymentSummary s = new PaymentSummary();
        Double paid = bidRepository.sumWinningByBidderAndPaid(userId, true);
        Double due = bidRepository.sumWinningByBidderAndPaid(userId, false);
        s.totalPaid = paid != null ? paid : 0.0;
        s.totalDue = due != null ? due : 0.0;
        return ResponseEntity.ok(s);
    }

    @GetMapping("/user/{userId}/unpaid-bids")
    public ResponseEntity<List<BidDTO>> getUserUnpaidBids(@PathVariable Long userId) {
        List<BidDTO> list = bidRepository.findWinningUnpaidByBidder(userId).stream()
                .map(BidDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}/paid-bids")
    public ResponseEntity<List<BidDTO>> getUserPaidBids(@PathVariable Long userId) {
        List<BidDTO> list = bidRepository.findByBidderId(userId).stream()
                .filter(b -> Boolean.TRUE.equals(b.getIsWinning()) && Boolean.TRUE.equals(b.getIsPaid()))
                .map(BidDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}


