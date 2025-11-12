package com.example.cadastro.controller.job;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cadastro.model.Contractor;
import com.example.cadastro.model.job.JobVacancies;
import com.example.cadastro.repository.ContractorRepository;
import com.example.cadastro.security.JwtUtil;
import com.example.cadastro.service.ContractorService;
import com.example.cadastro.service.job.JobService;

@RestController
@RequestMapping("/vaga")
@CrossOrigin(origins = "*")
public class JobController {
    private final JobService jobService;
    private final JwtUtil jwtUtil;
    private final ContractorService contractorService;
    private final ContractorRepository contractorRepository;

    public JobController(JobService jobService, JwtUtil jwtUtil, ContractorService contractorService,
            ContractorRepository contractorRepository) {
        this.contractorService = contractorService;
        this.jobService = jobService;
        this.jwtUtil = jwtUtil;
        this.contractorRepository = contractorRepository;
    }

    @PostMapping("/criar")
    public ResponseEntity<?> criarVaga(@RequestHeader("Authorization") String token, @RequestBody JobVacancies job) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token invalido ou expirado!");
        }

        String email = jwtUtil.extractIdentifier(token);
        Contractor contractor = contractorService.searchByEmail(email);

        job.setContractor(contractor);

        JobVacancies novaVaga = jobService.createJob(job);

        return ResponseEntity.ok(novaVaga);

    }

    @GetMapping("/minhas")
    public ResponseEntity<?> listarMinhasVagas(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token invalido ou expirado");
        }

        String email = jwtUtil.extractIdentifier(token);
        Contractor contractor = contractorService.searchByEmail(email);

        List<JobVacancies> vagas = jobService.getJobByContractor(contractor.getId());
        return ResponseEntity.ok(vagas);
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarTodasAsVagas(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        List<JobVacancies> vagas = jobService.getJobByCandidate();
        return ResponseEntity.ok(vagas);
    }

    @PutMapping("/{id}/edid")
    ResponseEntity<?> editarVaga(
            @PathVariable Long id,
            @RequestBody JobVacancies vagaAtualizada,
            @RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");

        String email = jwtUtil.extractIdentifier(token);

        Contractor contractor = contractorRepository.findByEmail(email);
        if (contractor == null) {
            throw new RuntimeException("Contratante não encontrado");
        }
        Long contractorId = contractor.getId();

        JobVacancies vagaEditada = jobService.edidVaga(id, contractorId, vagaAtualizada);
        return ResponseEntity.ok(vagaEditada);

    }

    @DeleteMapping("/{vagaId}/deletar")
    public ResponseEntity<?> deleteVaga(@PathVariable("vagaId") Long vagaId) {
        jobService.deleteJob(vagaId);
        return ResponseEntity.ok("Vaga excluida com sucesso");
    }
}
