package com.ssafy.buddy.location.repository;

import com.ssafy.buddy.location.domain.FifthBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FifthBusRepository extends JpaRepository<FifthBus, Long> {
    @Query(value = "SELECT * FROM fifth_bus ORDER BY fifth_bus_id DESC LIMIT 1", nativeQuery = true)
    Optional<FifthBus> findFifthBusLastLocation();
}
