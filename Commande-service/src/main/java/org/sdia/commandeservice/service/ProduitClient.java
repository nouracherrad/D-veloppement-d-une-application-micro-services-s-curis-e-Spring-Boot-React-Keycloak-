package org.sdia.commandeservice.service;

import org.sdia.commandeservice.dto.ProduitDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ProduitClient {

    private static final Logger logger = LoggerFactory.getLogger(ProduitClient.class);
    private final WebClient webClient;

    public ProduitClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8081").build();
    }

    public ProduitDTO getProduitById(Long id, String jwtToken) {
        logger.info("Appel au service Produit pour l'ID: {}", id);

        try {
            return webClient.get()
                    .uri("/api/produits/{id}", id)
                    .headers(headers -> headers.setBearerAuth(jwtToken))
                    .retrieve()
                    .bodyToMono(ProduitDTO.class)
                    .block();
        } catch (Exception e) {
            logger.error("Erreur lors de l'appel au service Produit: {}", e.getMessage());
            throw new RuntimeException("Impossible de récupérer le produit: " + e.getMessage());
        }
    }
}