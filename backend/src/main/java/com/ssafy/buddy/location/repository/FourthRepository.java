package com.ssafy.buddy.location.repository;

import com.ssafy.buddy.location.domain.FourthBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FourthRepository extends JpaRepository<FourthBus, Long> {
    @Query(value = "SELECT * FROM fourth_bus ORDER BY fourth_bus_id DESC LIMIT 1", nativeQuery = true)
    Optional<FourthBus> findFourthBusLastLocation();
}
