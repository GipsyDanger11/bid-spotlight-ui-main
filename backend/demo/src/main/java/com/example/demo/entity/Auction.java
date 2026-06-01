package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "auctions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "starting_bid", nullable = false, precision = 10, scale = 2)
    private BigDecimal startingBid;
    
    @Column(name = "current_bid", precision = 10, scale = 2)
    private BigDecimal currentBid;
    
    @Column(nullable = false)
    private String category;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuctionStatus status = AuctionStatus.PENDING;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();
    
    @Column(name = "views")
    private Integer views = 0;
    
    @Column(name = "bid_count")
    private Integer bidCount = 0;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bid> bids;
    
    public enum AuctionStatus {
        PENDING, ACTIVE, COMPLETED, REJECTED, CANCELLED
    }
    
    @PrePersist
    public void calculateEndTime() {
        if (createdDate == null) {
            this.createdDate = LocalDateTime.now();
        }
        if (durationMinutes != null && createdDate != null) {
            this.endTime = createdDate.plusMinutes(durationMinutes);
        }
    }
}
