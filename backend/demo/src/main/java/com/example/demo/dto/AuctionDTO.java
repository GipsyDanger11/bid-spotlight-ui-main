package com.example.demo.dto;

import com.example.demo.entity.Auction;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal startingBid;
    private BigDecimal currentBid;
    private String category;
    private Integer durationMinutes;
    private LocalDateTime endTime;
    private Auction.AuctionStatus status;
    private LocalDateTime createdDate;
    private Integer views;
    private Integer bidCount;
    private String imageUrl;
    private Long sellerId;
    private String sellerName;
    private String sellerEmail;
    private String timeLeft;
    
    public static AuctionDTO fromEntity(Auction auction) {
        AuctionDTO dto = new AuctionDTO();
        dto.setId(auction.getId());
        dto.setName(auction.getName());
        dto.setDescription(auction.getDescription());
        dto.setStartingBid(auction.getStartingBid());
        dto.setCurrentBid(auction.getCurrentBid());
        dto.setCategory(auction.getCategory());
        dto.setDurationMinutes(auction.getDurationMinutes());
        dto.setEndTime(auction.getEndTime());
        dto.setStatus(auction.getStatus());
        dto.setCreatedDate(auction.getCreatedDate());
        dto.setViews(auction.getViews());
        dto.setBidCount(auction.getBidCount());
        dto.setImageUrl(auction.getImageUrl());
        
        if (auction.getSeller() != null) {
            dto.setSellerId(auction.getSeller().getId());
            dto.setSellerName(auction.getSeller().getName());
            dto.setSellerEmail(auction.getSeller().getEmail());
        }
        
        // Calculate time left
        if (auction.getEndTime() != null) {
            LocalDateTime now = LocalDateTime.now();
            if (auction.getEndTime().isAfter(now)) {
                long hours = java.time.Duration.between(now, auction.getEndTime()).toHours();
                long minutes = java.time.Duration.between(now, auction.getEndTime()).toMinutesPart();
                dto.setTimeLeft(hours + "h " + minutes + "m");
            } else {
                dto.setTimeLeft("Expired");
            }
        }
        
        return dto;
    }
}
