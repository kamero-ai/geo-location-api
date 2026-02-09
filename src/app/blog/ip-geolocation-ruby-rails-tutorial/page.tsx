import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in Ruby on Rails: Detect Visitor Location (Free API)",
  description:
    "Get visitor location by IP address in Ruby and Rails using a free geolocation API. Covers Net::HTTP, Faraday, Rails controller concerns, caching, and middleware.",
  keywords: ["ruby ip geolocation", "rails ip location", "ruby on rails geolocation", "ruby detect country ip", "rails visitor location", "ruby net http geolocation", "rails middleware ip location", "free ip api ruby"],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-ruby-rails-tutorial" },
  openGraph: { title: "IP Geolocation in Ruby on Rails", description: "Detect visitor location in Ruby and Rails with a free API.", url: "https://geo.kamero.ai/blog/ip-geolocation-ruby-rails-tutorial", type: "article", publishedTime: "2026-01-08T00:00:00Z" },
};

export default function RubyRailsPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>IP Geolocation in Ruby on Rails: Detect Visitor Location</h1>
        <p className="post-meta">Jan 8, 2026 · 7 min read</p>

        <p>Ruby on Rails powers thousands of production web apps. Adding IP geolocation lets you personalize content, detect timezones, and log visitor geography. Here&apos;s how to do it with a free API — no gems required.</p>

        <h2>Basic Ruby: Net::HTTP</h2>
        <pre><code>{`require "net/http"
require "json"

uri = URI("https://geo.kamero.ai/api/geo")
response = Net::HTTP.get(uri)
location = JSON.parse(response)

puts "IP: #{location['ip']}"
puts "City: #{location['city']}"
puts "Country: #{location['country']}"
puts "Timezone: #{location['timezone']}"`}</code></pre>

        <h2>With Error Handling</h2>
        <pre><code>{`require "net/http"
require "json"

def get_geolocation
  uri = URI("https://geo.kamero.ai/api/geo")
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  http.open_timeout = 3
  http.read_timeout = 5

  response = http.get(uri.path)

  if response.code == "200"
    JSON.parse(response.body)
  else
    nil
  end
rescue StandardError => e
  Rails.logger.error("Geolocation failed: #{e.message}")
  nil
end`}</code></pre>

        <h2>Rails Controller Concern</h2>
        <pre><code>{`# app/controllers/concerns/geolocatable.rb
module Geolocatable
  extend ActiveSupport::Concern

  private

  def visitor_location
    @visitor_location ||= fetch_location
  end

  def visitor_country
    visitor_location&.dig("country")
  end

  def visitor_timezone
    visitor_location&.dig("timezone") || "UTC"
  end

  def fetch_location
    cache_key = "geo:#{request.remote_ip}"

    Rails.cache.fetch(cache_key, expires_in: 1.hour) do
      uri = URI("https://geo.kamero.ai/api/geo")
      response = Net::HTTP.get_response(uri)
      response.code == "200" ? JSON.parse(response.body) : nil
    end
  rescue StandardError
    nil
  end
end

# Usage in any controller:
class HomeController < ApplicationController
  include Geolocatable

  def index
    @city = visitor_location&.dig("city") || "there"
    @country = visitor_country
  end
end`}</code></pre>

        <h2>Rails Middleware</h2>
        <pre><code>{`# lib/middleware/geolocation.rb
class GeolocationMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    begin
      uri = URI("https://geo.kamero.ai/api/geo")
      response = Net::HTTP.get_response(uri)
      if response.code == "200"
        env["geo.location"] = JSON.parse(response.body)
      end
    rescue StandardError
      # Silently fail
    end

    @app.call(env)
  end
end

# config/application.rb
config.middleware.use GeolocationMiddleware

# Access in controllers:
# request.env["geo.location"]`}</code></pre>

        <h2>Using Faraday (Popular HTTP Client)</h2>
        <pre><code>{`# Gemfile: gem "faraday"

require "faraday"

class GeoService
  def self.lookup
    conn = Faraday.new(url: "https://geo.kamero.ai") do |f|
      f.request :json
      f.response :json
      f.options.timeout = 5
    end

    response = conn.get("/api/geo")
    response.success? ? response.body : nil
  rescue Faraday::Error => e
    Rails.logger.warn("Geo lookup failed: #{e.message}")
    nil
  end
end

# Usage:
location = GeoService.lookup
puts location["city"] if location`}</code></pre>

        <h2>Background Job: Enrich User Records</h2>
        <pre><code>{`# app/jobs/enrich_user_location_job.rb
class EnrichUserLocationJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    location = GeoService.lookup

    if location
      user.update(
        detected_country: location["country"],
        detected_city: location["city"],
        detected_timezone: location["timezone"]
      )
    end
  end
end

# Trigger on sign-up:
after_create :enrich_location
def enrich_location
  EnrichUserLocationJob.perform_later(id)
end`}</code></pre>

        <h2>View Helper</h2>
        <pre><code>{`# app/helpers/geo_helper.rb
module GeoHelper
  def local_time(time, format: :short)
    tz = controller.try(:visitor_timezone) || "UTC"
    time.in_time_zone(tz).to_fs(format)
  end

  def visitor_greeting
    city = controller.try(:visitor_location)&.dig("city")
    city ? "Welcome from #{city}!" : "Welcome!"
  end
end`}</code></pre>

        <div className="blog-post-cta">
          <h3>Works with Any Ruby HTTP Client</h3>
          <p>Standard JSON API. No gem needed, no API key.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
