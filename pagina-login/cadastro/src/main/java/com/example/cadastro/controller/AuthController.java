package com.example.cadastro.controller;

import com.example.cadastro.model.Candidate;
import com.example.cadastro.model.Contractor;
import com.example.cadastro.service.UserService;
import com.example.cadastro.security.JwtUtil;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody Candidate usuario) {
        try {
            Candidate novo = userService.register(usuario);
            return ResponseEntity.ok(novo);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean valido = userService.validarLogin(request.getIdentificador(), request.getSenha());
        Candidate user;

        if (valido) {
            if (request.getIdentificador().matches("\\d+")) {
                user = userService.searchByCPF(request.getIdentificador());
            } else {
                user = userService.searchByEmail(request.getIdentificador());
            }
            String token = jwtUtil.generateToken(user.getCpf(), user.getId());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "tipo", "candidate"));
        }
        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<?> searchByCpf(@PathVariable String cpf) {
        cpf = cpf.replaceAll("[^\\d]", "");
        Candidate user = userService.searchByCPF(cpf);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserData(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }
        String cpf = jwtUtil.extractIdentifier(token);
        cpf = cpf.replaceAll("[^\\d]", "");
        Candidate user = userService.searchByCPF(cpf);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/upload_foto")
    public ResponseEntity<?> uploadFoto(@RequestHeader("Authorization") String token,
            @RequestParam("foto") MultipartFile foto) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(403).body("Token invalido ou expirado!");
        }

        String cpf = jwtUtil.extractIdentifier(token);
        Candidate user = userService.searchByCPF(cpf);

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
            userService.save(user);

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

        String cpf = jwtUtil.extractIdentifier(token);
        Candidate user = userService.searchByCPF(cpf);

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
