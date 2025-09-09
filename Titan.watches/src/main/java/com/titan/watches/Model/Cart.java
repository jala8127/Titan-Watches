package com.titan.watches.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@Document(collection = "carts")
public class Cart {

    @Id
    private String id;
    private String userId;

    private Map<String, Integer> items = new HashMap<>();
}

