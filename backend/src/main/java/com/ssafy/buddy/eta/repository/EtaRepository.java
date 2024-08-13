package com.ssafy.buddy.eta.repository;

import com.ssafy.buddy.eta.domain.EtaLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EtaRepository extends JpaRepository<EtaLog, Long> {

}
