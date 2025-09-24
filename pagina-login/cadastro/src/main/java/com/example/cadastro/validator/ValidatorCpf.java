package com.example.cadastro.validator;

public class ValidatorCpf {
    public static boolean isValid(String cpf){
        int soma, dig1, dig2;
        soma=0;

        cpf = cpf.replaceAll("[^\\d]", "");

        if(cpf.length() != 11){
            return false;
        }

        if(cpf.matches("(\\d)\\1{10}")){
            return false;
        }

        try{
            for(int i=0; i < 9; i++){
                soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }

            int resto = soma % 11;

            if(resto < 2){
                dig1 = 0;
            }else{
                dig1 = 11 - resto; 
            }

            soma = 0;
            for(int i = 0; i < 10; i++){
                soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }

            resto = soma % 11;
            if(resto < 2){
                dig2 = 0;
            }else{
                dig2 = 11 - resto;
            }

             if(dig1 == Character.getNumericValue(cpf.charAt(9)) && dig2 == Character.getNumericValue(cpf.charAt(10))){
                return true;
             }else{
                return false;
             }
        }catch(NumberFormatException e){
            return false;
        }
    }
}
