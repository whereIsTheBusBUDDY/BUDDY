package com.ssafy.buddy.location.repository;

import com.ssafy.buddy.location.domain.ThirdBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ThirdBusRepository extends JpaRepository<ThirdBus, Long> {
    @Query(value = "SELECT * FROM third_bus ORDER BY third_bus_id DESC LIMIT 1", nativeQuery = true)
    Optional<ThirdBus> findThirdBusLastLocation();
}
