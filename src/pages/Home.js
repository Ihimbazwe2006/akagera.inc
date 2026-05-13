import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Settings, Palette, Wrench, MapPin, Star, Download, TrendingUp, Users, Shield, Award, Globe } from 'lucide-react';
import GoogleAuthButton from '../components/GoogleAuthButton';
import ImageCarousel from '../components/ImageCarousel';
import { appAPI, serviceAPI } from '../api';

function Home({ onLogin, user }) {
  const [apps, setApps] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredApp, setHoveredApp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, servicesRes] = await Promise.all([
          appAPI.getAll(),
          serviceAPI.getAll()
        ]);
        setApps(appsRes.data.slice(0, 4)); // Show first 4 apps
        setServices(servicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC2wC17WKmvVakM4wMnA36L23-Egqo41kw&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      // Musanze, Rwanda coordinates
      const musanzeLocation = { lat: -1.499228, lng: 29.635975 };
      
      const map = new window.google.maps.Map(document.getElementById('google-map'), {
        center: musanzeLocation,
        zoom: 15,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add custom marker
      const marker = new window.google.maps.Marker({
        position: musanzeLocation,
        map: map,
        title: 'Akagera Inc - Musanze, Rwanda',
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: 'Poppins', sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1a1a1a;">Akagera Inc</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>📍 Musanze, Rwanda</strong><br/>
              Main Office - Innovation Hub<br/>
              +250 795 226 123
            </p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Automatically open info window on load
      infoWindow.open(map, marker);
    };

    loadGoogleMapsScript();

    return () => {
      // Cleanup
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  const getServiceIcon = (serviceId) => {
    const icons = {
      1: <Smartphone size={40} />,
      2: <Settings size={40} />,
      3: <Palette size={40} />,
      4: <Wrench size={40} />
    };
    return icons[serviceId] || <Smartphone size={40} />;
  };

  const buildServiceImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (/^https?:\/\//.test(imageUrl)) {
      return imageUrl;
    }

    const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:8000';
    let normalized = imageUrl.replace(/\\/g, '/').replace(/^\/+/, '');

    if (!normalized.startsWith('uploads/')) {
      if (normalized.startsWith('services/')) {
        normalized = `uploads/${normalized}`;
      } else {
        normalized = `uploads/services/${normalized}`;
      }
    }

    return `${baseUrl}/${normalized}`;
  };

  // Stats data
  const stats = [
    { icon: <Users size={32} />, value: '10K+', label: 'Active Users' },
    { icon: <Download size={32} />, value: '50K+', label: 'App Downloads' },
    { icon: <Star size={32} />, value: '4.9', label: 'User Rating' },
    { icon: <Globe size={32} />, value: '5+', label: 'Countries' }
  ];

  return (
    <>
      {/* Hero Carousel Section */}
      <section className="hero">
        <ImageCarousel autoSlide={true} interval={5000} showDescriptions={false} />
        
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text" data-aos="fade-right">
                <h1>Akagera Inc – Smart Mobile Solutions</h1>
                <p style={{
                  fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                  lineHeight: '1.6'
                }}>
                  Akagera Inc is dedicated to building powerful, user-friendly mobile applications and websites that solve real-world problems and drive productivity. Our mission is to empower individuals and businesses across the world with innovative digital solutions, from business tools to educational platforms.
                </p>
                <div className="hero-buttons">
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={() => document.querySelector('#auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                  </button>
                  <Link to="/apps" className="btn btn-outline btn-large">
                    Explore Apps
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Section - Android & iOS */}
      <section className="platform-section section-padding" style={{ background: '#2a2461' }}>
        <div className="container">
          <div className="section-title" data-aos="fade-up" style={{ color: 'white' }}>
            <h2 style={{ color: 'white' }}>Cross-Platform Excellence</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>
              We develop high-performance applications for both major mobile platforms and we develop web app services
            </p>
          </div>

          <div className="platform-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '50px'
          }}>
            {/* Android Card */}
            <div className="platform-card" data-aos="fade-right" data-aos-delay="100" style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
            }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '40px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  transition: '0.3s'
                }}
              >
                {/* Android Icon Circle */}
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 25px',
                    background: 'linear-gradient(135deg, #3DDC84, #00C853)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(61,220,132,0.3)'
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
                    alt="Android Logo"
                    style={{
                      width: '55px',
                      height: '55px',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '1.8rem',
                    marginBottom: '15px',
                    color: '#333'
                  }}
                >
                  Android Apps
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}
                >
                  We develop high-quality Android applications tailored to businesses, startups, and individuals who want reliable and modern mobile solutions. Our team focuses on creating fast, secure, and user-friendly apps with attractive designs and smooth performance across Android devices. We build utility apps, business platforms, e-commerce systems, tracking applications, educational tools, and custom mobile solutions based on client requirements. From idea planning and UI/UX design to development, testing, and deployment, we provide complete Android app development services. We use modern technologies to ensure scalability, performance, and long-term support. Our goal is to help clients grow digitally through innovative, professional, and affordable Android applications.
                </p>

                {/* Tech Tags */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}
                >
                  {['Kotlin', 'Java', 'Flutter'].map((tech) => (
                    <span
                      key={tech}
                      style={{
                        background: '#f0f0f0',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        color: '#666',
                        fontWeight: '500'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Apple Section */}
                <div style={{ marginTop: '40px' }}>
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      margin: '0 auto 25px',
                      background: 'linear-gradient(135deg, #444, #111)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
                    }}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      alt="Apple Logo"
                      style={{
                        width: '45px',
                        height: '45px',
                        objectFit: 'contain',
                        filter: 'invert(1)'
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.8rem',
                      marginBottom: '15px',
                      color: '#333'
                    }}
                  >
                    iOS Apps
                  </h3>

                  <p
                    style={{
                      color: '#666',
                      lineHeight: '1.6',
                      marginBottom: '20px'
                    }}
                  >
                    We create professional iOS applications designed for businesses, startups, and individuals who need powerful and modern mobile solutions for Apple devices. Our development process focuses on performance, security, clean design, and a smooth user experience across iPhones and iPads. We develop business apps, utility applications, e-commerce platforms, educational systems, tracking tools, and fully customized mobile solutions tailored to client needs. From concept planning and UI/UX design to coding, testing, and App Store deployment, we provide complete iOS app development services. Using modern technologies and industry standards, we deliver scalable and reliable applications that help clients expand their digital presence and reach more users worldwide.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '15px',
                      flexWrap: 'wrap'
                    }}
                  >
                    {['Swift', 'SwiftUI', 'Xcode'].map((tech) => (
                      <span
                        key={tech}
                        style={{
                          background: '#f0f0f0',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          color: '#666',
                          fontWeight: '500'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                
                </div>

                <div style={{ marginTop: '40px' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 25px',
                    background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
                    alt="Website Development"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: '1.8rem',
                    marginBottom: '15px',
                    color: '#333'
                  }}
                >
                  Website Development
                </h3>

                <p
                  style={{
                    color: '#666',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}
                >
                  We create professional websites designed for businesses, startups, organizations, and individuals who need modern and reliable online platforms. Our development process focuses on performance, security, responsive design, and a smooth user experience across all devices. We develop business websites, e-commerce platforms, portfolio websites, management systems, educational platforms, booking systems, and fully customized web solutions tailored to client requirements. From planning and UI/UX design to development, testing, deployment, and maintenance, we provide complete website development services. Using modern technologies and industry standards, we deliver scalable and high-quality websites that help clients strengthen their digital presence and reach more customers worldwide.
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}
                >
                  {['HTML', 'CSS', 'JavaScript', 'React'].map((tech) => (
                    <span
                      key={tech}
                      style={{
                        background: '#f0f0f0',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        color: '#666',
                        fontWeight: '500'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              </div>

           
          </div>
        </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" style={{ background: 'white', padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <div key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                <div style={{ color: 'var(--primary)', marginBottom: '10px' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>{stat.value}</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="services section-padding"
        style={{
          backgroundImage: "url('/service.jpg')",
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        <div className="container" style={{position:'relative',zIndex:2}}>
          <div className="section-title" data-aos="fade-up">
            <h2 style={{color:'#fff'}}>Our Services</h2>
            <p style={{color:'#fff'}}>
              We offer a range of professional digital services, including custom app development, business automation, and technology consulting. Our team works closely with you to understand your unique needs and deliver solutions that help your business grow and succeed in a competitive digital landscape.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => {
              const serviceImageUrl = buildServiceImageUrl(service.image_url);
              return (
                <div 
                  key={service.id}
                  className="service-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  style={{background:'rgba(255,255,255,0.92)',borderRadius:16}}
                >
                  {serviceImageUrl ? (
                    <img
                      src={serviceImageUrl}
                      alt={service.name}
                      className="service-card-img"
                    />
                  ) : (
                    <div className="service-card-icon">
                      {getServiceIcon(service.id)}
                    </div>
                  )}
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <p style={{ fontSize: '1.5rem', color: '#000', fontWeight: 'bold' }}>
                    ${parseFloat(service.price).toFixed(2)}
                  </p>
                  <Link to="/services" className="btn btn-secondary">
                    Learn More
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.55)',zIndex:1}}></div>
      </section>

      {/* Featured Apps Section - Redesigned Cards */}
     <section
  className="apps section-padding"
  style={{
    background: "#fff",
    padding: "70px 0",
  }}
>
  <div className="container">
    {/* Header */}
    <div
      className="section-title"
      style={{
        marginBottom: "35px",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#111",
          marginBottom: "10px",
        }}
      >
        Featured Apps
      </h2>

      <p
        style={{
          color: "#666",
          maxWidth: "700px",
          lineHeight: "1.7",
        }}
      >
        Explore our latest Android and iOS applications designed for
        productivity, business, and everyday use.
      </p>
    </div>

    {loading ? (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner"></div>
      </div>
    ) : (
      <>
        {/* Play Store Style Layout */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "25px",
          }}
        >
          {apps.map((app, index) => (
            <div
              key={app.id}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              style={{
                width: "180px",
                cursor: "pointer",
                transition: "0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* App Image */}
              <div
                style={{
                  width: "180px",
                  height: "180px",
                  background: "#f1f1f1",
                  overflow: "hidden",
                  marginBottom: "12px",
                }}
              >
                {app.app_logo ? (
                  <img
                    src={`https://akagerainc.onrender.com/uploads/${app.app_logo}`}
                    alt={app.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "60px",
                    }}
                  >
                    📱
                  </div>
                )}
              </div>

              {/* App Info */}
              <div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#111",
                    marginBottom: "5px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {app.name}
                </h3>

                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginBottom: "8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {app.short_description}
                </p>

                {/* Rating */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginBottom: "12px",
                  }}
                >
                  <Star
                    size={14}
                    fill="#000"
                    stroke="#000"
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#444",
                    }}
                  >
                    4.8
                  </span>
                </div>

                {/* Download Button */}
                <Link
                  to={`/apps/${app.id}`}
                  style={{
                    display: "inline-block",
                    background: "#000",
                    color: "#fff",
                    padding: "10px 18px",
                    textDecoration: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#222";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#000";
                  }}
                >
                  Download Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Apps Button */}
        <div
          style={{
            marginTop: "45px",
          }}
        >
          <Link
            to="/apps"
            style={{
              display: "inline-block",
              background: "#000",
              color: "#fff",
              padding: "14px 30px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#222";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#000";
            }}
          >
            View All Apps
          </Link>
        </div>
      </>
    )}
  </div>
</section>
      {/* Google Maps Location Section */}
      <section className="map-section section-padding" style={{ background: 'var(--light-gray)' }}>
        <div className="container">
          <div className="section-title" data-aos="fade-up">
            <h2>📍 Our Location</h2>
            <p>
              Visit us at our headquarters in Musanze, Rwanda. We're conveniently located in the heart of the city's innovation district.
            </p>
          </div>

          <div className="map-container" data-aos="fade-up" data-aos-delay="100">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              alignItems: 'center',
              background: 'var(--white)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--box-shadow)'
            }}>
              {/* Map Column */}
              <div style={{ height: '450px', position: 'relative' }}>
                <div 
                  id="google-map" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: '0'
                  }}
                ></div>
              </div>

              {/* Location Details Column */}
              <div style={{ padding: '40px' }}>
                <div style={{ marginBottom: '30px' }}>
                  <MapPin size={48} style={{ color: 'var(--primary)', marginBottom: '15px' }} />
                  <h3 style={{ 
                    fontFamily: "'Montserrat', sans-serif", 
                    fontSize: '1.8rem', 
                    marginBottom: '15px',
                    color: 'var(--dark)'
                  }}>
                    Akagera Inc Headquarters
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--dark-gray)' }}>
                    <strong>📍 Address:</strong><br />
                    Innovation Hub Building<br />
                    Main Street, Musanze District<br />
                    Northern Province, Rwanda
                  </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--dark-gray)' }}>
                    <strong>🕒 Office Hours:</strong><br />
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <a 
                    href="https://maps.google.com/?q=Musanze,Rwanda" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Get Directions <ArrowRight size={18} />
                  </a>
                  <a 
                    href="https://maps.google.com/?q=Musanze,Rwanda&force=pano" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Street View
                  </a>
                </div>

                <div style={{ marginTop: '25px', paddingTop: '25px', borderTop: '1px solid #e0e0e0' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--dark-gray)' }}>
                    <strong>🚗 How to get here:</strong><br />
                    Located near the Musanze Main Market, 5 minutes from the Bus Park. Free parking available for visitors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact section-padding">
        <div className="container">
          <div className="contact-content" data-aos="fade-up">
            <h2>Get in Touch</h2>
            <p>
              Have questions or need support? Our team is here to help you with any inquiries about our products, services, or partnership opportunities.
              Reach out to us and let's build something great together.
            </p>

            <div className="contact-info">
              <div className="contact-item" data-aos="fade-up" data-aos-delay="100">
                <h3><i className="fas fa-envelope" style={{ marginRight: '10px' }}></i>Gmail</h3>
                <p>akagerainc@gmail.com</p>
                <a href="mailto:akagerainc@gmail.com" className="btn btn-outline"
                   style={{ color: 'white', borderColor: 'white', marginTop: '10px' }}>
                  Email Us
                </a>
              </div>

              <div className="contact-item" data-aos="fade-up" data-aos-delay="200">
                <h3><i className="fas fa-phone" style={{ marginRight: '10px' }}></i>Phone</h3>
                <p>+250 795 226 123</p>
                <a href="tel:+250795226123" className="btn btn-outline"
                   style={{ color: 'white', borderColor: 'white', marginTop: '10px' }}>
                  Call Us
                </a>
              </div>

              <div className="contact-item" data-aos="fade-up" data-aos-delay="300">
                <h3><i className="fab fa-whatsapp" style={{ marginRight: '10px' }}></i>WhatsApp</h3>
                <p>Chat with us on WhatsApp</p>
                <a href="https://wa.me/250795226123" target="_blank" rel="noopener noreferrer"
                   className="btn btn-outline"
                   style={{ color: 'white', borderColor: 'white', marginTop: '10px' }}>
                  Chat Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .map-container > div {
            grid-template-columns: 1fr !important;
          }
          .map-container div[style*="height: 450px"] {
            height: 300px !important;
          }
          .map-container div[style*="padding: 40px"] {
            padding: 30px !important;
          }
          .platform-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

export default Home;