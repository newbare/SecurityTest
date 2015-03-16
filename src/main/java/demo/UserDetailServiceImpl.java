package demo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

public class UserDetailServiceImpl implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        if (!username.equals("user"))
            throw new UsernameNotFoundException(username);

        ResponseEntity<String>  response = makeGetUserRequest(username);
        System.out.println(response.getStatusCode());

        System.out.println(response.toString());

        User userObj = getUser(username);

        List<GrantedAuthority> gas = new ArrayList<GrantedAuthority>();
        gas.add(new SimpleGrantedAuthority("ROLE_USER"));

        UserDetails user = new org.springframework.security.core.userdetails.User(
            username, userObj.getUserPassword(), true, true, true, true, gas);
        return user;
    }

    private ResponseEntity<String> makeGetUserRequest(String userName) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("http://localhost:8080/user");
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(builder.build().toUri(), HttpMethod.GET, entity, String.class);

        return response;
    }

    private User getUser(String username) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("http://localhost:8080/user");
        RestTemplate restTemplate = new RestTemplate();
        User user = null;

        user = restTemplate.getForObject(builder.toUriString(), User.class);

        return user;
    }

}
