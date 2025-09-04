package com.example.cadastro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.cadastro.model.Contractor;
import com.example.cadastro.repository.ContractorRepository;
import com.example.cadastro.security.JwtUtil;

import io.jsonwebtoken.JwtBuilder;

@Service
public class ContractorService {

    @Autowired
    private ContractorRepository contractorRopository;

    @Autowired
    private JwtUtil jwtUtil;

    PasswordEncoder passwordEnconder;

    public Contractor register(Contractor user){
        if(contractorRopository.findByCnpj(user.getCnpj())!=null){
            throw new RuntimeException("Cnpj já cadastrado!");
        }
        if(contractorRopository.findByEmail(user.getEmail())!=null){
            throw new RuntimeException("Email já cadastrado!");
        }

        user.setPassWord(passwordEnconder.encode(user.getPassWord()));
        return contractorRopository.save(user);
    }

    public Contractor searchByEmail(String email){
        return contractorRopository.findByEmail(email);
    }

    public Contractor searchByCnpj(String cnpj){
        return contractorRopository.findByCnpj(cnpj);
    }

    public boolean validarlogin(String email, String senha){
        Contractor user = contractorRopository.findByEmail(email);

        if(user == null){
            return false;
        }

        if(!passwordEnconder.matches(senha, user.getPassWord())){
            return false;
        }

        return true;
    }

    public String gerarToken(Contractor user){
        return jwtUtil.generateToken(user.getCnpj());
    }
}
