package com.product.service.Controller;

import com.product.service.Model.Watch;
import com.product.service.Service.WatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
// @CrossOrigin is removed because the Gateway now handles CORS.
@RequestMapping("/products") // The "/api" prefix is removed.
public class WatchController {

    private final WatchService watchService;

    public WatchController(WatchService watchService) {
        this.watchService = watchService;
    }

    @GetMapping
    public List<Watch> getAllWatches() {
        return watchService.getAllWatches();
    }

    @GetMapping("/{mongoId}")
    public ResponseEntity<Watch> getWatchById(@PathVariable String mongoId) {
        return watchService.getWatchById(mongoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

