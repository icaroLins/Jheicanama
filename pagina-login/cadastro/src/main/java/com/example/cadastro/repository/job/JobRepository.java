
package com.example.cadastro.repository.job;

import com.example.cadastro.model.job.JobVacancies;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<JobVacancies, Long>{
    List<JobVacancies> findByContractor_Id(Long contractorId);
}
