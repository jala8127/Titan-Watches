package com.titan.watches.Service;

import com.titan.watches.Model.Cart;
import com.titan.watches.Repository.CartRepository;
import com.titan.watches.Repository.UserRepository;
import com.titan.watches.Repository.WatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WatchRepository watchRepository;

    @Autowired
    private UserRepository userRepository;

    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> createCartForUser(userId));
    }

    public Cart addItemToCart(String userId, String watchId, int quantity) {
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        watchRepository.findById(watchId).orElseThrow(() -> new RuntimeException("Watch not found with ID: " + watchId));

        Cart cart = getCartByUserId(userId);

        cart.getItems().merge(watchId, quantity, Integer::sum);

        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String userId, String watchId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().remove(watchId);
        return cartRepository.save(cart);
    }

    private Cart createCartForUser(String userId) {
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Cannot create cart. User not found with ID: " + userId));
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        return cartRepository.save(newCart);
    }
}

