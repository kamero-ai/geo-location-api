import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in Java & Spring Boot: Get Location from IP (2026)",
  description:
    "Get geolocation data from IP addresses in Java using a free API. Covers HttpClient, RestTemplate, WebClient, Spring Boot integration, caching, and filters.",
  keywords: ["java ip geolocation", "spring boot geolocation", "java get location from ip", "ip geolocation api java", "resttemplate ip location", "webclient geolocation", "java ip lookup", "spring boot ip address location"],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-java-spring-boot" },
  openGraph: { title: "IP Geolocation in Java & Spring Boot", description: "Get location from IP addresses in Java using a free geolocation API.", url: "https://geo.kamero.ai/blog/ip-geolocation-java-spring-boot", type: "article", publishedTime: "2026-01-12T00:00:00Z" },
};

export default function JavaPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>IP Geolocation in Java &amp; Spring Boot: Get Location from IP</h1>
        <p className="post-meta">Jan 12, 2026 · 10 min read</p>

        <p>Java remains one of the most widely used languages for backend services. Adding IP geolocation to your Java application enables location-based personalization, fraud detection, and compliance features. This guide covers plain Java, Spring Boot, and reactive approaches.</p>

        <h2>Java HttpClient (Java 11+)</h2>
        <pre><code>{`import java.net.http.*;
import java.net.URI;
import com.fasterxml.jackson.databind.ObjectMapper;

var client = HttpClient.newHttpClient();
var request = HttpRequest.newBuilder()
    .uri(URI.create("https://geo.kamero.ai/api/geo"))
    .timeout(Duration.ofSeconds(5))
    .GET()
    .build();

var response = client.send(request,
    HttpResponse.BodyHandlers.ofString());

var mapper = new ObjectMapper();
var geo = mapper.readValue(
    response.body(), GeoResponse.class);

System.out.printf("%s, %s (%s)%n",
    geo.city(), geo.country(), geo.timezone());`}</code></pre>

        <h2>Data Model</h2>
        <pre><code>{`// Using Java record (Java 16+)
public record GeoResponse(
    String ip,
    String city,
    String country,
    String countryRegion,
    String continent,
    String latitude,
    String longitude,
    String timezone,
    String postalCode,
    String region
) {}`}</code></pre>

        <h2>Spring Boot with RestTemplate</h2>
        <pre><code>{`@Service
public class GeoLocationService {

    private final RestTemplate rest;

    public GeoLocationService(RestTemplateBuilder builder) {
        this.rest = builder
            .setConnectTimeout(Duration.ofSeconds(3))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
    }

    public Optional<GeoResponse> getLocation() {
        try {
            var geo = rest.getForObject(
                "https://geo.kamero.ai/api/geo",
                GeoResponse.class);
            return Optional.ofNullable(geo);
        } catch (RestClientException e) {
            log.warn("Geo lookup failed: {}", e.getMessage());
            return Optional.empty();
        }
    }
}`}</code></pre>

        <h2>Reactive with WebClient</h2>
        <pre><code>{`@Service
public class ReactiveGeoService {

    private final WebClient webClient;

    public ReactiveGeoService(WebClient.Builder builder) {
        this.webClient = builder
            .baseUrl("https://geo.kamero.ai")
            .build();
    }

    public Mono<GeoResponse> getLocation() {
        return webClient.get()
            .uri("/api/geo")
            .retrieve()
            .bodyToMono(GeoResponse.class)
            .timeout(Duration.ofSeconds(5))
            .onErrorResume(e -> {
                log.warn("Geo lookup failed: {}",
                    e.getMessage());
                return Mono.empty();
            });
    }
}`}</code></pre>

        <h2>Add Caching with Spring Cache</h2>
        <pre><code>{`@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        var cache = new ConcurrentMapCacheManager("geo");
        return cache;
    }
}

@Service
public class CachedGeoService {

    private final GeoLocationService geoService;

    @Cacheable(value = "geo", key = "'current'")
    public Optional<GeoResponse> getLocation() {
        return geoService.getLocation();
    }

    @CacheEvict(value = "geo", allEntries = true)
    @Scheduled(fixedRate = 600_000) // 10 minutes
    public void evictCache() {
        log.debug("Geo cache evicted");
    }
}`}</code></pre>

        <h2>Servlet Filter for Request Enrichment</h2>
        <pre><code>{`@Component
@Order(1)
public class GeoLocationFilter extends OncePerRequestFilter {

    private final GeoLocationService geoService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws Exception {

        geoService.getLocation().ifPresent(geo -> {
            request.setAttribute("geoCountry",
                geo.country());
            request.setAttribute("geoCity",
                geo.city());
            request.setAttribute("geoTimezone",
                geo.timezone());
        });

        chain.doFilter(request, response);
    }
}`}</code></pre>

        <h2>Use in a Controller</h2>
        <pre><code>{`@RestController
@RequestMapping("/api")
public class LocationController {

    private final GeoLocationService geoService;

    @GetMapping("/my-location")
    public ResponseEntity<GeoResponse> getLocation() {
        return geoService.getLocation()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .build());
    }

    @GetMapping("/greeting")
    public Map<String, String> greeting(
            HttpServletRequest request) {
        var country = (String) request
            .getAttribute("geoCountry");
        var greeting = switch (country) {
            case "JP" -> "こんにちは";
            case "ES", "MX" -> "¡Hola!";
            case "FR" -> "Bonjour";
            case "DE" -> "Hallo";
            default -> "Hello";
        };
        return Map.of("greeting", greeting);
    }
}`}</code></pre>

        <h2>Key Takeaways</h2>
        <ul>
          <li>Java records make clean, immutable geo data models</li>
          <li>Use <code>RestTemplate</code> for blocking or <code>WebClient</code> for reactive apps</li>
          <li>Spring Cache reduces redundant API calls</li>
          <li>Servlet filters enrich every request with location data</li>
          <li>Always set timeouts and handle failures with <code>Optional</code></li>
        </ul>

        <div className="blog-post-cta">
          <h3>Try the API</h3>
          <p>Free IP geolocation with no API key — works with any Java HTTP client.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}