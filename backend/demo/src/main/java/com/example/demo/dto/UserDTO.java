package com.example.demo.dto;

import com.example.demo.entity.User;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String password;
    private String name;
    private User.UserRole role;
    private User.UserStatus status;
    private LocalDateTime joinDate;
    private Integer totalBids;
    private Integer totalSales;
    private java.math.BigDecimal walletBalance;
    
    public static UserDTO fromEntity(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setJoinDate(user.getJoinDate());
        dto.setTotalBids(user.getTotalBids());
        dto.setTotalSales(user.getTotalSales());
        dto.setWalletBalance(user.getWalletBalance());
        return dto;
    }
}
