package com.example.demo.repository;

import com.example.demo.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionId(Long auctionId);
    
    List<Bid> findByBidderId(Long bidderId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.bidAmount DESC")
    List<Bid> findByAuctionIdOrderByBidAmountDesc(@Param("auctionId") Long auctionId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.bidAmount DESC LIMIT 1")
    Bid findHighestBidByAuctionId(@Param("auctionId") Long auctionId);
    
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.bidder.id = :bidderId")
    Long countByBidderId(Long bidderId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId AND b.isWinning = true")
    Bid findWinningBidByAuctionId(@Param("auctionId") Long auctionId);
    
    @Query("SELECT b FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.bidAmount DESC LIMIT 1")
    java.util.Optional<Bid> findTopByAuctionIdOrderByBidAmountDesc(@Param("auctionId") Long auctionId);

    @Query("SELECT COUNT(DISTINCT b.auction.id) FROM Bid b WHERE b.bidder.id = :bidderId AND b.auction.status = 'ACTIVE'")
    Long countActiveAuctionsByBidder(@Param("bidderId") Long bidderId);

    java.util.List<Bid> findTop10ByOrderByBidTimeDesc();

    @Query("SELECT b FROM Bid b WHERE b.bidder.id = :bidderId AND b.isWinning = true AND b.isPaid = false")
    java.util.List<Bid> findWinningUnpaidByBidder(@Param("bidderId") Long bidderId);

    @Query("SELECT COALESCE(SUM(b.bidAmount),0) FROM Bid b WHERE b.bidder.id = :bidderId AND b.isWinning = true AND b.isPaid = :paid")
    java.lang.Double sumWinningByBidderAndPaid(@Param("bidderId") Long bidderId, @Param("paid") boolean paid);

    @Query("SELECT COALESCE(SUM(b.bidAmount),0) FROM Bid b WHERE b.isWinning = true AND b.isPaid = :paid")
    java.lang.Double sumAllWinningByPaid(@Param("paid") boolean paid);
}
