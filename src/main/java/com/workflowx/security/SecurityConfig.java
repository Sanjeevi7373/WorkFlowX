package com.workflowx.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, exception) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Please sign in to continue.\"}");
                })
                .accessDeniedHandler((request, response, exception) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"You do not have permission to access this resource.\"}");
                })
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()

                .requestMatchers("/api/admin/audit-logs/**")
                .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/users/me")
                .authenticated()

                .requestMatchers(HttpMethod.PUT, "/api/users/me")
                .authenticated()

                .requestMatchers("/api/users/**")
                .hasRole("ADMIN")

                .requestMatchers("/api/projects/**")
                .hasAnyRole("ADMIN", "MANAGER")

                .requestMatchers(HttpMethod.GET, "/api/tasks/**")
                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.POST, "/api/tasks/**")
                .hasAnyRole("ADMIN", "MANAGER")

                .requestMatchers(HttpMethod.PUT, "/api/tasks/**")
                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                .requestMatchers(HttpMethod.DELETE, "/api/tasks/**")
                .hasAnyRole("ADMIN", "MANAGER")

                .requestMatchers("/api/teams/**")
                .hasAnyRole("ADMIN", "MANAGER")

                .requestMatchers("/api/calendar/**")
                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                .requestMatchers("/api/notifications/**")
                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                .requestMatchers("/api/dashboard/**")
                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        String allowedOrigins = System.getenv().getOrDefault(
                "CORS_ALLOWED_ORIGINS",
                "https://workflowx-one.vercel.app"
        );
        configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList());

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("Authorization", "Content-Type", "Accept")
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
