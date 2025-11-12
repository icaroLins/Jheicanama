package com.example.cadastro.model.candidatura;

import java.io.ObjectInputFilter.Status;
import java.time.LocalDateTime;

import com.example.cadastro.enum_Candidatura.StatusCandidatura;
import com.example.cadastro.model.Candidate;
import com.example.cadastro.model.job.JobVacancies;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "candidaturas", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"candidate_id", "vaga_id"})
})
public class Candidatura {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable=false)
    private Candidate user;
    
    @ManyToOne
    @JoinColumn(name = "job_vancancy_id", nullable= false)
    private JobVacancies vagas;

    private LocalDateTime dataCandidatura = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private  StatusCandidatura status = StatusCandidatura.PENDENTE;
    public Long getId() {
        return id;
    }

    
    public Candidate getUser() {
        return user;
    }
    public void setUser(Candidate user) {
        this.user = user;
    }


    public JobVacancies getVagas() {
        return vagas;
    }
    public void setVagas(JobVacancies vagas) {
        this.vagas = vagas;
    }


    public LocalDateTime getDataCandidatura() {
        return dataCandidatura;
    }
    public void setDataCandidatura(LocalDateTime dataCandidatura) {
        this.dataCandidatura = dataCandidatura;
    }


    public StatusCandidatura getStatus() {
        return status;
    }
    public void setStatus(StatusCandidatura status) {
        this.status = status;
    }
}
