package com.ssafy.buddy.location.repository;

import com.ssafy.buddy.location.doamin.FirstBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FirstBusRepository extends JpaRepository<FirstBus, Long> {
    @Query(value = "SELECT * FROM first_bus ORDER BY first_bus_id  DESC LIMIT 1", nativeQuery = true)
    Optional<FirstBus> findFirstBusLastLocation();
}
