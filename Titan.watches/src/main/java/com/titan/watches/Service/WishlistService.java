package com.titan.watches.Service;

import com.titan.watches.Model.Wishlist;
import com.titan.watches.Repository.UserRepository;
import com.titan.watches.Repository.WatchRepository;
import com.titan.watches.Repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private UserRepository userRepository;

    public Wishlist getWishlistByUserId(String userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> createWishlistForUser(userId));
    }

    public Wishlist addWatchToWishlist(String userId, String watchId) {
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        watchRepository.findById(watchId).orElseThrow(() -> new RuntimeException("Watch not found with ID: " + watchId));

        Wishlist wishlist = getWishlistByUserId(userId);

        wishlist.getWatchIds().add(watchId);

        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeWatchFromWishlist(String userId, String watchId) {
        Wishlist wishlist = getWishlistByUserId(userId);
        if (wishlist.getWatchIds() != null) {
            wishlist.getWatchIds().remove(watchId);
        }
        return wishlistRepository.save(wishlist);
    }

    private Wishlist createWishlistForUser(String userId) {
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Cannot create wishlist. User not found with ID: " + userId));
        Wishlist newWishlist = new Wishlist();
        newWishlist.setUserId(userId);
        newWishlist.setWatchIds(new HashSet<>());
        return wishlistRepository.save(newWishlist);
    }
}

