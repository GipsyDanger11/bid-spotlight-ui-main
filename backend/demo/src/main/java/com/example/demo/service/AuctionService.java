package com.example.demo.service;

import com.example.demo.dto.AuctionDTO;
import com.example.demo.entity.Auction;
import com.example.demo.entity.User;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BidRepository bidRepository;

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public List<Auction> getActiveAuctions() {
        return auctionRepository.findActiveAuctions(LocalDateTime.now());
    }

    public List<Auction> getPendingAuctions() {
        return auctionRepository.findPendingAuctions();
    }

    public List<Auction> getAuctionsBySeller(Long sellerId) {
        return auctionRepository.findBySellerId(sellerId);
    }

    public Auction getAuctionById(Long id) {
        return auctionRepository.findById(id).orElse(null);
    }

    public Auction createAuction(AuctionDTO auctionDTO) {
        Auction auction = new Auction();
        auction.setName(auctionDTO.getName());
        auction.setDescription(auctionDTO.getDescription());
        auction.setStartingBid(auctionDTO.getStartingBid());
        auction.setCurrentBid(auctionDTO.getStartingBid());
        auction.setCategory(auctionDTO.getCategory());
        auction.setDurationMinutes(auctionDTO.getDurationMinutes());
        // New listings require admin approval before going live
        auction.setStatus(Auction.AuctionStatus.PENDING);
        auction.setViews(0);
        auction.setBidCount(0);
        auction.setImageUrl(auctionDTO.getImageUrl());

        User seller = userRepository.findById(auctionDTO.getSellerId()).orElse(null);
        if (seller != null) {
            auction.setSeller(seller);
        }

        return auctionRepository.save(auction);
    }

    public Auction approveAuction(Long id) {
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction != null && auction.getStatus() == Auction.AuctionStatus.PENDING) {
            auction.setStatus(Auction.AuctionStatus.ACTIVE);
            // Reset timer to start on approval
            auction.setCreatedDate(LocalDateTime.now());
            if (auction.getDurationMinutes() != null) {
                auction.setEndTime(auction.getCreatedDate().plusMinutes(auction.getDurationMinutes()));
            }
            return auctionRepository.save(auction);
        }
        return null;
    }

    public Auction rejectAuction(Long id) {
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction != null && auction.getStatus() == Auction.AuctionStatus.PENDING) {
            auction.setStatus(Auction.AuctionStatus.REJECTED);
            return auctionRepository.save(auction);
        }
        return null;
    }

    public Auction cancelAuction(Long id) {
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction != null && (auction.getStatus() == Auction.AuctionStatus.PENDING || 
                                auction.getStatus() == Auction.AuctionStatus.ACTIVE)) {
            auction.setStatus(Auction.AuctionStatus.CANCELLED);
            return auctionRepository.save(auction);
        }
        return null;
    }

    public Auction completeAuction(Long id) {
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction != null && auction.getStatus() == Auction.AuctionStatus.ACTIVE) {
            auction.setStatus(Auction.AuctionStatus.COMPLETED);
            auctionRepository.save(auction);
            
            // Mark the highest bid as winning
            bidRepository.findTopByAuctionIdOrderByBidAmountDesc(auction.getId())
                .ifPresent(winningBid -> {
                    winningBid.setIsWinning(true);
                    bidRepository.save(winningBid);
                });
            
            return auction;
        }
        return null;
    }

    public void incrementView(Long id) {
        Auction auction = auctionRepository.findById(id).orElse(null);
        if (auction != null) {
            auction.setViews(auction.getViews() + 1);
            auctionRepository.save(auction);
        }
    }

    public List<Auction> searchAuctions(String query) {
        return auctionRepository.findByNameOrDescriptionContaining(query);
    }

    public void updateCurrentBid(Long auctionId, BigDecimal newBidAmount) {
        Auction auction = auctionRepository.findById(auctionId).orElse(null);
        if (auction != null) {
            auction.setCurrentBid(newBidAmount);
            auction.setBidCount(auction.getBidCount() + 1);
            auctionRepository.save(auction);
        }
    }

    public List<Auction> completeExpiredAuctions() {
        // Find all active auctions that have expired
        List<Auction> allActiveAuctions = auctionRepository.findByStatus(Auction.AuctionStatus.ACTIVE);
        List<Auction> completedAuctions = new ArrayList<>();
        
        for (Auction auction : allActiveAuctions) {
            if (auction.getEndTime() != null && auction.getEndTime().isBefore(LocalDateTime.now())) {
                auction.setStatus(Auction.AuctionStatus.COMPLETED);
                auctionRepository.save(auction);
                
                // Mark the highest bid as winning
                bidRepository.findTopByAuctionIdOrderByBidAmountDesc(auction.getId())
                    .ifPresent(winningBid -> {
                        winningBid.setIsWinning(true);
                        bidRepository.save(winningBid);
                    });
                
                completedAuctions.add(auction);
            }
        }
        
        return completedAuctions;
    }

    public List<Auction> getCompletedAuctions() {
        return auctionRepository.findByStatus(Auction.AuctionStatus.COMPLETED);
    }

    public List<Auction> getWonAuctionsByUser(Long userId) {
        return auctionRepository.findWonAuctionsByUser(userId);
    }
}
