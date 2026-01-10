package org.sdia.commandeservice.controllers;

import org.sdia.commandeservice.dto.CommandeDTO;
import org.sdia.commandeservice.entities.Commande;
import org.sdia.commandeservice.service.CommandeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {

    private static final Logger logger = LoggerFactory.getLogger(CommandeController.class);
    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT',('ADMIN'))")

    public ResponseEntity<?> creerCommande(@RequestBody CommandeDTO dto, Authentication authentication) {
        try {
            // Calcul automatique du montantTotal et dateCommande côté backend
            dto.setDateCommande(LocalDateTime.now());
            dto.setStatut("EN_COURS"); // ou autre statut par défaut
            double montantTotal = dto.getLignes().stream()
                    .mapToDouble(l -> l.getPrix() * l.getQuantite())
                    .sum();
            dto.setMontantTotal(montantTotal);

            Commande commande = commandeService.creerCommande(authentication.getName(), dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(commande);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erreur lors de la création de la commande", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur serveur");
        }
    }



    @GetMapping("/mes-commandes")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Commande>> mesCommandes(Authentication authentication) {
        logger.info("Consultation commandes par: {}", authentication.getName());
        String userId = authentication.getName();
        List<Commande> commandes = commandeService.getCommandesByUser(userId);
        return ResponseEntity.ok(commandes);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Commande>> toutesLesCommandes(Authentication authentication) {
        logger.info("Consultation toutes commandes par ADMIN: {}", authentication.getName());
        List<Commande> commandes = commandeService.getAllCommandes();
        return ResponseEntity.ok(commandes);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT','ADMIN')")
    public ResponseEntity<Commande> getCommande(@PathVariable Long id, Authentication authentication) {
        Commande commande = commandeService.getCommandeById(id, authentication.getName());
        return ResponseEntity.ok(commande);
    }
}