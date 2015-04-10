package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.social.security.SocialUserDetailsService;
import org.springframework.social.security.SpringSocialConfigurer;

@Configuration
@EnableWebSecurity
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	@Override
    public void configure(WebSecurity webSecurity) throws Exception
    {
        webSecurity.ignoring().antMatchers("/resources/**");
    }

	@Override
	protected void configure(HttpSecurity http) throws Exception {

	    http.httpBasic()
//	      .csrf().disable()
//	        .authorizeRequests()
//	            .antMatchers(HttpMethod.GET, "/user").authenticated()
//	            .and()
//	        .authorizeRequests().antMatchers(HttpMethod.POST, "/user").permitAll()
	      .and().authorizeRequests()
	          .antMatchers("/index.html", "/partials/signin.html", "/partials/signup.html", "/", "/auth/**", "/signup/**").permitAll()
	      .and().authorizeRequests().antMatchers("/user", "/test").authenticated()
//	      .anyRequest().authenticated()
	      .and().authorizeRequests().antMatchers("/userRoute/**").authenticated()
	      .and().authorizeRequests().antMatchers(HttpMethod.POST, "/accounts").permitAll()
	      .and().authorizeRequests().antMatchers(HttpMethod.GET, "/articles", "/articles/*", "/articles/*/*").permitAll()
	      .and().authorizeRequests().antMatchers(HttpMethod.POST, "/articles", "/articles/*", "/articles/*/*").hasRole("ADMIN")
	      .and().authorizeRequests().antMatchers(HttpMethod.PUT, "/articles", "/articles/*", "/articles/*/*").hasRole("ADMIN")
	      .and().authorizeRequests().antMatchers(HttpMethod.DELETE, "/articles", "/articles/*", "/articles/*/*").hasRole("ADMIN")
	      .and().authorizeRequests().antMatchers(HttpMethod.GET, "/articles/*/*/comments/**").permitAll()
          .and().authorizeRequests().antMatchers(HttpMethod.POST, "/articles/*/*/comments").hasAnyRole("USER","ADMIN")
          .and().authorizeRequests().antMatchers(HttpMethod.PUT, "/articles/*/*/comments/*").hasRole("ADMIN")
          .and().authorizeRequests().antMatchers(HttpMethod.DELETE, "/articles/*/*/comments/**").hasRole("ADMIN")
          .and().authorizeRequests().antMatchers(HttpMethod.GET, "/accounts/**").hasRole("ADMIN")
          .and().authorizeRequests().antMatchers(HttpMethod.POST, "/accounts/users").permitAll()
          .and().authorizeRequests().antMatchers(HttpMethod.POST, "/accounts/doctors/**", "/accounts/admins/**").hasRole("ADMIN")
          .and().authorizeRequests().antMatchers(HttpMethod.PUT, "/accounts/**").hasRole("ADMIN")
          .and().authorizeRequests().antMatchers(HttpMethod.DELETE, "/accounts/**").hasRole("ADMIN")
          .and()
            .apply(getSpringSocialConfigurer())
	      .and().logout()
	      .and().addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
	      .csrf().csrfTokenRepository(csrfTokenRepository());
	}

	@Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
//	    auth.userDetailsService(new UserDetailServiceImpl());
		auth.inMemoryAuthentication()
		    .withUser("user").password("password").roles("USER")
		    .and().withUser("admin").password("password").roles("ADMIN");
    }

	private SpringSocialConfigurer getSpringSocialConfigurer() {
        SpringSocialConfigurer config = new SpringSocialConfigurer();
        config.alwaysUsePostLoginUrl(true);
        config.postLoginUrl("/user");

        return config;
    }

    @Bean
    public SocialUserDetailsService socialUserDetailsService() {
        return new SimpleSocialUserDetailsService();
    }

	private CsrfTokenRepository csrfTokenRepository() {
		  HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
		  repository.setHeaderName("X-XSRF-TOKEN");
		  return repository;
		}
}
