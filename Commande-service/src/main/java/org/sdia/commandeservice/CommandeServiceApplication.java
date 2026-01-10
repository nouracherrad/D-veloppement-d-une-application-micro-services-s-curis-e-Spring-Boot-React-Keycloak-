package org.sdia.commandeservice;

import org.sdia.commandeservice.entities.Commande;
import org.sdia.commandeservice.entities.LigneCommande;
import org.sdia.commandeservice.repositories.CommandeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;

@SpringBootApplication
public class CommandeServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommandeServiceApplication.class, args);
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    // 🔹 Crée quelques commandes test au démarrage
    @Bean
    CommandLineRunner initData(CommandeRepository commandeRepository) {
        return args -> {
            // Commande 1
            // Commande 1
            Commande c1 = new Commande();
            c1.setClientId(1L);
            c1.setDateCommande(LocalDate.now());
            c1.setStatut("EN_COURS");
            c1.setMontantTotal(300);
            c1.getLignes().add(new LigneCommande(101L, 2, 100)); // ✅ 3 paramètres
            c1.getLignes().add(new LigneCommande(102L, 1, 100));

// Commande 2
            Commande c2 = new Commande();
            c2.setClientId(2L);
            c2.setDateCommande(LocalDate.now());
            c2.setStatut("VALIDEE");
            c2.setMontantTotal(450);
            c2.getLignes().add(new LigneCommande(103L, 3, 150)); // ✅ 3 paramètres
            commandeRepository.save(c1);
            commandeRepository.save(c2);

            System.out.println("✅ Commandes test créées !");
        };
    }
}
