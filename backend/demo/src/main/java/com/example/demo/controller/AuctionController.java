package com.example.demo.controller;

import com.example.demo.dto.AuctionDTO;
import com.example.demo.entity.Auction;
import com.example.demo.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auctions")
@CrossOrigin(origins = "http://localhost:5173")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping
    public ResponseEntity<List<AuctionDTO>> getAllAuctions() {
        List<Auction> auctions = auctionService.getAllAuctions();
        List<AuctionDTO> auctionDTOs = auctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }

    @GetMapping("/active")
    public ResponseEntity<List<AuctionDTO>> getActiveAuctions() {
        List<Auction> auctions = auctionService.getActiveAuctions();
        List<AuctionDTO> auctionDTOs = auctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<AuctionDTO>> getPendingAuctions() {
        List<Auction> auctions = auctionService.getPendingAuctions();
        List<AuctionDTO> auctionDTOs = auctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<AuctionDTO>> getAuctionsBySeller(@PathVariable Long sellerId) {
        List<Auction> auctions = auctionService.getAuctionsBySeller(sellerId);
        List<AuctionDTO> auctionDTOs = auctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionDTO> getAuctionById(@PathVariable Long id) {
        Auction auction = auctionService.getAuctionById(id);
        if (auction != null) {
            return ResponseEntity.ok(AuctionDTO.fromEntity(auction));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<AuctionDTO> createAuction(@RequestBody AuctionDTO auctionDTO) {
        Auction auction = auctionService.createAuction(auctionDTO);
        return ResponseEntity.ok(AuctionDTO.fromEntity(auction));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<AuctionDTO> approveAuction(@PathVariable Long id) {
        Auction auction = auctionService.approveAuction(id);
        if (auction != null) {
            return ResponseEntity.ok(AuctionDTO.fromEntity(auction));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<AuctionDTO> rejectAuction(@PathVariable Long id) {
        Auction auction = auctionService.rejectAuction(id);
        if (auction != null) {
            return ResponseEntity.ok(AuctionDTO.fromEntity(auction));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AuctionDTO> cancelAuction(@PathVariable Long id) {
        Auction auction = auctionService.cancelAuction(id);
        if (auction != null) {
            return ResponseEntity.ok(AuctionDTO.fromEntity(auction));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<AuctionDTO> completeAuction(@PathVariable Long id) {
        Auction auction = auctionService.completeAuction(id);
        if (auction != null) {
            return ResponseEntity.ok(AuctionDTO.fromEntity(auction));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/complete-expired")
    public ResponseEntity<List<AuctionDTO>> completeExpiredAuctions() {
        List<Auction> completedAuctions = auctionService.completeExpiredAuctions();
        List<AuctionDTO> auctionDTOs = completedAuctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }

    @GetMapping("/completed")
    public ResponseEntity<List<AuctionDTO>> getCompletedAuctions() {
        List<Auction> completedAuctions = auctionService.getCompletedAuctions();
        List<AuctionDTO> auctionDTOs = completedAuctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }

    @GetMapping("/won/{userId}")
    public ResponseEntity<List<AuctionDTO>> getWonAuctionsByUser(@PathVariable Long userId) {
        List<Auction> wonAuctions = auctionService.getWonAuctionsByUser(userId);
        List<AuctionDTO> auctionDTOs = wonAuctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Void> incrementView(@PathVariable Long id) {
        auctionService.incrementView(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<AuctionDTO>> searchAuctions(@RequestParam String query) {
        List<Auction> auctions = auctionService.searchAuctions(query);
        List<AuctionDTO> auctionDTOs = auctions.stream()
                .map(AuctionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(auctionDTOs);
    }
}
