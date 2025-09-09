package com.titan.watches.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;

@Data
@Document(collection = "wishlists")
public class Wishlist {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private Set<String> watchIds = new HashSet<>();
}