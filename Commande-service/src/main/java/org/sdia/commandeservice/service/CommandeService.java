package org.sdia.commandeservice.service;

import org.sdia.commandeservice.dto.CommandeDTO;
import org.sdia.commandeservice.dto.LigneCommandeDTO;
import org.sdia.commandeservice.dto.ProduitDTO;
import org.sdia.commandeservice.entities.Commande;
import org.sdia.commandeservice.entities.LigneCommande;
import org.sdia.commandeservice.repositories.CommandeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommandeService {

    private static final Logger logger = LoggerFactory.getLogger(CommandeService.class);
    private final CommandeRepository commandeRepository;
    private final ProduitClient produitClient;

    public CommandeService(CommandeRepository commandeRepository, ProduitClient produitClient) {
        this.commandeRepository = commandeRepository;
        this.produitClient = produitClient;
    }

    public Commande creerCommande(String username, CommandeDTO dto) {
        if (dto.getLignes() == null || dto.getLignes().isEmpty()) {
            throw new IllegalArgumentException("La commande doit contenir au moins un produit");
        }
        // Ici tu transformes dto en entité Commande et LigneCommande
        Commande commande = new Commande();
        commande.setUserId(username);
        commande.setDateCommande(LocalDate.from(dto.getDateCommande()));
        commande.setMontantTotal(dto.getMontantTotal());
        commande.setStatut(dto.getStatut());

        List<LigneCommande> lignes = dto.getLignes().stream()
                .map(l -> new LigneCommande(null, l.getIdProduit(), l.getQuantite(), l.getPrix()))
                .collect(Collectors.toList());

        commande.setLignes(lignes);

        // Sauvegarde dans la BDD
        return commandeRepository.save(commande);
    }


    public List<Commande> getCommandesByUser(String userId) {
        return commandeRepository.findByUserId(userId);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public Commande getCommandeById(Long id, String userId) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable"));

        // Vérifier que l'utilisateur a le droit de voir cette commande
        if (!commande.getUserId().equals(userId) && !isAdmin()) {
            throw new RuntimeException("Accès non autorisé à cette commande");
        }

        return commande;
    }

    private String getJwtToken() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Jwt) {
            return ((Jwt) principal).getTokenValue();
        }
        throw new RuntimeException("Token JWT non disponible");
    }

    private boolean isAdmin() {
        return SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }
}