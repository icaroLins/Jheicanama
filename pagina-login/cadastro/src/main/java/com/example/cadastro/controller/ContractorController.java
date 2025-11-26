package com.example.cadastro.controller;

import java.io.File;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.cadastro.model.Contractor;
import com.example.cadastro.security.JwtUtil;
import com.example.cadastro.service.ContractorService;

@RestController
@RequestMapping("/contratantes")
@CrossOrigin(origins = {"https://icarolins.github.io","http://127.0.0.1:5500","http://localhost:5500"})
public class ContractorController {

    @Autowired
    private ContractorService contractorService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody Contractor user) {
        try {
            Contractor novo = contractorService.register(user);
            return ResponseEntity.ok(novo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String identificador = loginRequest.getIdentificador();
        String senha = loginRequest.getSenha();

        boolean valido = contractorService.validarlogin(identificador, senha);

        if (valido) {
            Contractor user = identificador.matches("\\d+") ? contractorService.searchByCnpj(identificador)
                    : contractorService.searchByEmail(identificador);
            String token = jwtUtil.generateToken(user.getEmail(), user.getId());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "tipo", "contractor"));

        }

        return ResponseEntity.status(401).body("Email/Cnpj ou senha incorreta");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserData(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }

        String email = jwtUtil.extractIdentifier(token);
        Contractor user = contractorService.searchByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Usuário não encontrado"));
        }

        return ResponseEntity.ok(user);
    }

    @PostMapping("/upload_foto")
    public ResponseEntity<?> uploadFoto(@RequestHeader("Authorization") String token,
            @RequestParam("foto") MultipartFile foto) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token invalido ou expirado!");
        }

        String email = jwtUtil.extractIdentifier(token);
        Contractor user = contractorService.searchByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("Usuario não encontrado!");
        }

        try {
            // 1. Gerar um nome único para a foto
            String nomeArquivo = System.currentTimeMillis() + "_" + foto.getOriginalFilename();

            // 2. Caminho onde vai salvar no servidor
            String diretorioBase = System.getProperty("user.dir") + File.separator + "uploads";

            // 3. Salvar no disco
            java.nio.file.Path pastaUploads = java.nio.file.Paths.get(diretorioBase);
            java.nio.file.Files.createDirectories(pastaUploads);

            // 4. Salvar caminho/URL no banco
            java.nio.file.Path caminhoArquivo = pastaUploads.resolve(nomeArquivo);

            foto.transferTo(caminhoArquivo.toFile());

            user.setFotoPerfilUrl("/uploads/" + nomeArquivo);
            contractorService.save(user);

            return ResponseEntity.ok("Foto enviada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao salvar foto: " + e.getMessage());
        }
    }

    @GetMapping("/vaga")
    public ResponseEntity<?> pushFoto(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token invalido ou expirado!");
        }

        String email = jwtUtil.extractIdentifier(token);
        Contractor user = contractorService.searchByEmail(email);

        try {
            java.nio.file.Path caminhoArquivo = java.nio.file.Paths.get(user.getFotoPerfilUrl());
            byte[] foto = java.nio.file.Files.readAllBytes(caminhoArquivo);

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                    .body(foto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao ler foto: " + e.getMessage());
        }
    }
}
