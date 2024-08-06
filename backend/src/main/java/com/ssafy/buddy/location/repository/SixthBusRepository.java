package com.ssafy.buddy.location.repository;

import com.ssafy.buddy.location.domain.SixthBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SixthBusRepository extends JpaRepository<SixthBus, Long> {
    @Query(value = "SELECT * FROM sixth_bus ORDER BY sixth_bus_id DESC LIMIT 1", nativeQuery = true)
    Optional<SixthBus> findSixthBusLastLocation();
}
