package com.example.demo.config;

import com.example.demo.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AuctionScheduler {

    @Autowired
    private AuctionService auctionService;

    // Run every 3 seconds to promptly complete expired auctions without overloading DB
    @Scheduled(fixedRate = 3000)
    public void completeExpiredAuctionsJob() {
        auctionService.completeExpiredAuctions();
    }
}


