package com.unt.campusxchange.users.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JWTConfigProperties {
    private RSAPublicKey publicKey;
    private RSAPrivateKey privateKey;
}
