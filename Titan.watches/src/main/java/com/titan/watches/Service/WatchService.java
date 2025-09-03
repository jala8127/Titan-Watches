package com.titan.watches.Service;

import com.titan.watches.Model.Watch;
import com.titan.watches.Repository.WatchRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WatchService {

    private final WatchRepository watchRepository;

    public WatchService(WatchRepository watchRepository) {
        this.watchRepository = watchRepository;
    }

    public List<Watch> getAllWatches() {
        return watchRepository.findAll();
    }

    public Optional<Watch> getWatchById(String mongoId) {
        return watchRepository.findById(mongoId);
    }
}
