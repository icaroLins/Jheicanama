package com.example.cadastro.controller;


import com.example.cadastro.model.User;
import com.example.cadastro.repository.UserRepository;
import com.example.cadastro.service.UserService;
import com.example.cadastro.security.JwtUtil;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
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
    private  UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody User usuario){
        try{
            User novo = userService.register(usuario);
            return ResponseEntity.ok(novo);
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String senha) {
        boolean valido = userService.validarLogin(email, senha);
        
        if (valido) {
            User user = userService.searchByEmail(email);
            String token = jwtUtil.generateToken(user.getCpf());
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<?> searchByCpf(@PathVariable String cpf){
        User user = userService.searchByCPF(cpf);
        if(user != null){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserData(@RequestHeader("Authorization") String token){
        if(token.startsWith("Bearer ")){
            token = token.substring(7);
        }
        if(!jwtUtil.validateToken(token)){
            return ResponseEntity.status(401).body("Token inválido ou expirado");
        }
        String cpf = jwtUtil.extractCpf(token);
        User user = userService.searchByCPF(cpf);

        return ResponseEntity.ok(user);
    }
    
}
