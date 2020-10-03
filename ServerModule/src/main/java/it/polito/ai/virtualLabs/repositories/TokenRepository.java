package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.RefreshToken;
import it.polito.ai.virtualLabs.entities.RegistrationToken;
import it.polito.ai.virtualLabs.entities.Token;
import it.polito.ai.virtualLabs.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {

    @Query("SELECT rt FROM RegistrationToken rt WHERE rt.token = :token")
    Optional<RegistrationToken> findRegistrationToken(String token);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.token = :token")
    Optional<RefreshToken> findRefreshToken(String token);

    @Query("SELECT rt FROM RegistrationToken rt WHERE rt.token = :token")
    RegistrationToken getRegistrationToken(String token);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.token = :token")
    RefreshToken getRefreshToken(String token);

    @Query("SELECT rt FROM RegistrationToken rt WHERE rt.user.id = :id")
    Optional<RegistrationToken> findByUserId(String id);
}
