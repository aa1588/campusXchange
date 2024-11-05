package com.unt.campusxchange.offers.controller;

import com.unt.campusxchange.offers.dto.OfferDTO;
import com.unt.campusxchange.offers.service.OfferService;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @PostMapping("/create/{itemId}")
    public ResponseEntity<OfferDTO> createOffer(
            @PathVariable Integer itemId, @RequestBody OfferDTO offerDTO, Principal principal) {
        try {
            String currentUsername = principal.getName(); // username == email
            OfferDTO offer = offerService.createOffer(currentUsername, itemId, offerDTO);
            return new ResponseEntity<>(offer, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<OfferDTO>> getOffersForItem(@PathVariable Integer itemId, Principal principal) {

        String currentUsername = principal.getName(); // username == email
        List<OfferDTO> offers = offerService.listOffersForItem(currentUsername, itemId);
        return ResponseEntity.ok(offers);
    }

    @PutMapping("/{offerId}/accept")
    public ResponseEntity<OfferDTO> acceptOffer(@PathVariable Integer offerId, Principal principal) {
        String email = principal.getName(); // Get the email from Principal
        System.out.println("email: " + email);
        OfferDTO updatedOffer = offerService.acceptOffer(offerId, email);
        return ResponseEntity.ok(updatedOffer);
    }

    @PutMapping("/{offerId}/decline")
    public ResponseEntity<OfferDTO> declineOffer(@PathVariable Integer offerId, Principal principal) {
        String email = principal.getName(); // Get the email from Principal
        OfferDTO updatedOffer = offerService.declineOffer(offerId, email);
        return ResponseEntity.ok(updatedOffer);
    }
}
