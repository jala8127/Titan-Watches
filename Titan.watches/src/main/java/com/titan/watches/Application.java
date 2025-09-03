package com.titan.watches;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.watches.Model.Watch;
import com.titan.watches.Repository.WatchRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.util.List;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	CommandLineRunner runner(WatchRepository repository) {
		return args -> {
			ObjectMapper mapper = new ObjectMapper();

			TypeReference<List<Watch>> typeReference = new TypeReference<>(){};

			InputStream inputStream = new ClassPathResource("data/watch.json").getInputStream();

			try {
				List<Watch> watches = mapper.readValue(inputStream, typeReference);

				repository.deleteAll();

				repository.saveAll(watches);

				System.out.println("Loaded " + watches.size() + " watches into the database!");
			} catch (Exception e) {
				System.out.println("Unable to load watches: " + e.getMessage());
			}
		};
	}
}