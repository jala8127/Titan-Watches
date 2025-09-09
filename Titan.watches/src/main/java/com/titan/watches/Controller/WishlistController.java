package com.titan.watches.Controller;

import com.titan.watches.Model.Wishlist;
import com.titan.watches.Service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<Wishlist> getWishlist(@PathVariable String userId) {
        Wishlist wishlist = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Wishlist> addWatchToWishlist(@PathVariable String userId, @RequestBody Map<String, String> payload) {
        String watchId = payload.get("watchId");
        if (watchId == null || watchId.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Wishlist updatedWishlist = wishlistService.addWatchToWishlist(userId, watchId);
        return ResponseEntity.ok(updatedWishlist);
    }

    @DeleteMapping("/{userId}/remove/{watchId}")
    public ResponseEntity<Wishlist> removeWatchFromWishlist(@PathVariable String userId, @PathVariable String watchId) {
        Wishlist updatedWishlist = wishlistService.removeWatchFromWishlist(userId, watchId);
        return ResponseEntity.ok(updatedWishlist);
    }
}

