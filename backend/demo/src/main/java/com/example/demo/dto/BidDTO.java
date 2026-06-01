package com.example.demo.dto;

import com.example.demo.entity.Bid;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidDTO {
    private Long id;
    private BigDecimal bidAmount;
    private LocalDateTime bidTime;
    private Long auctionId;
    private Long bidderId;
    private String bidderName;
    private Boolean isWinning;
    private Boolean isPaid;
    private LocalDateTime paidTime;
    
    public static BidDTO fromEntity(Bid bid) {
        BidDTO dto = new BidDTO();
        dto.setId(bid.getId());
        dto.setBidAmount(bid.getBidAmount());
        dto.setBidTime(bid.getBidTime());
        dto.setAuctionId(bid.getAuction().getId());
        dto.setBidderId(bid.getBidder().getId());
        dto.setBidderName(bid.getBidder().getName());
        dto.setIsWinning(bid.getIsWinning());
        dto.setIsPaid(bid.getIsPaid());
        dto.setPaidTime(bid.getPaidTime());
        return dto;
    }
}
