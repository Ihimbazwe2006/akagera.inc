import React, { useState, useEffect } from 'react';
import '../index.css';

const ImageCarousel = ({ images = [], autoSlide = true, interval = 5000, showDescriptions = false, descriptions = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(autoSlide);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from database on mount
  useEffect(() => {

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://akagerainc.onrender.com/api';
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin-xyz789-control/images?password=Admin@Akagera2024!`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            // For each image, if url is missing, fetch base64 data
            const imagesWithData = await Promise.all(
              data.images.map(async (img) => {
                if (img.url) {
                  return {
                    id: img.id,
                    url: img.url,
                    alt: img.alt_text || 'Carousel Image',
                    description: img.alt_text || '',
                  };
                } else {
                  // Fetch base64 data from backend
                  try {
                    const imgDataRes = await fetch(`${API_BASE_URL}/admin-xyz789-control/images/${img.id}/data?password=Admin@Akagera2024!`);
                    if (imgDataRes.ok) {
                      const imgData = await imgDataRes.json();
                      return {
                        id: img.id,
                        url: imgData.data, // base64 string
                        alt: imgData.alt_text || 'Carousel Image',
                        description: imgData.alt_text || '',
                      };
                    }
                  } catch (e) {
                    // Ignore and skip image
                  }
                  return null;
                }
              })
            );
            const validImages = imagesWithData.filter(Boolean);
            if (validImages.length > 0) {
              setCarouselImages(validImages);
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      }
      // Fallback to provided images or defaults
      const defaultImages = [
        {
          url: 'https://via.placeholder.com/1200x400/0B3C5D/FFFFFF?text=Akagera+Inc',
          alt: 'Akagera Inc',
          description: 'Akagera Inc delivers real, innovative mobile solutions tailored for Africa. Our platforms empower businesses and individuals with technology that makes a difference.'
        },
        {
          url: 'https://via.placeholder.com/1200x400/06D6A0/FFFFFF?text=Mobile+Apps',
          alt: 'Mobile Apps',
          description: 'Explore our suite of mobile apps designed for productivity, education, and seamless digital experiences. We turn ideas into reality for a smarter tomorrow.'
        },
        {
          url: 'https://via.placeholder.com/1200x400/F77F00/FFFFFF?text=Best+Experience',
          alt: 'Best Experience',
          description: 'Experience top quality service, robust support, and a commitment to excellence. Akagera Inc is your trusted partner in digital transformation.'
        },
      ];
      setCarouselImages(images.length > 0 ? images : defaultImages);
      setLoading(false);
    };

    fetchImages();
  }, [images]);

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoSliding || carouselImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoSliding, interval, carouselImages.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoSliding(false);
    // Resume auto-slide after 10 seconds of inactivity
    setTimeout(() => setIsAutoSliding(autoSlide), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(autoSlide), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(autoSlide), 10000);
  };

  if (loading || carouselImages.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-wrapper" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {/* Images */}
        <div className="carousel-slides">
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image.url || (image.id ? `/api/admin-xyz789-control/images/${image.id}/data?password=Admin@Akagera2024!` : '')}
              alt={image.alt}
              className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
              style={{objectFit: 'cover'}}
            />
          ))}
        </div>

        {/* Overlay with Text Description */}
        {showDescriptions && carouselImages[currentIndex]?.description && (
          <div className="carousel-text-overlay">
            <div className="carousel-text-content">
              <p className="carousel-description">{carouselImages[currentIndex].description}</p>
            </div>
          </div>
        )}

        {/* Dots/Indicators */}
        <div className="carousel-dots">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`dot${index === currentIndex ? ' active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-container {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .carousel-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 0;
          box-shadow: none;
          background: #f0f0f0;
          width: 100%;
          height: 700px;
        }

        @media (max-width: 768px) {
          .carousel-wrapper {
            height: 500px;
          }
        }

        @media (max-width: 480px) {
          .carousel-wrapper {
            height: 400px;
          }
        }

        .carousel-slides {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .carousel-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }

        .carousel-slide.active {
          opacity: 1;
        }
        
        .carousel-slides::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 100, 200, 0.6));
          z-index: 5;
        }

        .carousel-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 15;
        }

        .dot {
          width: 2px;
          height: 2px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 2px;
        }

        .dot.active {
          background: rgba(255, 255, 255, 1);
          width: 16px;
          height: 2px;
          border-radius: 2px;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .carousel-text-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .carousel-text-content {
          text-align: center;
          color: white;
          font-family: 'Montserrat', sans-serif;
        }

        .carousel-description {
          font-size: 2.8rem;
          font-weight: 700;
          text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.85);
          margin: 0;
          padding: 0 40px;
          letter-spacing: 0.5px;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .carousel-description {
            font-size: 1.5rem;
            padding: 0 20px;
          }
        }

        @media (max-width: 480px) {
          .carousel-description {
            font-size: 1rem;
            padding: 0 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageCarousel;
