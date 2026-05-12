import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Settings, Palette, Wrench, ArrowRight } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import { serviceAPI } from '../api';

function Services({ showToast }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceAPI.getAll();
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        showToast('Error loading services', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [showToast]);

  const getServiceIcon = (serviceId) => {
    const icons = {
      1: <Smartphone size={60} />,
      2: <Settings size={60} />,
      3: <Palette size={60} />,
      4: <Wrench size={60} />
    };
    return icons[serviceId] || <Smartphone size={60} />;
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

  const handleSelectService = (service) => {
    const user = localStorage.getItem('user');
    if (!user) {
      showToast('Please sign in to purchase services', 'error');
      navigate('/');
      return;
    }
    navigate('/payment', { state: { service } });
  };

  return (
    <>
      {/* Hero Carousel Section */}
      <section className="hero">
        <ImageCarousel autoSlide={true} interval={5000} />
        
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text" data-aos="fade-right">
                <h1>Our Professional Services</h1>
                <p>Akagera Inc is a technology company that provides innovative digital solutions including mobile app development, website creation, artificial intelligence systems, embedded and IoT technologies, cloud and database solutions, UI/UX design, and software maintenance services. The company aims to help businesses and individuals grow through modern, reliable, and intelligent technology solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div style={{ minHeight: 'calc(100vh - 700px)', paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="container">
        <h1 style={{ color: '#000', marginBottom: '15px', textAlign: 'center', marginTop: '40px' }}>
          Our Services
        </h1>
        <p style={{
          color: 'var(--dark-gray)',
          textAlign: 'center',
          marginBottom: '50px',
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto 50px'
        }}>
          Professional solutions tailored to your business needs. Choose the service that best fits your requirements.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {services.map((service, index) => (
              <div
                key={service.id}
                className="service-card"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                style={{
                  background: 'var(--white)',
                  boxShadow: 'var(--box-shadow)',
                  padding: '40px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  transition: 'var(--transition)',
                  border: '2px solid transparent'
                }}
              >
                {buildServiceImageUrl(service.image_url) ? (
                  <img
                    src={buildServiceImageUrl(service.image_url)}
                    alt={service.name}
                    className="service-card-img"
                    style={{ marginBottom: '25px' }}
                  />
                ) : (
                  <div className="service-card-icon" style={{ marginBottom: '25px' }}>
                    {getServiceIcon(service.id)}
                  </div>
                )}

                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '15px', fontSize: '1.5rem' }}>
                  {service.name}
                </h3>

                <p style={{ color: 'var(--dark-gray)', marginBottom: '30px', lineHeight: '1.6' }}>
                  {service.description}
                </p>

                <div style={{
                  background: 'var(--light-gray)',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '25px'
                }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--dark-gray)', marginBottom: '10px' }}>
                    Investment
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'var(--secondary-red)'
                  }}>
                    ${parseFloat(service.price).toFixed(2)}
                  </p>
                </div>

                <button
                  className="btn btn-primary btn-large"
                  onClick={() => handleSelectService(service)}
                  style={{ width: '100%' }}
                >
                  Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Service Packages Info */}
        <section style={{ marginTop: '80px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '30px' }}>
            What's Included
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div style={{
              background: 'var(--light-gray)',
              padding: '30px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>💼 Professional Support</h4>
              <p style={{ color: 'var(--dark-gray)' }}>
                Dedicated support team to help you throughout your journey
              </p>
            </div>

            <div style={{
              background: 'var(--light-gray)',
              padding: '30px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>🔄 Updates & Maintenance</h4>
              <p style={{ color: 'var(--dark-gray)' }}>
                Regular updates and maintenance to ensure optimal performance
              </p>
            </div>

            <div style={{
              background: 'var(--light-gray)',
              padding: '30px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>🔐 Secure & Reliable</h4>
              <p style={{ color: 'var(--dark-gray)' }}>
                Enterprise-grade security with 99.9% uptime guarantee
              </p>
            </div>

            <div style={{
              background: 'var(--light-gray)',
              padding: '30px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>📊 Analytics & Reports</h4>
              <p style={{ color: 'var(--dark-gray)' }}>
                Comprehensive analytics to track your progress
              </p>
            </div>

            <div style={{
              background: 'var(--light-gray)',
              padding: '30px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>🚀 Fast Implementation</h4>
              <p style={{ color: 'var(--dark-gray)' }}>
                Quick turnaround time for faster deployment
              </p>
            </div>

            <div style={{
              background: 'var(--light-gray)',
              padding: '30px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: 'var(--primary-blue)', marginBottom: '15px' }}>📞 24/7 Support</h4>
              <p style={{ color: 'var(--dark-gray)' }}>
                Round-the-clock customer support via email, phone, and chat
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ marginTop: '80px' }}>
          <h2 style={{ color: 'var(--primary-blue)', marginBottom: '30px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>

          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            display: 'grid',
            gap: '20px'
          }}>
            {[
              {
                question: 'How do I start?',
                answer: 'Simply choose a service, complete the payment, and you\'ll receive immediate access along with a license key.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, mobile money, and bank transfers. Payments are processed securely through Stripe.'
              },
              {
                question: 'Is there a refund policy?',
                answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our services.'
              },
              {
                question: 'Can I upgrade my plan later?',
                answer: 'Absolutely! You can upgrade or downgrade your service at any time. Changes take effect immediately.'
              },
              {
                question: 'Is my data secure?',
                answer: 'Yes, we use enterprise-grade encryption and comply with international data protection standards.'
              },
              {
                question: 'How do I get technical support?',
                answer: 'Contact us via email (akagerainc@gmail.com), phone, WhatsApp, or through our support portal.'
              }
            ].map((faq, index) => (
              <details key={index} style={{
                background: 'var(--light-gray)',
                padding: '20px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <summary style={{
                  fontWeight: 'bold',
                  color: 'var(--primary-blue)',
                  outline: 'none'
                }}>
                  {faq.question}
                </summary>
                <p style={{
                  marginTop: '15px',
                  color: 'var(--dark-gray)',
                  lineHeight: '1.6'
                }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  );
}

export default Services;
