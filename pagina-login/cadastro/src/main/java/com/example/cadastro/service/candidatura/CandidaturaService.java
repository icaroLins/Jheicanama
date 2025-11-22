package com.example.cadastro.service.candidatura;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.cadastro.enum_Candidatura.StatusCandidatura;
import com.example.cadastro.model.Candidate;
import com.example.cadastro.model.applicationDTO.ApplicationDTO;
import com.example.cadastro.model.candidatura.Candidatura;
import com.example.cadastro.model.job.JobVacancies;
import com.example.cadastro.repository.UserRepository;
import com.example.cadastro.repository.candidatura.CandidatureRepository;
import com.example.cadastro.repository.job.JobRepository;

@Service
public class CandidaturaService {

    private final CandidatureRepository candidaturaRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public CandidaturaService(CandidatureRepository candidaturaRepository, UserRepository userRepository,
            JobRepository jobRepository) {
        this.candidaturaRepository = candidaturaRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Candidatura candidatar(Long userId, Long vagaId) {
        Candidate user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        JobVacancies vagas = jobRepository.findById(vagaId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada"));

        Candidatura candidatura = new Candidatura();
        candidatura.setUser(user);
        candidatura.setVagas(vagas);

        return candidaturaRepository.save(candidatura);
    }

    public List<Candidatura> listarPorVagas(Long vagaId) {
        JobVacancies vagas = jobRepository.findById(vagaId)
                .orElseThrow(() -> new RuntimeException("vaga não encontrada"));

        return candidaturaRepository.findByVagas(vagas);
    }

    public Candidatura aceitarCandidatura(Long candidaturaId, Long contractorId) {
        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
                .orElseThrow(() -> new RuntimeException("Candidatura não encontrada"));

        JobVacancies vaga = candidatura.getVagas();

        if (!vaga.getContractor().getId().equals(contractorId)) {
            throw new RuntimeException("Você não pode aceitar candidatos nessa vaga!");
        }

        candidatura.setStatus(StatusCandidatura.ACEITO);
        candidaturaRepository.save(candidatura);

        return candidatura;
    }

    public Candidatura recusarCandidatura(Long candidaturaId, Long contractorId){
        Candidatura candidatura = candidaturaRepository.findById(candidaturaId)
                .orElseThrow(()-> new RuntimeException("Candidatura não encontrada"));
            
        JobVacancies vaga = candidatura.getVagas();

        if(!vaga.getContractor().getId().equals(contractorId)){
            throw new RuntimeException("Você não pode recusar candidatos nessa vaga!");
        }

        candidatura.setStatus(StatusCandidatura.RECUSADO);
        candidaturaRepository.save(candidatura);

        return candidatura;
    }

    public List<Candidatura> getCandidaturasDoCandidato(Long candidateId) {
        Candidate candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado"));

        return candidaturaRepository.findByUser(candidate);
    }

    public void deletCandidatura(){
        candidaturaRepository.deleteAll();
    }

}
