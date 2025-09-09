package com.titan.watches.Controller;

import com.titan.watches.Model.Cart;
import com.titan.watches.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Cart> addItemToCart(@PathVariable String userId, @RequestBody Map<String, String> payload) {
        String watchId = payload.get("watchId");
        int quantity = Integer.parseInt(payload.getOrDefault("quantity", "1"));

        if (watchId == null || quantity <= 0) {
            return ResponseEntity.badRequest().build(); // Or return a more descriptive error
        }
        Cart updatedCart = cartService.addItemToCart(userId, watchId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/{userId}/remove/{watchId}")
    public ResponseEntity<Cart> removeItemFromCart(@PathVariable String userId, @PathVariable String watchId) {
        Cart updatedCart = cartService.removeItemFromCart(userId, watchId);
        return ResponseEntity.ok(updatedCart);
    }
}

