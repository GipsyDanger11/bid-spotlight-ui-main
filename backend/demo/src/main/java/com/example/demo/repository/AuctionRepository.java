package com.example.demo.repository;

import com.example.demo.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByStatus(Auction.AuctionStatus status);
    
    List<Auction> findBySellerId(Long sellerId);
    
    List<Auction> findByCategory(String category);
    
    @Query("SELECT a FROM Auction a WHERE a.name LIKE %:searchTerm% OR a.description LIKE %:searchTerm%")
    List<Auction> findByNameOrDescriptionContaining(String searchTerm);
    
    @Query("SELECT a FROM Auction a WHERE a.status = 'ACTIVE' AND a.endTime > :currentTime ORDER BY a.endTime ASC")
    List<Auction> findActiveAuctions(LocalDateTime currentTime);
    
    @Query("SELECT a FROM Auction a WHERE a.status = 'PENDING' ORDER BY a.createdDate ASC")
    List<Auction> findPendingAuctions();
    
    @Query("SELECT COUNT(a) FROM Auction a WHERE a.status = :status")
    Long countByStatus(Auction.AuctionStatus status);
    
    @Query("SELECT a FROM Auction a WHERE a.seller.id = :sellerId AND a.status = :status")
    List<Auction> findBySellerIdAndStatus(@Param("sellerId") Long sellerId, @Param("status") Auction.AuctionStatus status);
    
    @Query("SELECT SUM(a.currentBid) FROM Auction a WHERE a.seller.id = :sellerId AND a.status = 'COMPLETED'")
    Double getTotalRevenueBySellerId(Long sellerId);
    
    @Query("SELECT DISTINCT a FROM Auction a JOIN a.bids b WHERE a.status = 'COMPLETED' AND b.bidder.id = :userId AND b.isWinning = true")
    List<Auction> findWonAuctionsByUser(@Param("userId") Long userId);
}
