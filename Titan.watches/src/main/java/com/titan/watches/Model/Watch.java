package com.titan.watches.Model;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "watches")
public class Watch {

    @Id
    private String mongoId;

    private int id;
    private String gender;
    private String brand;
    private String name;
    private double price;
    private double rating;
    private int reviews;
    private String imageUrl;

    @JsonProperty("isBestSeller")
    private boolean isBestSeller;

    private String modelNumber;
    private String description;
    private List<String> features;
    private List<String> productImages;

}