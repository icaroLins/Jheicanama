
package com.example.cadastro.service.job;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.cadastro.model.job.JobVacancies;
import com.example.cadastro.repository.job.JobRepository;

@Service
public class JobService {
    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository){
        this.jobRepository = jobRepository;
    }

    public JobVacancies createJob(JobVacancies job){
        return jobRepository.save(job);
    }

    public List<JobVacancies> getJobByContractor(long contractorId){
        return jobRepository.findByContractor_Id(contractorId);
    }

    public List<JobVacancies> getJobByCandidate(){
        return jobRepository.findAll();
    }

    public void deleteJob(Long id){
        jobRepository.deleteById(id);
    }

    public JobVacancies edidVaga(Long id, Long contractorId, JobVacancies vagaAtualizada ){
        Optional<JobVacancies> vagaOptional =  jobRepository.findById(id);

        if(vagaOptional.isEmpty()){
            throw new RuntimeException("Vaga não encontrada!");
        }

        JobVacancies vaga = vagaOptional.get();

        if(!vaga.getContractor().getId().equals(contractorId)){
            throw new RuntimeException("Você não tem permissão para editar essa vaga!");
        }

        vaga.setTitle(vagaAtualizada.getTitle());
        vaga.setDescription(vagaAtualizada.getDescription());
        vaga.setWage(vagaAtualizada.getWage());
        vaga.setArea(vagaAtualizada.getArea());

        return jobRepository.save(vaga);
    }
}
