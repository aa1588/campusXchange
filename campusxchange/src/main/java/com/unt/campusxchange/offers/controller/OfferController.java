package com.unt.campusxchange.offers.controller;

import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.offers.dto.OfferDTO;
import com.unt.campusxchange.offers.service.OfferService;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
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
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

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

    @PutMapping("/{offerId}/update")
    public ResponseEntity<OfferDTO> updateOffer(
            @PathVariable Integer offerId, @RequestBody OfferDTO offerDTO, Principal principal) {
        try {
            String currentUsername = principal.getName(); // Get the email of the logged-in user
            OfferDTO updatedOffer = offerService.updateOffer(currentUsername, offerId, offerDTO);
            return ResponseEntity.ok(updatedOffer);
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

    @GetMapping("/allitemsoffer")
    public ResponseEntity<List<OfferDTO>> getAllMyItemsOffers(Principal principal) {
        String email = principal.getName();

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        List<Item> items = itemRepository.findByUser(user);

        List<OfferDTO> offers = offerService.listOffersForListOfItems(items);

        return ResponseEntity.ok(offers);
    }
}
