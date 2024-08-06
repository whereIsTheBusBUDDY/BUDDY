package com.ssafy.buddy.location.repository;

import com.ssafy.buddy.location.domain.SecondBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SecondBusRepository extends JpaRepository<SecondBus, Long> {
    @Query(value = "SELECT * FROM second_bus ORDER BY second_bus_id DESC LIMIT 1", nativeQuery = true)
    Optional<SecondBus> findSecondBusLastLocation();
}
