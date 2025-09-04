package com.example.cadastro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cadastro.model.Contractor;
import com.example.cadastro.security.JwtUtil;
import com.example.cadastro.service.ContractorService;

@RestController
@RequestMapping("/contratantes")
@CrossOrigin(origins="*")
public class ContractorController {
    
    @Autowired
    private ContractorService contractorService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody Contractor user){
        try{
            Contractor novo = contractorService.register(user);
            return ResponseEntity.ok(novo);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String senha){
        boolean valido = contractorService.validarlogin(email, senha);

        if(valido){
            Contractor user = contractorService.searchByEmail(email);
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(401).body("Email/Cnpj ou senha incorreta");
    }
}
