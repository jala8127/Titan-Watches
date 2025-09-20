package com.product.service.Repository;

import com.product.service.Model.Watch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchRepository extends MongoRepository<Watch, String> {
}
