package it.polito.ai.virtualLabs.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtTokenFilter extends GenericFilterBean {

    private JwtTokenProvider jwtTokenProvider;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain)
            throws IOException, ServletException {
        String token = jwtTokenProvider.resolveToken((HttpServletRequest) req);
        if (token != null) {
            if(jwtTokenProvider.validateToken(token)) {
                Authentication auth = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                ((HttpServletResponse) res).setStatus(600);
            }
        }
        filterChain.doFilter(req, res);
    }

    /*
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain filterChain)
            throws IOException, ServletException {
        String token = jwtTokenProvider.resolveToken((HttpServletRequest) req);
        if (token != null) {
            try {
                if(!jwtTokenProvider.validateToken(token))
                    throw new InvalidJwtAuthenticationException("Token expired");
                Authentication auth = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (InvalidJwtAuthenticationException ex) {
                ((HttpServletResponse) res).setStatus(HttpStatus.LOCKED.value());
            }
        }
        filterChain.doFilter(req, res);
    }

     */
}
