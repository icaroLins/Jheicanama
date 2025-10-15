
package com.example.cadastro.service.job;

import java.util.List;

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

    public void deleteJob(Long id){
        jobRepository.deleteById(id);
    }
}
