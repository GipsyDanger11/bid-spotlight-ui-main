package com.example.demo.service;

import com.example.demo.dto.BidDTO;
import com.example.demo.entity.Auction;
import com.example.demo.entity.Bid;
import com.example.demo.entity.User;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private UserService userService;

    public Bid placeBid(BidDTO bidDTO) {
        Auction auction = auctionRepository.findById(bidDTO.getAuctionId()).orElse(null);
        User bidder = userRepository.findById(bidDTO.getBidderId()).orElse(null);

        if (auction == null || bidder == null) {
            return null;
        }

        // Only customers in ACTIVE status are allowed to place bids
        if (bidder.getRole() != User.UserRole.CUSTOMER || bidder.getStatus() != User.UserStatus.ACTIVE) {
            return null;
        }

        // Check if auction is active
        if (auction.getStatus() != Auction.AuctionStatus.ACTIVE) {
            return null;
        }

        // Check if bid amount is higher than current bid
        if (auction.getCurrentBid() != null && bidDTO.getBidAmount().compareTo(auction.getCurrentBid()) <= 0) {
            return null;
        }

        // Check if bid amount is higher than starting bid
        if (bidDTO.getBidAmount().compareTo(auction.getStartingBid()) < 0) {
            return null;
        }

        // Create new bid
        Bid bid = new Bid();
        bid.setBidAmount(bidDTO.getBidAmount());
        bid.setAuction(auction);
        bid.setBidder(bidder);
        bid.setIsWinning(true);

        // Mark previous highest bid as not winning
        Bid previousHighestBid = bidRepository.findHighestBidByAuctionId(auction.getId());
        if (previousHighestBid != null) {
            previousHighestBid.setIsWinning(false);
            bidRepository.save(previousHighestBid);
        }

        // Update auction current bid
        auctionService.updateCurrentBid(auction.getId(), bidDTO.getBidAmount());

        // Increment bidder's total bids
        userService.incrementTotalBids(bidder.getId());

        return bidRepository.save(bid);
    }

    public List<Bid> getBidsByAuction(Long auctionId) {
        return bidRepository.findByAuctionIdOrderByBidAmountDesc(auctionId);
    }

    public List<Bid> getBidsByBidder(Long bidderId) {
        return bidRepository.findByBidderId(bidderId);
    }

    public Bid getHighestBid(Long auctionId) {
        return bidRepository.findHighestBidByAuctionId(auctionId);
    }

    public Long countActiveAuctionsByBidder(Long bidderId) {
        return bidRepository.countActiveAuctionsByBidder(bidderId);
    }

    public List<Bid> getRecentBids() {
        return bidRepository.findTop10ByOrderByBidTimeDesc();
    }
}
