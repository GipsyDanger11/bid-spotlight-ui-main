package com.example.demo.config;

import com.example.demo.entity.Auction;
import com.example.demo.entity.Bid;
import com.example.demo.entity.User;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private BidRepository bidRepository;

    @Override
    public void run(String... args) throws Exception {
        // Make seeding idempotent: skip if any users already exist
        if (userRepository.count() > 0) {
            System.out.println("DataSeeder: existing data found, skipping seeding.");
            return;
        }
        // Create admin user
        User admin = new User();
        admin.setEmail("admin@bidlux.com");
        admin.setPassword("admin123");
        admin.setName("Admin User");
        admin.setRole(User.UserRole.ADMIN);
        admin.setStatus(User.UserStatus.ACTIVE);
        admin.setJoinDate(LocalDateTime.now().minusDays(30));
        admin.setTotalBids(0);
        admin.setTotalSales(0);
        admin.setWalletBalance(new BigDecimal("10000"));
        userRepository.save(admin);

        // Create one seller
        User seller = new User();
        seller.setEmail("seller@bidlux.com");
        seller.setPassword("seller123");
        seller.setName("John Smith");
        seller.setRole(User.UserRole.SELLER);
        seller.setStatus(User.UserStatus.ACTIVE);
        seller.setJoinDate(LocalDateTime.now().minusDays(20));
        seller.setTotalBids(15);
        seller.setTotalSales(8);
        seller.setWalletBalance(new BigDecimal("10000"));
        userRepository.save(seller);

        // Create one customer
        User customer = new User();
        customer.setEmail("customer@bidlux.com");
        customer.setPassword("customer123");
        customer.setName("Jane Doe");
        customer.setRole(User.UserRole.CUSTOMER);
        customer.setStatus(User.UserStatus.ACTIVE);
        customer.setJoinDate(LocalDateTime.now().minusDays(10));
        customer.setTotalBids(5);
        customer.setTotalSales(0);
        customer.setWalletBalance(new BigDecimal("10000"));
        userRepository.save(customer);

        // Create one active auction
        Auction auction1 = new Auction();
        auction1.setName("Vintage Gold Watch");
        auction1.setDescription("Beautiful vintage gold watch from the 1960s. Excellent condition with original box and papers.");
        auction1.setStartingBid(new BigDecimal("1000"));
        auction1.setCurrentBid(new BigDecimal("2500"));
        auction1.setCategory("Watches");
        auction1.setDurationMinutes(15);
        auction1.setStatus(Auction.AuctionStatus.ACTIVE);
        auction1.setCreatedDate(LocalDateTime.now().minusMinutes(5));
        auction1.setEndTime(LocalDateTime.now().plusMinutes(10));
        auction1.setViews(234);
        auction1.setBidCount(23);
        auction1.setImageUrl("🕰️");
        auction1.setSeller(seller);
        auctionRepository.save(auction1);

        // Create one pending auction
        Auction pendingAuction = new Auction();
        pendingAuction.setName("Rare Diamond Ring");
        pendingAuction.setDescription("Exquisite diamond ring with 2-carat center stone. 18k white gold setting. Certificate included.");
        pendingAuction.setStartingBid(new BigDecimal("3000"));
        pendingAuction.setCurrentBid(new BigDecimal("3000"));
        pendingAuction.setCategory("Jewelry");
        pendingAuction.setDurationMinutes(30);
        pendingAuction.setStatus(Auction.AuctionStatus.PENDING);
        pendingAuction.setCreatedDate(LocalDateTime.now().minusMinutes(10));
        pendingAuction.setEndTime(LocalDateTime.now().plusMinutes(20));
        pendingAuction.setViews(0);
        pendingAuction.setBidCount(0);
        pendingAuction.setImageUrl("💎");
        pendingAuction.setSeller(seller);
        auctionRepository.save(pendingAuction);

        // Create a test auction that expires quickly for testing won auctions
        Auction testAuction = new Auction();
        testAuction.setName("Test Quick Auction");
        testAuction.setDescription("This auction expires quickly for testing purposes.");
        testAuction.setStartingBid(new BigDecimal("100"));
        testAuction.setCurrentBid(new BigDecimal("150"));
        testAuction.setCategory("Test");
        testAuction.setDurationMinutes(1); // 1 minute duration
        testAuction.setStatus(Auction.AuctionStatus.ACTIVE);
        testAuction.setCreatedDate(LocalDateTime.now().minusSeconds(30)); // Started 30 seconds ago
        testAuction.setEndTime(LocalDateTime.now().plusSeconds(30)); // Expires in 30 seconds
        testAuction.setViews(0);
        testAuction.setBidCount(1);
        testAuction.setImageUrl("🧪");
        testAuction.setSeller(seller);
        auctionRepository.save(testAuction);

        // Create a test bid for the customer
        Bid testBid = new Bid();
        testBid.setBidAmount(new BigDecimal("150"));
        testBid.setBidTime(LocalDateTime.now().minusSeconds(20));
        testBid.setAuction(testAuction);
        testBid.setBidder(customer);
        testBid.setIsWinning(false); // Will be set to true when auction completes
        bidRepository.save(testBid);

        System.out.println("Sample data seeded successfully!");
    }
}
