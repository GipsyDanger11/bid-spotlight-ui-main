package com.example.demo.controller;

import com.example.demo.dto.BidDTO;
import com.example.demo.entity.Bid;
import com.example.demo.service.BidService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/bids")
@CrossOrigin(origins = "http://localhost:5173")
public class BidController {

    @Autowired
    private BidService bidService;

    @PostMapping
    public ResponseEntity<BidDTO> placeBid(@RequestBody BidDTO bidDTO) {
        Bid bid = bidService.placeBid(bidDTO);
        if (bid != null) {
            return ResponseEntity.ok(BidDTO.fromEntity(bid));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<BidDTO>> getBidsByAuction(@PathVariable Long auctionId) {
        List<Bid> bids = bidService.getBidsByAuction(auctionId);
        List<BidDTO> bidDTOs = bids.stream()
                .map(BidDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDTOs);
    }

    @GetMapping("/bidder/{bidderId}")
    public ResponseEntity<List<BidDTO>> getBidsByBidder(@PathVariable Long bidderId) {
        List<Bid> bids = bidService.getBidsByBidder(bidderId);
        List<BidDTO> bidDTOs = bids.stream()
                .map(BidDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDTOs);
    }

    @GetMapping("/auction/{auctionId}/highest")
    public ResponseEntity<BidDTO> getHighestBid(@PathVariable Long auctionId) {
        Bid bid = bidService.getHighestBid(auctionId);
        if (bid != null) {
            return ResponseEntity.ok(BidDTO.fromEntity(bid));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/bidder/{bidderId}/active-auctions-count")
    public ResponseEntity<Long> getActiveAuctionsCountForBidder(@PathVariable Long bidderId) {
        Long count = bidService.countActiveAuctionsByBidder(bidderId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/recent")
    public ResponseEntity<java.util.List<BidDTO>> getRecentBids() {
        java.util.List<Bid> bids = bidService.getRecentBids();
        java.util.List<BidDTO> dtos = bids.stream().map(BidDTO::fromEntity).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
