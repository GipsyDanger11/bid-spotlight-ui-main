package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());
        user.setRole(userDTO.getRole());
        user.setStatus(userDTO.getStatus() != null ? userDTO.getStatus() : User.UserStatus.ACTIVE);
        user.setJoinDate(java.time.LocalDateTime.now());
        user.setTotalBids(0);
        user.setTotalSales(0);
        user.setWalletBalance(new java.math.BigDecimal("10000"));
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setEmail(userDTO.getEmail());
            user.setName(userDTO.getName());
            user.setRole(userDTO.getRole());
            user.setStatus(userDTO.getStatus());
            user.setTotalBids(userDTO.getTotalBids());
            user.setTotalSales(userDTO.getTotalSales());
            return userRepository.save(user);
        }
        return null;
    }

    public User suspendUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setStatus(User.UserStatus.SUSPENDED);
            return userRepository.save(user);
        }
        return null;
    }

    public User activateUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setStatus(User.UserStatus.ACTIVE);
            return userRepository.save(user);
        }
        return null;
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByNameOrEmailContaining(query);
    }

    public List<User> getUsersByRole(String role) {
        try {
            User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
            return userRepository.findByRole(userRole);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    public void incrementTotalBids(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setTotalBids(user.getTotalBids() + 1);
            userRepository.save(user);
        }
    }

    public void incrementTotalSales(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setTotalSales(user.getTotalSales() + 1);
            userRepository.save(user);
        }
    }
}
