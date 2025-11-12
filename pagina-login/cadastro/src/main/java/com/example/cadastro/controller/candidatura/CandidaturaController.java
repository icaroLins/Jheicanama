package com.example.cadastro.controller.candidatura;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Objects;


import com.example.cadastro.model.Candidate;
import com.example.cadastro.model.Contractor;
import com.example.cadastro.model.candidatura.Candidatura;
import com.example.cadastro.repository.ContractorRepository;
import com.example.cadastro.repository.UserRepository;
import com.example.cadastro.security.JwtUtil;

import com.example.cadastro.service.candidatura.CandidaturaService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/vagas")
public class CandidaturaController {

    private UserRepository userRepository;
    private CandidaturaService candidaturaService;
    private JwtUtil jwtUtil;
    private ContractorRepository contractorRepository;

    public CandidaturaController(
            CandidaturaService candidaturaService,
            UserRepository userRepository,
            JwtUtil jwtUtil,
            ContractorRepository contractorRepository) {
        this.candidaturaService = candidaturaService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.contractorRepository = contractorRepository;
    }

    @PostMapping("/{vagaId}/candidatar")
    public ResponseEntity<?> candidatar(@PathVariable Long vagaId, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromHeader(request);
            String cpf = jwtUtil.extractIdentifier(token);

            Candidate candidate = userRepository.findByCpf(cpf);

            if (candidate == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Candidato não encontrado");
            }

            Candidatura candidatura = candidaturaService.candidatar(candidate.getId(), vagaId);
            return ResponseEntity.ok(candidatura);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{vagaId}/candidaturas")
    public ResponseEntity<?> listarPorVagas(@PathVariable Long vagaId) {
        try {
            return ResponseEntity.ok(candidaturaService.listarPorVagas(vagaId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{vagaId}/candidato/{candidatoId}/status")
    public ResponseEntity<?> aceitarCandidato(@PathVariable Long vagaId,
            @PathVariable Long candidatoId,
            HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("Erro", "Token JWT ausente ou inválido"));
            }

            String token = authHeader.substring(7);

            String email = jwtUtil.extractIdentifier(token);
            Contractor contractor = contractorRepository.findByEmail(email);

            Candidatura candidatura = candidaturaService.aceitarCandidatura(candidatoId, contractor.getId());
            return ResponseEntity.ok(candidatura);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("Erro", e.getMessage()));
        }
    }

    @PostMapping("/{vagaId}/candidato/{candidatoId}/recusar")
    public ResponseEntity<?> recusarCandidato(@PathVariable Long vagaId,
            @PathVariable Long candidatoId,
            HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("Erro", "Token JWT ausente ou inválido"));
            }

            String token = authHeader.substring(7);

            String email = jwtUtil.extractIdentifier(token);
            Contractor contractor = contractorRepository.findByEmail(email);

            Candidatura candidatura = candidaturaService.recusarCandidatura(candidatoId, contractor.getId());
            return ResponseEntity.ok(candidatura);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("Erro", e.getMessage()));
        }
    }

    @GetMapping("/{candidateId}/candidature")
    public ResponseEntity<?> listarCandidaturas(@PathVariable Long candidateId,
            HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromHeader(request);
            Long userId = jwtUtil.extractUserId(token);
            System.out.println("Debug: userId do token: " + userId + ", candidateId da rota: " + candidateId);
            if (!Objects.equals(userId, candidateId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("Erro", "Você não tem permissão para acessar essas candidaturas"));
            }
            List<Candidatura> lista = candidaturaService.getCandidaturasDoCandidato(candidateId);
            return ResponseEntity.ok(lista);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("Erro", e.getMessage()));
        }
    }
}
