package com.unt.campusxchange.offers.service;

import com.unt.campusxchange.items.entity.Item;
import com.unt.campusxchange.items.exception.ItemNotFoundException;
import com.unt.campusxchange.items.repo.ItemRepository;
import com.unt.campusxchange.offers.dto.ItemDTO;
import com.unt.campusxchange.offers.dto.OfferDTO;
import com.unt.campusxchange.offers.dto.OfferItemDTO;
import com.unt.campusxchange.offers.dto.UserDTO;
import com.unt.campusxchange.offers.entity.Offer;
import com.unt.campusxchange.offers.entity.OfferItem;
import com.unt.campusxchange.offers.entity.OfferStatus;
import com.unt.campusxchange.offers.exception.OfferNotFoundException;
import com.unt.campusxchange.offers.repo.OfferRepository;
import com.unt.campusxchange.users.entity.User;
import com.unt.campusxchange.users.exception.UserNotFoundException;
import com.unt.campusxchange.users.repo.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public OfferDTO createOffer(String email, Integer itemId, OfferDTO offerDTO) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        Item mainItem = itemRepository.findById(itemId).orElseThrow(() -> new ItemNotFoundException("Item not found"));

        Offer offer = new Offer();
        offer.setAmount(offerDTO.amount());
        offer.setOfferedBy(user);
        offer.setItem(mainItem);
        offer.setStatus(OfferStatus.PENDING);

        // Only map offerItems if they are provided in the request
        List<OfferItem> offerItems = offerDTO.offerItems() != null
                ? offerDTO.offerItems().stream()
                        .map(offerItemDTO -> {
                            Item item = itemRepository
                                    .findById(offerItemDTO.itemId())
                                    .orElseThrow(() -> new ItemNotFoundException("Item not found"));
                            OfferItem offerItem = new OfferItem();
                            offerItem.setOffer(offer);
                            offerItem.setItem(item);
                            offerItem.setQuantity(offerItemDTO.quantity());
                            return offerItem;
                        })
                        .collect(Collectors.toList())
                : Collections.emptyList();

        offer.setOfferItems(offerItems);
        Offer savedOffer = offerRepository.save(offer);

        return toOfferDTO(savedOffer);
    }

    private OfferDTO toOfferDTO(Offer offer) {
        List<OfferItemDTO> offerItemDTOs = offer.getOfferItems() != null
                ? offer.getOfferItems().stream()
                        .map(offerItem -> new OfferItemDTO(offerItem.getItem().getId(), offerItem.getQuantity()))
                        .collect(Collectors.toList())
                : Collections.emptyList();

        UserDTO userDTO = new UserDTO(
                offer.getOfferedBy().getId(),
                offer.getOfferedBy().getFirstname(),
                offer.getOfferedBy().getLastname(),
                offer.getOfferedBy().getEmail(),
                offer.getOfferedBy().getPhone());

        ItemDTO itemDTO = new ItemDTO(
                offer.getItem().getId(),
                offer.getItem().getTitle(),
                offer.getItem().getQuantity(),
                offer.getItem().getDescription(),
                offer.getItem().getPrice(),
                offer.getItem().getCategory().toString(),
                offer.getItem().getImageUrls());

        return new OfferDTO(
                offer.getId(),
                offer.getAmount(),
                userDTO,
                itemDTO,
                offer.getStatus(),
                offerItemDTOs,
                offer.getCreatedAt());
    }

    public List<OfferDTO> listOffersForItem(String email, Integer itemId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        // Check if the item exists and if the user is the owner
        Item item = itemRepository.findById(itemId).orElseThrow(() -> new ItemNotFoundException("Item not found"));

        if (!item.getUser().equals(user)) {
            throw new SecurityException("User is not the owner of this item.");
        }

        // Fetch all offers for the item
        List<Offer> offers = offerRepository.findByItem(item);

        // Map offers to DTOs
        return offers.stream().map(this::toOfferDTO).collect(Collectors.toList());
    }

    public OfferDTO acceptOffer(Integer offerId, String email) {
        Offer offer =
                offerRepository.findById(offerId).orElseThrow(() -> new OfferNotFoundException("Offer not found"));

        // Check if the user is the owner of the item
        User itemOwner = offer.getItem().getUser(); // Assuming you have a getOwner() method in Item entity
        if (!itemOwner.getEmail().equals(email)) {
            throw new UserNotFoundException("You are not the owner of this item.");
        }

        offer.setStatus(OfferStatus.ACCEPTED);
        Offer savedOffer = offerRepository.save(offer);

        return toOfferDTO(savedOffer);
    }

    public OfferDTO declineOffer(Integer offerId, String email) {
        Offer offer =
                offerRepository.findById(offerId).orElseThrow(() -> new OfferNotFoundException("Offer not found"));

        // Check if the user is the owner of the item
        User itemOwner = offer.getItem().getUser(); // Assuming you have a getOwner() method in Item entity
        if (!itemOwner.getEmail().equals(email)) {
            throw new UserNotFoundException("You are not the owner of this item.");
        }

        offer.setStatus(OfferStatus.DECLINED);
        Offer savedOffer = offerRepository.save(offer);

        return toOfferDTO(savedOffer);
    }
}
