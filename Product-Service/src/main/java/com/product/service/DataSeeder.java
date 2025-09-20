package com.product.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.product.service.Model.Watch;
import com.product.service.Repository.WatchRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final WatchRepository watchRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(WatchRepository watchRepository, ObjectMapper objectMapper) {
        this.watchRepository = watchRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if the database already has data
        if (watchRepository.count() == 0) {
            System.out.println("No watch data found. Seeding database...");
            try {
                // Find and read the JSON file from the resources folder
                InputStream inputStream = getClass().getResourceAsStream("/watch.json");
                if (inputStream == null) {
                    throw new RuntimeException("Cannot find watch.json in resources!");
                }
                // Use Jackson's ObjectMapper to convert the JSON into a List of Watch objects
                List<Watch> watches = objectMapper.readValue(inputStream, new TypeReference<List<Watch>>() {});

                // Save all the watch objects to the MongoDB database
                watchRepository.saveAll(watches);
                System.out.println(watches.size() + " watches have been successfully seeded into the database.");
            } catch (Exception e) {
                System.err.println("Error seeding watch data: " + e.getMessage());
            }
        } else {
            System.out.println("Watch data already exists in the database. No seeding needed.");
        }
    }
}
