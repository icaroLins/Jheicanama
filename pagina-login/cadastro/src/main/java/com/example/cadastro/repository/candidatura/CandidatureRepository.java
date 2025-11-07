package com.example.cadastro.repository.candidatura;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cadastro.model.Candidate;
import com.example.cadastro.model.candidatura.Candidatura;
import com.example.cadastro.model.job.JobVacancies;


public interface CandidatureRepository extends JpaRepository<Candidatura, Long > {
    
    Optional<Candidatura> findByUserAndVagas(Candidate user, JobVacancies vagas);

    List<Candidatura> findByVagas(JobVacancies vagas);
}
