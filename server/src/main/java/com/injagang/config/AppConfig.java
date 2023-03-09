package com.injagang.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Base64;

@Data
@ConfigurationProperties(prefix = "jwt")
public class AppConfig {

    public byte[] jwtKey;

    public byte[] getJwtKey() {
        return jwtKey;
    }

    public void setJwtKey(String jwtKey) {
        this.jwtKey = Base64.getDecoder().decode(jwtKey);
    }
}
