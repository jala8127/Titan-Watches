package com.titan.watches.Repository;

import com.titan.watches.Model.Watch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchRepository extends MongoRepository<Watch, String> {
}
