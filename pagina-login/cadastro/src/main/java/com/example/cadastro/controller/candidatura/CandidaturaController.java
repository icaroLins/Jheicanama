package com.example.cadastro.controller.candidatura;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.example.cadastro.model.candidatura.Candidatura;
import com.example.cadastro.service.candidatura.CandidaturaService;

@RestController
@RequestMapping("/vagas")
public class CandidaturaController {

    private CandidaturaService candidaturaService;

    public CandidaturaController(CandidaturaService candidaturaService) {
        this.candidaturaService = candidaturaService;
    }

    @PostMapping("/{vagaId}/candidatar")
    public ResponseEntity<?> candidatar(@PathVariable Long vagaId, @RequestParam Long userId) {
        try {
            Candidatura candidatura = candidaturaService.candidatar(userId, vagaId);
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

    @PostMapping("/{id}/aceitar")
    public ResponseEntity<?> aceitarCandidato(@PathVariable Long id, @RequestParam Long contractorId) {
        try {
            Candidatura candidatura = candidaturaService.aceitarCandidatura(id, contractorId);
            return ResponseEntity.ok(candidatura);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("Erro", e.getMessage()));
        }
    }
}
