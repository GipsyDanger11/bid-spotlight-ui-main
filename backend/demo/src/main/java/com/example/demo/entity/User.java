package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;
    
    @Column(name = "join_date")
    private LocalDateTime joinDate = LocalDateTime.now();
    
    @Column(name = "total_bids")
    private Integer totalBids = 0;
    
    @Column(name = "total_sales")
    private Integer totalSales = 0;
    
    @Column(name = "wallet_balance", precision = 10, scale = 2)
    private java.math.BigDecimal walletBalance = java.math.BigDecimal.valueOf(10000.00);
    
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Auction> auctions;
    
    @OneToMany(mappedBy = "bidder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Bid> bids;
    
    public enum UserRole {
        CUSTOMER, SELLER, ADMIN
    }
    
    public enum UserStatus {
        ACTIVE, SUSPENDED
    }
}
