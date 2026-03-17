package com.demo.parkease.service;

import com.demo.parkease.dto.OwnerStatsResponse;
import com.demo.parkease.entity.*;
import com.demo.parkease.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)   // ← keeps session open so slots can be accessed
public class DashboardService {

    private final ParkingRepository     parkingRepository;
    private final ParkingSlotRepository parkingSlotRepository;
    private final BookingRepository     bookingRepository;
    private final UserRepository        userRepository;

    public DashboardService(ParkingRepository parkingRepository,
                            ParkingSlotRepository parkingSlotRepository,
                            BookingRepository bookingRepository,
                            UserRepository userRepository) {
        this.parkingRepository     = parkingRepository;
        this.parkingSlotRepository = parkingSlotRepository;
        this.bookingRepository     = bookingRepository;
        this.userRepository        = userRepository;
    }

    public OwnerStatsResponse getOwnerStats(Long ownerId) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        // JOIN FETCH ensures slots are loaded in one query — no lazy load needed
        List<Parking> parkings = parkingRepository.findByOwnerWithSlots(owner);

        List<Booking> allBookings = bookingRepository.findByParkingIn(parkings);

        List<ParkingSlot> allSlots = parkings.stream()
                .flatMap(p -> p.getSlots().stream())
                .toList();

        int totalParkings  = parkings.size();
        int totalSlots     = allSlots.size();

        int availableSlots = (int) allSlots.stream()
                .filter(s -> s.getStatus() == SlotStatus.AVAILABLE && !s.getDisabled()).count();

        int occupiedSlots  = (int) allSlots.stream()
                .filter(s -> s.getStatus() == SlotStatus.OCCUPIED && !s.getDisabled()).count();

        int disabledSlots  = (int) allSlots.stream()
                .filter(ParkingSlot::getDisabled).count();

        int activeBookings = (int) allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.ACTIVE).count();

        int totalBookings  = allBookings.size();

        double totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getAmount() != null ? b.getAmount() : 0.0)
                .sum();

        OwnerStatsResponse stats = new OwnerStatsResponse();
        stats.setTotalParkings(totalParkings);
        stats.setTotalSlots(totalSlots);
        stats.setAvailableSlots(availableSlots);
        stats.setOccupiedSlots(occupiedSlots);
        stats.setDisabledSlots(disabledSlots);
        stats.setActiveBookings(activeBookings);
        stats.setTotalBookings(totalBookings);
        stats.setTotalRevenue(totalRevenue);
        return stats;
    }
}