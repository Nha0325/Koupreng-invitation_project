package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {

    List<Guest> findByInvitationIdOrderByCreatedAtDesc(Long invitationId);

    Optional<Guest> findByIdAndInvitationId(Long id, Long invitationId);

    Optional<Guest> findByInvitationIdAndInviteToken(Long invitationId, String inviteToken);

    Optional<Guest> findByInvitationIdAndEmailIgnoreCase(Long invitationId, String email);

    Optional<Guest> findByInvitationIdAndPhone(Long invitationId, String phone);

    boolean existsByInviteToken(String inviteToken);

    long countByInvitationId(Long invitationId);

    @Query("""
            select g
            from Guest g
            where g.invitation.id = :invitationId
              and (
                lower(g.guestName) like lower(concat('%', :keyword, '%'))
                or lower(coalesce(g.phone, '')) like lower(concat('%', :keyword, '%'))
                or lower(coalesce(g.email, '')) like lower(concat('%', :keyword, '%'))
              )
            order by g.createdAt desc
            """)
    List<Guest> search(
            @Param("invitationId") Long invitationId,
            @Param("keyword") String keyword
    );
}
